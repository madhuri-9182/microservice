import PropTypes from "prop-types";
import React from "react";

// Dummy data object remains the same
const dummyInvoiceData = {
  // Invoice details
  invoiceNumber: "INV-2030-001",
  invoiceDate: "02 July, 2030",
  dueDate: "May 7, 2025",

  // From (Sender) details
  from: {
    name: "Adhyapan Education for Career Development Private Limited (HDIP)",
    gstin: "29AAZCA1833B1ZK",
    email: "contact@hiringdog.com",
    phone: "9916864727",
    address: {
      line1: "2SY No 7/2, K No 767/7, GPA M/S SLS,",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560068",
    },
  },

  // To (Client) details
  to: {
    name: "Client registered name",
    gstin: "29AAZCA1833B1ZK",
    email: "contact@hiringdog.com",
    phone: "9916864727",
    address: {
      line1: "2SY No 7/2, K No 767/7, GPA M/S SLS,",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560068",
    },
  },

  // Invoice line items
  items: [
    {
      id: "01",
      description: "0-4 Years",
      quantity: 2,
      unitPrice: 1234.56,
      total: 1234.56,
    },
    {
      id: "02",
      description: "4.1-6 Years",
      quantity: 2,
      unitPrice: 1234.56,
      total: 1234.56,
    },
    {
      id: "03",
      description: "6.1-8 Years",
      quantity: 2,
      unitPrice: 1234.56,
      total: 1234.56,
    },
    {
      id: "04",
      description: "8.1-10 Years",
      quantity: 2,
      unitPrice: 1234.56,
      total: 1234.56,
    },
    {
      id: "05",
      description: "10+ Years",
      quantity: 2,
      unitPrice: 1234.56,
      total: 1234.56,
    },
  ],

  // Financial details
  financials: {
    subtotal: 1234.56,
    igstRate: 18,
    igstAmount: 1234.56,
    total: 1234.56,
  },

  // Notes
  notes: [
    "Kindly make the payment by May 7, 2025.",
    "TDS, if deducted, must be shared via certificate by quarter-end.",
    "This invoice is system-generated and valid without signature.",
    "For queries: support@hdip.com",
  ],

  // Company details for footer
  companyInfo: {
    fullName:
      "Adhyapan Education For Career Development Private Limited",
    gstin: "29AAZCA1833B1ZK",
    address:
      "#677, Spacelance, 1st Floor, 13th Cross, 27th Main Rd, 1st Sector, HSR Layout, Bengaluru, Karnataka 560102",
  },
};

const InvoicePDF = ({ data = dummyInvoiceData }) => {
  // Format currency function
  const formatCurrency = (amount) => {
    return `INR ${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Define all the styles as objects
  const styles = {
    container: {
      width: "21cm",
      marginLeft: "auto",
      marginRight: "auto",
      backgroundColor: "white",
      paddingTop: "22px",
      fontFamily: "sans-serif",
    },
    content: {
      padding: "0 22px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: "15px",
    },
    logo: {
      width: "87px",
      height: "87px",
      backgroundColor: "#FEF3C7", // amber-100
      borderRadius: "0.375rem",
      overflow: "hidden",
    },
    logoImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    title: {
      textAlign: "center",
      flexGrow: 1,
    },
    titleText: {
      fontSize: "33px",
      fontWeight: "bold",
    },
    dateSection: {
      textAlign: "right",
    },
    divider: {
      borderBottom: "1px solid black",
      margin: "15px 0",
    },
    fromToContainer: {
      display: "flex",
      marginBottom: "22px",
      border: "1px solid black",
      background:
        "linear-gradient(to right, #CCFFD9, #b0dbe9, #95baff)",
    },
    fromSection: {
      width: "50%",
      padding: "15px",
    },
    toSection: {
      width: "50%",
      padding: "15px",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "7px",
    },
    boldText: {
      fontWeight: "bold",
    },
    tableHeader: {
      display: "flex",
      fontWeight: "bold",
      marginBottom: "7px",
      textAlign: "center",
      borderBottom: "1px solid black",
    },
    tableBody: {
      marginBottom: "15px",
    },
    tableRow: {
      display: "flex",
      textAlign: "center",
    },
    tableRowAlternate: {
      display: "flex",
      textAlign: "center",
      background:
        "linear-gradient(to right, #CCFFD9, #b0dbe9, #95baff)",
    },
    colId: {
      width: "8.33%",
      padding: "7px",
      borderRight: "2px dashed white",
    },
    colDescription: {
      width: "25%",
      padding: "7px",
      borderRight: "2px dashed white",
    },
    colQuantity: {
      width: "16.67%",
      padding: "7px",
      borderRight: "2px dashed white",
    },
    colPrice: {
      width: "25%",
      padding: "7px",
      borderRight: "2px dashed white",
    },
    colTotal: {
      width: "25%",
      padding: "7px",
    },
    notesTotalsSection: {
      display: "flex",
      justifyContent: "space-between",
      gap: "29px",
    },
    notesSection: {
      width: "50%",
    },
    totalsSection: {
      width: "50%",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "7px",
    },
    totalRowHighlighted: {
      display: "flex",
      justifyContent: "space-between",
      padding: "7px",
      background:
        "linear-gradient(to right, #CCFFD9, #b0dbe9, #95baff)",
    },
    totalLabel: {
      textAlign: "right",
      fontWeight: "bold",
      width: "50%",
    },
    totalAmount: {
      textAlign: "right",
      width: "50%",
    },
    footer: {
      marginTop: "44px",
      textAlign: "center",
      fontSize: "13px",
      borderTop: "1px solid black",
      paddingTop: "7px",
    },
    listContainer: {
      listStyleType: "disc",
      paddingLeft: "22px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header with logo and title */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <img
              src="http://localhost:3000/static/images/hiring-dog-logo.png"
              alt="Hiring Dog Logo"
              style={styles.logoImage}
            />
          </div>
          <div style={styles.title}>
            <h1 style={styles.titleText}>INVOICE</h1>
          </div>
          <div style={styles.dateSection}>
            <p>Date: {data.invoiceDate}</p>
          </div>
        </div>

        {/* Divider line */}
        <div style={styles.divider}></div>

        {/* From and To sections */}
        <div style={styles.fromToContainer}>
          <div style={styles.fromSection}>
            <h2 style={styles.sectionTitle}>From:</h2>
            <p style={styles.boldText}>{data.from.name}</p>
            <p>GSTIN: {data.from.gstin}</p>
            <p>Mail Id: {data.from.email}</p>
            <p>Phone No: {data.from.phone}</p>
            <p>{data.from.address.line1}</p>
            <p>
              {data.from.address.city},{" "}
              {data.from.address.state} -{" "}
              {data.from.address.postalCode}
            </p>
          </div>
          <div style={styles.toSection}>
            <h2 style={styles.sectionTitle}>To:</h2>
            <p style={styles.boldText}>{data.to.name}</p>
            <p>GSTIN: {data.to.gstin}</p>
            <p>Mail Id: {data.to.email}</p>
            <p>Phone No: {data.to.phone}</p>
            <p>
              {data.to.address.line1} {data.to.address.city}
              ,
            </p>
            <p>
              {data.to.address.state} -{" "}
              {data.to.address.postalCode}
            </p>
          </div>
        </div>

        {/* Table header */}
        <div style={styles.tableHeader}>
          <div style={styles.colId}>NO.</div>
          <div style={styles.colDescription}>
            INTERVIEWS
          </div>
          <div style={styles.colQuantity}>PEOPLE</div>
          <div style={styles.colPrice}>UNIT PRICE</div>
          <div style={styles.colTotal}>TOTAL</div>
        </div>

        {/* Table rows */}
        <div style={styles.tableBody}>
          {data.items.map((item, index) => (
            <div
              key={item.id}
              style={
                index % 2 === 1
                  ? styles.tableRowAlternate
                  : styles.tableRow
              }
            >
              <div style={styles.colId}>{item.id}</div>
              <div style={styles.colDescription}>
                {item.description}
              </div>
              <div style={styles.colQuantity}>
                {item.quantity}
              </div>
              <div style={styles.colPrice}>
                {formatCurrency(item.unitPrice)}
              </div>
              <div style={styles.colTotal}>
                {formatCurrency(item.total)}
              </div>
            </div>
          ))}
        </div>

        {/* Divider line */}
        <div style={styles.divider}></div>

        {/* Notes and Totals */}
        <div style={styles.notesTotalsSection}>
          {/* Notes */}
          <div style={styles.notesSection}>
            <h2 style={styles.sectionTitle}>Note:</h2>
            <ul style={styles.listContainer}>
              {data.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>

          {/* Totals */}
          <div style={styles.totalsSection}>
            <div style={styles.totalRow}>
              <div style={styles.totalLabel}>Subtotal</div>
              <div style={styles.totalAmount}>
                {formatCurrency(data.financials.subtotal)}
              </div>
            </div>
            <div style={styles.totalRow}>
              <div style={styles.totalLabel}>
                IGST ({data.financials.igstRate}%)
              </div>
              <div style={styles.totalAmount}>
                {formatCurrency(data.financials.igstAmount)}
              </div>
            </div>
            <div style={styles.totalRowHighlighted}>
              <div style={styles.totalLabel}>TOTAL</div>
              <div style={styles.totalAmount}>
                {formatCurrency(data.financials.total)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>
          {data.companyInfo.fullName}, GSTIN:{" "}
          {data.companyInfo.gstin}
        </p>
        <p>{data.companyInfo.address}</p>
      </div>
    </div>
  );
};

InvoicePDF.displayName = "InvoicePDF";

export default InvoicePDF;

InvoicePDF.propTypes = {
  data: PropTypes.object,
};
