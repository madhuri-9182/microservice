require("@babel/register")({
  extensions: [".js", ".jsx"],
});

const fs = require("fs");
const express = require("express");
const cors = require("cors");
const path = require("path");
const puppeteer = require("puppeteer");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const InterviewFeedbackPDF =
  require("./InterviewFeedbackPDF").default;
const InvoicePDF = require("./InvoicePDF").default;
const ReceiptPDF = require("./ReceiptPDF").default;
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();

// Create thumbnails directory if it doesn't exist
const thumbnailsDir = path.join(
  __dirname,
  "public",
  "thumbnails"
);
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(
  "/static",
  express.static(path.join(__dirname, "public"))
);

// Enable CORS for localhost:5173
app.use(
  cors({
    origin: "https://node-app-981221757308.asia-south1.run.app", // Allow only from localhost:5173
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Function to generate thumbnail from video URL
async function generateThumbnail(videoUrl) {
  if (!videoUrl) return null;

  // Generate unique filenames for temp video and thumbnail
  const uniqueId = uuidv4();
  const videoFilename = `${uniqueId}-video`;
  const videoPath = path.join(thumbnailsDir, videoFilename);
  const thumbnailFilename = `${uniqueId}-thumb.jpg`;
  const thumbnailPath = path.join(
    thumbnailsDir,
    thumbnailFilename
  );

  try {
    // Determine the full URL based on environment
    let fullVideoUrl = videoUrl;

    // For local environments, prepend localhost:8000 if it's a relative path
    if (videoUrl.startsWith("/media")) {
      fullVideoUrl = `http://localhost:8000${videoUrl}`;
    }

    // For local testing, check if we can access the file directly instead
    let videoBuffer;
    try {
      const response = await axios({
        method: "get",
        url: fullVideoUrl,
        responseType: "arraybuffer",
        timeout: 30000, // 30 second timeout
      });

      videoBuffer = response.data;

      // Write the video to a temporary file
      fs.writeFileSync(videoPath, videoBuffer);
    } catch (downloadError) {
      console.error(
        "Error downloading video:",
        downloadError.message
      );
      return null;
    }

    // Create a promise to handle the ffmpeg process using the local file
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions([
          "-ss",
          "00:00:01", // Take screenshot at 1 second mark
          "-frames:v",
          "1", // Take only one frame
        ])
        .output(thumbnailPath)
        .size("640x360")
        .on("start", (commandLine) => {})
        .on("end", () => {
          resolve();
        })
        .on("error", (err, stdout, stderr) => {
          console.error("Error generating thumbnail:", err);
          console.error("FFmpeg stderr:", stderr);
          reject(err);
        })
        .run();
    });

    // Check if thumbnail was created
    if (!fs.existsSync(thumbnailPath)) {
      console.error("Thumbnail file wasn't created");
      return null;
    }

    // Read the generated thumbnail and convert to base64
    const thumbnailBuffer = fs.readFileSync(thumbnailPath);
    const base64Thumbnail = `data:image/jpeg;base64,${thumbnailBuffer.toString(
      "base64"
    )}`;

    // Clean up the temporary files
    try {
      fs.unlinkSync(videoPath);
      fs.unlinkSync(thumbnailPath);
    } catch (cleanupError) {
      console.error(
        "Error cleaning up temporary files:",
        cleanupError
      );
    }

    return base64Thumbnail;
  } catch (error) {
    console.error("Error generating thumbnail:", error);

    // Clean up any temporary files that might exist
    try {
      if (fs.existsSync(videoPath))
        fs.unlinkSync(videoPath);
      if (fs.existsSync(thumbnailPath))
        fs.unlinkSync(thumbnailPath);
    } catch (cleanupError) {
      console.error(
        "Error cleaning up after failure:",
        cleanupError
      );
    }

    return null;
  }
}

app.post("/generate-pdf", async (req, res) => {
  try {
    // Determine video URL (use recording_link or url)
    const videoUrl =
      req.body.recording_link || req.body.url;
    let thumbnailBase64 = null;

    if (videoUrl) {
      try {
        thumbnailBase64 = await generateThumbnail(videoUrl);
      } catch (error) {
        console.error(
          "Error in thumbnail generation workflow:",
          error
        );
        // Continue even if thumbnail generation fails
      }
    } else {
    }

    // Add the thumbnail to the data
    const dataWithThumbnail = {
      ...req.body,
      thumbnailBase64,
    };

    const html = ReactDOMServer.renderToString(
      React.createElement(InterviewFeedbackPDF, {
        data: dataWithThumbnail,
      })
    );
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // Ensures background colors/images are included
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=generated.pdf"
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (error) {
    console.error("❌ Error Generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

app.post("/generate-invoice-pdf", async (req, res) => {
  try {
    const html = ReactDOMServer.renderToString(
      React.createElement(InvoicePDF, { data: req.body })
    );
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // 🛠️ Ensures background colors/images are included
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=generated.pdf"
    );
    res.setHeader("Content-Length", pdfBuffer.length); // Ensure content length is correct
    res.end(pdfBuffer); // Use res.end() instead of res.send()
  } catch (error) {
    console.error("❌ Error Generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

app.post("/generate-receipt-pdf", async (req, res) => {
  try {
    const html = ReactDOMServer.renderToString(
      React.createElement(ReceiptPDF, { data: req.body })
    );
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // 🛠️ Ensures background colors/images are included
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=generated.pdf"
    );
    res.setHeader("Content-Length", pdfBuffer.length); // Ensure content length is correct
    res.end(pdfBuffer); // Use res.end() instead of res.send()
  } catch (error) {
    console.error("❌ Error Generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

app.get("/", (req, res) => {
  res.send("Send a POST request to this endpoint with receipt data to generate a PDF.");
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
