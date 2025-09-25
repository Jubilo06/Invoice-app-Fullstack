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
      
      const generateFooter = () => {
        // --- Start by adding a consistent space after the table ---
        doc.moveDown(3);

        // --- Calculate the Y position where the footer *will* start ---
        const footerStartY = doc.y;

        // --- Helper function to draw a single row in the summary ---
        const drawSummaryRow = (label, value, options = {}) => {
          const { font = FONT_NORMAL, size = 10, color = "black" } = options;
          const rowY = doc.y; // Save the current Y position for this row
          doc.font(font).fontSize(size).fillColor(color);
          doc.text(label, RIGHT_X - 220, rowY, { width: 120, align: "left" });
          doc.text(value, RIGHT_X - 100, rowY, { width: 100, align: "right" });
          // We don't increment doc.y here; we let the `text` calls do it naturally.
        };

        // --- Helper for the short separator line ---
        const drawSummarySeparator = () => {
          doc.moveDown(0.5); // Add space before the line
          const lineY = doc.y;
          doc
            .strokeColor("#aaaaaa")
            .moveTo(RIGHT_X - 220, lineY)
            .lineTo(RIGHT_X, lineY)
            .stroke();
          doc.moveDown(0.5); // Add space after the line
        };

        // --- Draw the Left Column (Notes/Terms) ---
        const leftColX = LEFT_X;
        doc.font(FONT_NORMAL).fontSize(9);
        if (data.notes && data.notes.trim() !== "") {
          doc.font(FONT_BOLD).text("Note:", leftColX, footerStartY);
          doc.font(FONT_NORMAL).text(data.notes, { width: 250 });
          doc.moveDown(1);
        }
        if (data.terms && data.terms.trim() !== "") {
          doc.font(FONT_BOLD).text("Terms:", leftColX, doc.y);
          doc.font(FONT_NORMAL).text(data.terms, { width: 250 });
          doc.moveDown(1);
        }
        if (data.paymentInstruction && data.paymentInstruction.trim() !== "") {
          doc.font(FONT_BOLD).text("Payment Instruction:", leftColX, doc.y);
          doc.font(FONT_NORMAL).text(data.paymentInstruction, { width: 250 });
        }
        const leftColBottom = doc.y; // Record the bottom Y of the left column

        // --- Draw the Right Column (Summary) ---
        // Reset the Y cursor to the top of the footer for perfect alignment.
        doc.y = footerStartY;

        const {
          subTotal,
          taxAmount,
          discountAmount,
          shippingAmount,
          grandTotal,
          amountPaid,
          balanceDue,
        } = calculateTotals(data);

        drawSummaryRow(
          "Subtotal:",
          `${data.currency || ""}${subTotal.toFixed(2)}`
        );
        if (data.taxEnabled)
          drawSummaryRow(
            `Tax (${data.taxValue}%):`,
            `${data.currency || ""}${taxAmount.toFixed(2)}`
          );
        if (data.discountEnabled)
          drawSummaryRow(
            `Discount:`,
            `-${data.currency || ""}${discountAmount.toFixed(2)}`,
            { color: "#D32F2F" }
          );
        if (data.shippingEnabled)
          drawSummaryRow(
            "Shipping:",
            `${data.currency || ""}${shippingAmount.toFixed(2)}`
          );

        drawSummarySeparator();

        drawSummaryRow(
          "Grand Total:",
          `${data.currency || ""}${grandTotal.toFixed(2)}`,
          { font: FONT_BOLD, size: 11 }
        );
        drawSummaryRow(
          "Amount Paid:",
          `${data.currency || ""}${amountPaid.toFixed(2)}`
        );

        drawSummarySeparator();

        drawSummaryRow(
          "Balance Due:",
          `${data.currency || ""}${balanceDue.toFixed(2)}`,
          { font: FONT_BOLD, size: 12, color: "#2E7D32" }
        );
        const rightColBottom = doc.y; // Record the bottom Y of the right column

        // --- Position and Draw the Signature Block ---
        // The signature starts below the TALLER of the two footer columns.
        let signatureY = Math.max(leftColBottom, rightColBottom) + 20;

        // The "just-in-time" page break check for the signature.
        const SIGNATURE_HEIGHT = 60;
        if (
          signatureY >
          doc.page.height - doc.page.margins.bottom - SIGNATURE_HEIGHT
        ) {
          doc.addPage();
          signatureY = doc.page.margins.top; // Start at the top of the new page
        }

        if (data.signature) {
          try {
            const sigPart = data.signature.split(";base64,").pop();
            const sigBuffer = Buffer.from(sigPart, "base64");
            doc.image(sigBuffer, RIGHT_X - 150, signatureY, {
              fit: [150, 40],
              align: "center",
            });
          } catch (e) {
            console.error("Signature processing failed:", e);
          }
        }

        const lineY = signatureY + 45;
        doc
          .strokeColor("#000000")
          .moveTo(RIGHT_X - 150, lineY)
          .lineTo(RIGHT_X, lineY)
          .stroke();

        const fullName = `${data.firstName || ""} ${
          data.lastName || ""
        }`.trim();
        doc
          .font(FONT_BOLD)
          .fontSize(9)
          .text(fullName, RIGHT_X - 150, lineY + 5, {
            width: 150,
            align: "center",
          });
        doc
          .font(FONT_NORMAL)
          .text(data.userTitle || "Authorized Signature", {
            width: 150,
            align: "center",
          });
      };

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
      const calculateTotals = (invoiceData) => {
        const subTotal = (invoiceData.sections || []).reduce(
          (total, section) =>
            total +
            (section.items || []).reduce(
              (sectionTotal, item) =>
                sectionTotal + (parseFloat(item.total_price) || 0),
              0
            ),
          0
        );

        let taxAmount = 0;
        if (invoiceData.taxEnabled) {
          const taxVal = parseFloat(invoiceData.taxValue) || 0;
          taxAmount =
            invoiceData.taxType === "percentage"
              ? subTotal * (taxVal / 100)
              : taxVal;
        }

        let discountAmount = 0;
        if (invoiceData.discountEnabled) {
          const discountVal = parseFloat(invoiceData.discountValue) || 0;
          discountAmount =
            invoiceData.discountType === "percentage"
              ? subTotal * (discountVal / 100)
              : discountVal;
        }

        const shippingAmount = invoiceData.shippingEnabled
          ? parseFloat(invoiceData.shippingValue) || 0
          : 0;

        const grandTotalBeforeManual =
          subTotal + taxAmount - discountAmount + shippingAmount;
        const grandTotal =
          parseFloat(invoiceData.manualGrandTotal) || grandTotalBeforeManual;
        const amountPaid = parseFloat(invoiceData.amountPaid) || 0;
        const balanceDue = grandTotal - amountPaid;

        return {
          subTotal,
          taxAmount,
          discountAmount,
          shippingAmount,
          grandTotal,
          amountPaid,
          balanceDue,
        };
      };

       generateFooter();
       doc.end();
     
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      res.status(500).send("An error occurred while generating the PDF.");
    }
  }
);
export default router;
