import React from "react";
import PropTypes from "prop-types";

const InterviewFeedbackPDF = ({ data }) => {
  const {
    interview_date,
    candidate,
    interviewer,
    skill_based_performance,
    skill_evaluation,
    strength,
    improvement_points,
    overall_remark,
    overall_score,
    url,
    thumbnailBase64, // Add this to access the thumbnail
  } = data;

  // Parse interview date and time
  const formatDateTime = (dateTimeString) => {
    try {
      const [datePart, timePart] =
        dateTimeString.split(" ");
      const time = timePart ? timePart.substring(0, 5) : "";
      return { date: datePart, time };
    } catch (e) {
      console.error("Error parsing date and time:", e);
      return { date: dateTimeString, time: "" };
    }
  };

  const { date, time } = formatDateTime(interview_date);

  // Convert skill_based_performance object to array
  const skillsPerformance = Object.entries(
    skill_based_performance || {}
  ).map(([name, data]) => ({
    skillName: name,
    score: parseInt(data.score) || 0,
    summary: data.summary || "",
    questions: data.questions || [],
  }));

  const SPECIALIZATIONS = [
    { id: "frontend", name: "Frontend" },
    { id: "backend", name: "Backend" },
    { id: "fullstack", name: "Fullstack" },
    { id: "aiml", name: "AI/ML" },
    { id: "devops", name: "DevOps" },
    { id: "data_engineer", name: "Data Engineering" },
    { id: "testing", name: "Testing/QA" },
    { id: "android", name: "Android" },
    { id: "ios", name: "iOS" },
    { id: "mobile", name: "Mobile (Android + iOS)" },
    { id: "flutter", name: "Flutter" },
    { id: "database", name: "Database" },
    { id: "cloud", name: "Cloud" },
    { id: "mobile_flutter", name: "Mobile (Flutter)" },
    {
      id: "mobile_react_native",
      name: "Mobile (React Native)",
    },
  ];

  const getSpecialization = (key) => {
    const spec = SPECIALIZATIONS.find(
      (spec) => spec.id === key
    );
    return spec ? spec.name : key;
  };

  // Helper function to render score bar
  const renderScoreBar = (
    score,
    width = 270,
    height = 12,
    color = "green"
  ) => (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#AC878787",
          borderRadius: "0.75rem",
          height: `${height}px`,
          width: `${width}px`,
        }}
      >
        <div
          style={{
            borderRadius: "0.75rem",
            height: `${height}px`,
            width: `${score}%`,
            background: color,
          }}
        />
      </div>
      <p
        style={{
          fontSize: "12px",
        }}
      >
        {score}/
        <span
          style={{
            fontSize: "9px",
            color: "#a5aeb5",
          }}
        >
          100
        </span>
      </p>
    </div>
  );

  // Get the recommendation color
  const getRecommendationColor = () => {
    if (overall_remark === "HREC") return "#27AE60";
    if (overall_remark === "REC") return "#2ECC71";
    if (overall_remark === "NREC") return "#ec1313";
    if (overall_remark === "SNREC") return "#B71C1C";
    if (overall_remark === "NJ") return "#00ABF0";
    return "black";
  };

  // Get recommendation text
  const getRecommendationText = () => {
    if (overall_remark === "HREC")
      return "HIGHLY RECOMMENDED";
    if (overall_remark === "REC") return "RECOMMENDED";
    if (overall_remark === "NREC") return "NOT RECOMMENDED";
    if (overall_remark === "SNREC")
      return "STRONGLY NOT RECOMMENDED";
    if (overall_remark === "NJ") return "NOT JOINED";
    return overall_remark;
  };

  // Convert skill evaluation to an array for display
  const skillEvaluationArray = Object.entries(
    skill_evaluation || {}
  ).map(([name, rating]) => ({
    name,
    rating,
    score:
      rating === "excellent"
        ? 100
        : rating === "good"
        ? 75
        : rating === "average"
        ? 50
        : rating === "poor"
        ? 25
        : 50,
  }));

  // Calculate total experience
  const getTotalExperience = (year, month) => {
    const years = year || 0;
    const months = month || 0;

    if (years === 0) {
      return `${months} months`;
    } else if (months === 0) {
      return `${years} years`;
    } else {
      return `${years} years ${months} months`;
    }
  };

  return (
    <div
      style={{
        margin: "auto",
        width: "21cm",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          paddingRight: "10px",
          borderBottom: "1px solid #000000",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src="http://localhost:3000/static/images/hiring-dog-logo.png"
            alt="Logo"
            style={{
              width: "50px",
              marginRight: "5px",
            }}
          />
          <h1
            style={{
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            INTERVIEW REPORT
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            fontSize: "10px",
          }}
        >
          <p>{date}</p>
          <p>{time}</p>
        </div>
      </div>

      {/* BODY */}
      <div
        style={{
          padding: "15px",
          paddingBottom: 0,
        }}
      >
        {/* Candidate Info */}
        <div
          style={{
            borderRadius: "0.75rem",
            paddingTop: "18px",
            paddingBottom: "34px",
            marginBottom: "10px",
            background:
              "linear-gradient(90deg, rgba(174, 212, 235, 0.63) 0%, rgba(202, 206, 208, 0.63) 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "10px",
              paddingLeft: "26px",
              paddingRight: "10px",
            }}
          >
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              {candidate.name}
            </h1>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  padding: "4px",
                  fontWeight: "bold",
                  color: "white",
                  borderRadius: "0.375rem",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: getRecommendationColor(),
                  minWidth: "180px",
                  fontSize: "12px",
                }}
              >
                {getRecommendationText()}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2px",
                  fontWeight: "bold",
                  color: "white",
                  borderRadius: "0.375rem",
                  height: "24px",
                  width: "150px",
                  backgroundColor: "#A4333582",
                  minWidth: "180px",
                  fontSize: "14px",
                }}
              >
                {overall_score}/100
              </div>
            </div>
          </div>
          <hr
            style={{
              height: "1.5px",
              backgroundColor: "#000000",
            }}
          />
          <div
            style={{
              paddingLeft: "26px",
              paddingTop: "10px",
              paddingRight: "25px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "4px 8px",
              columnGap: "1rem",
              fontSize: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <p style={{ minWidth: "110px" }}>
                Interview Stage :{" "}
              </p>
              <p
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  width: "100%",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Round 1
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <p style={{ minWidth: "121px" }}>
                Applied For :{" "}
              </p>
              <p
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  width: "100%",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {candidate.role || "N/A"}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <p style={{ minWidth: "98px" }}>
                Interview Date :{" "}
              </p>
              <p
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  width: "100%",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {date}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <p style={{ minWidth: "110px" }}>
                Current Design. :{" "}
              </p>
              <p
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  width: "100%",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {candidate.current_designation || "N/A"}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <p style={{ minWidth: "121px" }}>
                Current Company :{" "}
              </p>
              <p
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  width: "100%",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {candidate.company || "N/A"}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <p style={{ minWidth: "98px" }}>
                Strength :{" "}
              </p>
              <p
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  width: "100%",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {getSpecialization(
                  candidate.specialization
                ) || "N/A"}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <p style={{ minWidth: "110px" }}>
                Total Experience :{" "}
              </p>
              <p
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  width: "100%",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {getTotalExperience(
                  candidate.year,
                  candidate.month
                )}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <p style={{ minWidth: "121px" }}>
                Interviewer Company :{" "}
              </p>
              <p
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  width: "100%",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {interviewer.current_company || "N/A"}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <p style={{ minWidth: "98px" }}>
                Interviewer Exp. :{" "}
              </p>
              <p
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  width: "100%",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {getTotalExperience(
                  interviewer.total_experience_years,
                  interviewer.total_experience_months
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Score */}
        <div
          style={{
            borderRadius: "0.75rem",
            paddingRight: "14px",
            paddingLeft: "26px",
            marginBottom: "10px",
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(174, 212, 235, 0.63) 0%, rgba(202, 206, 208, 0.63) 100%)",
          }}
        >
          <div
            style={{
              width: "70%",
              paddingTop: "20px",
              paddingBottom: "25px",
              paddingRight: "10px",
              marginRight: "10px",
              borderRight: "1px solid #000000",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "20px",
              }}
            >
              Score & Values ({skillEvaluationArray.length})
            </p>
            {skillEvaluationArray.map((skill, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    minWidth: "140px",
                  }}
                >
                  {skill.name}
                </p>
                {renderScoreBar(
                  skill.score,
                  270,
                  15,
                  "linear-gradient(90deg, rgba(228, 12, 12, 0.81) 16%, rgba(187, 243, 3, 0.5346) 52%, rgba(5, 170, 54, 0.81) 100%)"
                )}
              </div>
            ))}
          </div>
          <a
            target="_blank"
            href={`https://app.hdiplatform.in/recording/${url}`}
            rel="noopener noreferrer"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {thumbnailBase64 ? (
              <div
                style={{
                  paddingTop: "18px",
                  paddingLeft: "10px",
                  position: "relative",
                }}
              >
                <img
                  src={thumbnailBase64}
                  alt="Video Thumbnail"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
                {/* Play button overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 5V19L19 12L8 5Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div
                style={{
                  paddingTop: "18px",
                  paddingLeft: "10px",
                }}
              >
                <svg
                  width="100%"
                  viewBox="0 0 692 451"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="692"
                    height="451"
                    fill="#130303"
                  />
                  <line
                    x1="34"
                    y1="387"
                    x2="669"
                    y2="387"
                    stroke="white"
                    strokeWidth="10"
                  />
                  <path
                    d="M385 187L326.5 220.775V153.225L385 187Z"
                    fill="#D9D9D9"
                  />
                </svg>
              </div>
            )}
          </a>
        </div>

        {/* Strength and Improvements */}
        <div
          style={{
            borderRadius: "0.75rem",
            paddingRight: "14px",
            paddingLeft: "26px",
            paddingTop: "11px",
            paddingBottom: "12px",
            marginBottom: "10px",
            background:
              "linear-gradient(90deg, rgba(174, 212, 235, 0.63) 0%, rgba(202, 206, 208, 0.63) 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#137204",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            <svg
              style={{ marginRight: "0.25rem" }}
              width="20"
              height="20"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25.0003 45.8332C36.5063 45.8332 45.8337 36.5058 45.8337 24.9998C45.8337 13.4939 36.5063 4.1665 25.0003 4.1665C13.4944 4.1665 4.16699 13.4939 4.16699 24.9998C4.16699 36.5058 13.4944 45.8332 25.0003 45.8332Z"
                fill="#3DDAB4"
              />
              <path
                d="M40.7196 18.2449L36.4738 14.1709L23.7238 27.3261L17.3738 21.2844L13.2998 25.5303L19.6279 31.5511L23.8748 35.6032L23.8811 35.5969L23.8873 35.6032L27.979 31.374L40.7196 18.2449Z"
                fill="#C1F5EA"
              />
              <path
                d="M23.8811 35.597L27.979 31.3741L23.7238 27.3262L19.6279 31.5512L23.8811 35.597Z"
                fill="white"
              />
            </svg>
            Strength
          </div>
          <div
            style={{
              backgroundColor: "white",
              marginTop: "10px",
              marginBottom: "15px",
              borderRadius: "0.5rem",
              padding: "0.75rem",
              fontSize: "0.75rem",
            }}
          >
            {strength}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#D32323",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            <svg
              style={{ marginRight: "0.25rem" }}
              width="16"
              height="16"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.5 36L10.75 24.25L14.25 20.75L22.5 29L43.5 8C38.75 3.25 32.25 0 25 0C11.25 0 0 11.25 0 25C0 38.75 11.25 50 25 50C38.75 50 50 38.75 50 25C50 20.25 48.75 16 46.5 12.25L22.5 36Z"
                fill="#8C1A11"
              />
            </svg>
            Improvements
          </div>
          <div
            style={{
              backgroundColor: "white",
              marginTop: "10px",
              marginBottom: "15px",
              borderRadius: "0.5rem",
              padding: "0.75rem",
              fontSize: "0.75rem",
            }}
          >
            {improvement_points}
          </div>
        </div>

        {/* Question and answers skill wise */}
        {skillsPerformance.map(
          (skillAssessment, skillIndex) => (
            <div
              key={skillIndex}
              style={{
                borderRadius: "0.75rem",
                paddingRight: "14px",
                paddingLeft: "8px",
                marginBottom: "10px",
                display: "flex",
                background:
                  "linear-gradient(90deg, rgba(174, 212, 235, 0.63) 0%, rgba(202, 206, 208, 0.63) 100%)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  paddingTop: "18px",
                  paddingBottom: "18px",
                  paddingRight: "10px",
                  // borderRight: "1px solid #000000",
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "10px",
                    paddingTop: "7px",
                    borderRadius: "0.5rem",
                    border: "1px solid black",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        border: "1px solid #000000",
                        borderRadius: "0.25rem",
                        paddingLeft: "8px",
                        paddingRight: "16px",
                      }}
                    >
                      {skillAssessment.skillName}
                    </p>
                    {renderScoreBar(
                      skillAssessment.score,
                      150,
                      12,
                      "#976464CF"
                    )}
                  </div>
                  <div
                    style={{
                      borderRadius: "0.375rem",
                      padding: "8px 8px 38px 10px",
                      marginTop: "5px",
                      background:
                        "linear-gradient(90deg, rgba(174, 212, 235, 0.63) 0%, rgba(202, 206, 208, 0.63) 100%)",
                    }}
                  >
                    {skillAssessment.questions.map(
                      (qa, qaIndex) => (
                        <div
                          key={qaIndex}
                          style={{ marginBottom: "16px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              marginBottom: "5px",
                            }}
                          >
                            <p style={{ fontSize: "15px" }}>
                              {qaIndex + 1}.
                            </p>
                            <div
                              style={{
                                backgroundColor: "white",
                                width: "100%",
                                minHeight: "35px",
                                borderRadius: "0.375rem",
                                fontSize: "12px",
                                paddingLeft: "10px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {qa.que}
                            </div>
                          </div>
                          <div
                            style={{
                              backgroundColor: "white",
                              maxWidth: "100%",
                              minHeight: "35px",
                              borderRadius: "0.375rem",
                              fontSize: "12px",
                              paddingLeft: "10px",
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "20px",
                            }}
                          >
                            {qa.ans}
                          </div>
                        </div>
                      )
                    )}
                    <div
                      style={{
                        marginBottom: "5px",
                        marginLeft: "20px",
                        fontSize: "12px",
                      }}
                    >
                      Summary :
                    </div>
                    <div
                      style={{
                        backgroundColor: "white",
                        maxWidth: "100%",
                        minHeight: "100px",
                        borderRadius: "0.375rem",
                        fontSize: "12px",
                        paddingLeft: "10px",
                        paddingTop: "8px",
                        marginLeft: "20px",
                      }}
                    >
                      {skillAssessment.summary}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

InterviewFeedbackPDF.displayName = "InterviewFeedbackPDF";

InterviewFeedbackPDF.propTypes = {
  data: PropTypes.object.isRequired,
};

export default InterviewFeedbackPDF;
