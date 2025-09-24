import express from "express";
import passport from 'passport'
import PDFDocument from 'pdfkit'
import bwipjs from "bwip-js";
import Invoice from "../models/Invoice.mjs";
import User from "../models/User.mjs";
import getNextSequenceValue from "../utils/getNextSequence.mjs";

const router = express.Router();
const ensureAuthenticated = passport.authenticate("jwt", { session: false });
async function getNextInvoiceNumber(userId) {
  const lastInvoice = await Invoice.findOne({ userId: userId }).sort({
    createdAt: -1,
  });
  if (!lastInvoice) {
    return "0001"; // It's their first invoice
  }
  const nextNumber = parseInt(lastInvoice.invoiceNumber) + 1;
  return nextNumber.toString().padStart(4, "0");
}

router.post("/api/invoices", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const sequenceName = `invoice_${userId}`; // 3. Call the function to get the next number.
    const nextNumber = await getNextSequenceValue(sequenceName);

    // 4. Format the number as you wish (e.g., pad with zeros).
    const formattedInvoiceNumber = nextNumber.toString().padStart(4, "0");

    // 5. Proceed to create and save the invoice with this guaranteed unique number.
    const newInvoice = new Invoice({
      ...req.body,
      userId: userId,
      invoiceNumber: formattedInvoiceNumber,
    });

    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating invoice", error: error.message });
  }
});
router.get("/api/invoices", ensureAuthenticated, async (req, res) => {
  try {
    // Find all invoices where the `userId` matches the logged-in user's ID
    const invoices = await Invoice.find({ userId: req.user.id }).sort({
      createdAt: -1,
    }); // Sort by newest first
    res.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/api/invoices/:id", ensureAuthenticated, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user.id, // Extra security: ensure the invoice belongs to the user
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/api/invoices/:id", ensureAuthenticated, async (req, res) => {
  try {
    const updatedData = req.body;

    // Find the invoice and update it. The `{ new: true }` option returns the updated document.
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // Security check
      updatedData,
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({
        message: "Invoice not found or you do not have permission to edit it.",
      });
    }
    res.json(updatedInvoice);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating invoice", error: error.message });
  }
});
router.delete("/api/invoices/:id", ensureAuthenticated, async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // Security check
    });

    if (!deletedInvoice) {
      return res.status(404).json({
        message:
          "Invoice not found or you do not have permission to delete it.",
      });
    }
    res.json({ message: "Invoice deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/api/invoices/generate-pdf",
  ensureAuthenticated,
  async (req, res) => {
    const data = req.body;

    try {
      // --- 1. PDF DOCUMENT SETUP ---
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice-${data.invoiceNumber}.pdf`
      );
      doc.pipe(res);

      // --- 2. FONTS, COLORS & CONSTANTS ---
      doc.registerFont("ARIAL", "fonts/ARIAL.ttf");
      doc.registerFont("ARIALBD", "fonts/ARIALBD.ttf");
      const FONT_NORMAL = "ARIAL";
      const FONT_BOLD = "ARIALBD";
      const COLOR_PRIMARY_TEXT = "#000000";
      const COLOR_SECONDARY_TEXT = "#555555";
      const COLOR_PRIMARY_BRAND = "#333333"; // You can change this
      const PAGE_WIDTH =
        doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const LEFT_X = doc.page.margins.left;
      const RIGHT_X = doc.page.width - doc.page.margins.right;

      // --- 3. HELPER FUNCTIONS ---
      const drawLine = (y) =>
        doc
          .strokeColor("#000000")
          .lineWidth(0.75)
          .moveTo(LEFT_X, y)
          .lineTo(RIGHT_X, y)
          .stroke();
      const checkPageBreak = (currentY, neededHeight = 20) => {
        if (
          currentY >
          doc.page.height - doc.page.margins.bottom - neededHeight
        ) {
          doc.addPage();
          return doc.page.margins.top;
        }
        return currentY;
      };
      doc
        .font(FONT_BOLD)
        .fontSize(22)
        .fillColor(COLOR_PRIMARY_BRAND)
        .text(data.title || "INVOICE", { align: "center" });
      doc.moveDown(1);

      // --- BARCODE ---
      if (data.invoiceNumber) {
        try {
          const barcodeBuffer = await bwipjs.toBuffer({
            bcid: "code128",
            text: data.invoiceNumber,
            scale: 3,
            height: 12,
            includetext: false,
          });
          doc.image(barcodeBuffer, LEFT_X, doc.y, { height: 35 });
        } catch (e) {
          console.error("Barcode generation failed:", e);
        }
      }
      doc.moveDown(2);

      // --- COMPANY DETAILS & LOGO ---
      const companyTopY = doc.y;
      // Left Column
      doc
        .font(FONT_BOLD)
        .fontSize(14)
        .fillColor(COLOR_PRIMARY_TEXT)
        .text(data.companyName || "");
      doc.font(FONT_NORMAL).fontSize(9).fillColor(COLOR_SECONDARY_TEXT);
      doc.text(data.companyDescription || "", { width: PAGE_WIDTH / 2 });
      doc.text(data.companyAddress || "");
      doc.text(data.registrationNo || "");
      doc.text(data.companyEmail || "");
      doc.text(data.companyPhoneNo || "");
      const leftHeaderBottom = doc.y;

      // Right Column

      if (data.companyLogo && typeof data.companyLogo === "string") {
        try {
          const imagePart = data.companyLogo.split(";base64,").pop();
          if (imagePart) {
            const imageBuffer = Buffer.from(imagePart, "base64");
            // We provide all numeric values directly.
            doc.image(imageBuffer, RIGHT_X - 150, companyTopY, {
              width: 150,
              align: "right",
            });
          }
        } catch (e) {
          console.error("Logo processing failed:", e.message);
        }
      }

      // Set the cursor to the bottom of the tallest column
      doc.y = Math.max(leftHeaderBottom, companyTopY + 0) + 60; // +60 is an estimate for logo height

      drawLine(doc.y);
      doc.moveDown(2);
      // --- BILL TO & INVOICE DETAILS ---
      const billToTopY = doc.y;
      // Left Column
      doc
        .font(FONT_BOLD)
        .fontSize(10)
        .fillColor(COLOR_PRIMARY_TEXT)
        .text("Bill To:");
      doc
        .font(FONT_NORMAL)
        .fontSize(10)
        .text(data.clientName || "");
      doc.text(data.clientAddress || "", { width: PAGE_WIDTH / 2 });
      doc.text(data.clientNo || "");
      const leftBillToBottom = doc.y;

      // Right Column
      doc
        .font(FONT_BOLD)
        .text(`INV - ${data.invoiceNumber || ""}`, RIGHT_X - 200, billToTopY, {
          width: 200,
          align: "right",
        });
      doc.font(FONT_NORMAL);
      if (data.date)
        doc.text(`Invoice Date - ${data.date}`, { align: "right" });
      if (data.dueDate)
        doc.text(`Invoice Due Date - ${data.dueDate}`, { align: "right" });
      const rightBillToBottom = doc.y;
      doc.y = Math.max(leftBillToBottom, rightBillToBottom) + 20;

      // --- ITEMS TABLE ---
      for (const section of data.sections || []) {
        doc.y = checkPageBreak(doc.y, 40); // Need space for section title and header
        doc
          .font(FONT_BOLD)
          .fontSize(12)
          .fillColor(COLOR_PRIMARY_TEXT)
          .text(section.title || "", LEFT_X, doc.y);
        doc.moveDown(1);
        let tableTopY = doc.y;

        // Table Header
        doc.rect(LEFT_X, tableTopY, PAGE_WIDTH, 20).fill("#333333");
        doc.font(FONT_BOLD).fontSize(9).fillColor("#FFFFFF");
        doc.text("Product/Service", LEFT_X + 5, tableTopY + 5, { width: 120 });
        doc.text("Description", LEFT_X + 130, tableTopY + 5, { width: 140 });
        doc.text("Quantity", LEFT_X + 280, tableTopY + 5, {
          width: 50,
          align: "right",
        });
        doc.text(
          `Amount (${data.currency || "N/A"})`,
          LEFT_X + 340,
          tableTopY + 5,
          {
            width: 70,
            align: "right",
          }
        );
        doc.text(
          `Amount (${data.currency || "N/A"})`,
          LEFT_X + 420,
          tableTopY + 5,
          {
            width: 80,
            align: "right",
          }
        );
        doc.y += 25;

        // Table Rows
        let i = 0;
        for (const item of section.items || []) {
          let rowY = doc.y;
          const rowHeight =
            Math.max(
              doc.heightOfString(item.Product_name || "", { width: 120 }),
              doc.heightOfString(item.description || "", { width: 140 })
            ) + 10;

          rowY = checkPageBreak(rowY, rowHeight);

          // Alternating row background color
          doc
            .rect(LEFT_X, rowY, PAGE_WIDTH, rowHeight)
            .fill(i % 2 ? "#FFFFFF" : "#F9F9F9")
            .fillColor(COLOR_PRIMARY_TEXT);

          doc.font(FONT_NORMAL).fontSize(9);
          doc.text(item.Product_name || "", LEFT_X + 5, rowY + 5, {
            width: 120,
          });
          doc.text(item.description || "", LEFT_X + 130, rowY + 5, {
            width: 140,
          });
          doc.text(item.quantity || "0", LEFT_X + 280, rowY + 5, {
            width: 50,
            align: "right",
          });
          doc.text(
            (parseFloat(item.unit_price) || 0).toFixed(2),
            LEFT_X + 340,
            rowY + 5,
            { width: 70, align: "right" }
          );
          doc.text(
            (parseFloat(item.total_price) || 0).toFixed(2),
            LEFT_X + 420,
            rowY + 5,
            { width: 80, align: "right" }
          );
          doc.y += rowHeight;
          i++;
        }
        doc.moveDown(2);
      }
      doc.moveDown(3);

      // Check if we need a new page before starting the footer.
      if (doc.y > doc.page.height - doc.page.margins.bottom - 150) {
        // 150 is approx footer height
        doc.addPage();
      }
      let footerTopY = doc.y; // This is the starting Y for BOTH columns.

      const leftFooterX = LEFT_X;
      const rightFooterX = RIGHT_X - 200; // Adjusted for better alignment

      // --- Left Column ---
      doc.fillColor(COLOR_SECONDARY_TEXT).fontSize(9);

      // We use `doc.y` for the first item in a chained command block to position it,
      // subsequent `text` calls in the chain flow naturally.
      if (data.paymentInstruction) {
        doc
          .font(FONT_BOLD)
          .text("Payment Instruction:", leftFooterX, footerTopY) // Use `footerTopY` to start
          .font(FONT_NORMAL)
          .text(data.paymentInstruction, { width: 250 });
        doc.moveDown(1);
      }
      if (data.accountDetails) {
        doc
          .font(FONT_BOLD)
          .text("Bank Details:", leftFooterX, doc.y)
          .font(FONT_NORMAL)
          .text(data.accountDetails, { width: 250 });
        doc.moveDown(1);
      }
      if (data.terms) {
        doc
          .font(FONT_BOLD)
          .text("Terms:", leftFooterX, doc.y)
          .font(FONT_NORMAL)
          .text(data.terms, { width: 250 });
        doc.moveDown(1);
      }
      if (data.notes) {
        doc
          .font(FONT_BOLD)
          .text("Note:", leftFooterX, doc.y)
          .font(FONT_NORMAL)
          .text(data.notes, { width: 250 });
      }

      // --- Right Column ---
      const calculatedGrandTotal = (data.sections || []).reduce(
        (t, s) =>
          t +
          (s.items || []).reduce(
            (st, i) => st + (parseFloat(i.total_price) || 0), // Switched to Total_Price for consistency
            0
          ),
        0
      );
      const grandTotal =
        parseFloat(data.manualGrandTotal) || calculatedGrandTotal;
      const amountPaid = parseFloat(data.amountPaid) || 0;
      const balanceDue = grandTotal - amountPaid;

      // ✅ We reuse `footerTopY` to start the right column at the same height.
      let summaryY = footerTopY;

      const drawSummaryLine = (
        label,
        value,
        font = FONT_NORMAL,
        size = 10,
        color = COLOR_PRIMARY_TEXT
      ) => {
        doc.font(font).fontSize(size).fillColor(color);
        // Draw the label
        doc.text(label, rightFooterX, summaryY, { width: 100, align: "left" });
        // Draw the value, aligned to the far right of the page
        doc.text(value, RIGHT_X - 100, summaryY, {
          width: 100,
          align: "right",
        });
      };

      // Helper to draw a short line just in the summary column
      const drawSummarySeparator = (y) => {
        doc
          .strokeColor("#aaaaaa")
          .lineWidth(0.5)
          .moveTo(rightFooterX, y)
          .lineTo(RIGHT_X, y)
          .stroke();
      };

      // Draw the summary lines using the helper
      doc.font(FONT_NORMAL).fontSize(10).fillColor(COLOR_PRIMARY_TEXT);
      drawSummaryLine(
        "Subtotal:",
        `${data.currency || ""}${calculatedGrandTotal.toFixed(2)}`
      );
      summaryY += 11;
      drawSummarySeparator(summaryY);
      summaryY += 15;

      drawSummaryLine(
        "Total:",
        `${data.currency || ""}${grandTotal.toFixed(2)}`,
        FONT_BOLD,
        11
      );
      summaryY += 15;
      drawSummaryLine(
        "Amount Paid:",
        `${data.currency || ""}${amountPaid.toFixed(2)}`
      );

      // ✅ Add a final line before the Balance Due
      summaryY += 15;
      drawSummarySeparator(summaryY);
      summaryY += 10;

      drawSummaryLine(
        "Balance Due:",
        `${data.currency || ""}${balanceDue.toFixed(2)}`,
        FONT_BOLD,
        12,
        "#008000"
      );

      // --- SIGNATURE ---
      const signatureY = doc.page.height - doc.page.margins.bottom - 80;
      let currentY = signatureY;
      if (data.signature) {
        try {
          const sigPart = data.signature.split(";base64,").pop();
          const sigBuffer = Buffer.from(sigPart, "base64");
          doc.image(sigBuffer, RIGHT_X - 200, signatureY, {
            fit: [150, 40],
            align: "right",
          });
          currentY += 45;
        } catch (e) {
          console.error("Signature processing failed:", e);
        }
      }
      doc
        .strokeColor(COLOR_PRIMARY_TEXT)
        .moveTo(RIGHT_X - 160, signatureY + 45)
        .lineTo(RIGHT_X, signatureY + 45)
        .stroke();

      const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();

      // ✅ Draw the full name at the new `currentY` position.
      doc
        .font(FONT_BOLD)
        .fontSize(10)
        .text(fullName, RIGHT_X - 150, currentY, {
          width: 150,
          align: "center",
        });

      // Move the cursor down for the next line of text.
      currentY += 15; // Approx height of the name line.

      // --- Draw the User Title ---
      // ✅ Draw the user's title at the final `currentY` position.
      doc
        .font(FONT_NORMAL)
        .fontSize(9)
        .text(
          data.userTitle || "Authorized Signature",
          RIGHT_X - 150,
          currentY,
          { width: 150, align: "center" }
        );
      // --- FINALIZE AND SEND ---
      doc.end();
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      res.status(500).send("An error occurred while generating the PDF.");
    }
  }
);
export default router;
