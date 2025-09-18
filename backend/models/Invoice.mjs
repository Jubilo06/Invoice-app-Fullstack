import mongoose from "mongoose";
const { Schema, model } = mongoose;


const itemSchema = new Schema(
  {
    // Mongoose will add a unique `_id` automatically.
    // We keep the `id` from nanoid for frontend key management if needed.
    id: { type: String, required: true },
    Product_name: { type: String, default: "" },
    description: { type: String, default: "" },
    quantity: { type: Number, default: 0 },
    unit_price: { type: Number, default: 0 }, // Using your case `Unit_price`
    total_price: { type: Number, default: 0 }, // Using `Total_Price`
  },
  { _id: false }
); // We don't need a separate _id for items if we have a nanoid `id`.

// --- Sub-schema for Sections ---
// This defines a section, which has a title and an array of items.
const sectionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, default: "Section" },
    items: [itemSchema], // An array of documents following the itemSchema
  },
  { _id: false }
);

// --- The Main Invoice Schema ---
// This is the blueprint for the entire invoice document.
const invoiceSchema = new Schema(
  {
    // --- Core & User Association ---
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    invoiceNumber: { type: String, required: true },

    // --- Invoice-Level Details ---
    title: { type: String, default: "Invoice" },
    date: { type: String, default: "" }, // Storing as string since frontend sends YYYY-MM-DD
    dueDate: { type: String, default: "" },
    currency: { type: String, default: "₦" },

    // --- Company Details (for guests, or if you want to snapshot it) ---
    // Note: For logged-in users, this data is often redundant if it's on the User model.
    // But storing it here "snapshots" the company info at the time of invoice creation.
    userTitle: { type: String, default: "" },
    companyName: { type: String, default: "" },
    companyLogo: { type: String, default: null },
    companyDescription: { type: String, default: "" },
    companyEmail: { type: String, default: "" },
    companyPhoneNo: { type: String, default: "" },
    companyAddress: { type: String, default: "" },
    registrationNo: { type: String, default: "" },

    // --- Client Details ---
    clientName: { type: String, default: "" },
    clientAddress: { type: String, default: "" },
    clientNo: { type: String, default: "" },

    // --- Item Sections (Crucial Part) ---
    sections: [sectionSchema], // This tells Mongoose to expect an array of sections

    // --- Footer & Summary ---
    notes: { type: String, default: "" },
    terms: { type: String, default: "" },
    paymentInstruction: { type: String, default: "" },
    accountDetails: { type: String, default: "" },
    manualGrandTotal: { type: String, default: "" },
    amountPaid: { type: String, default: "0.00" },
    signature: { type: String, default: null },
    extraDetails: { type: String, default: "" },
    taxEnabled: { type: Boolean, default: false },
    discountEnabled: { type: Boolean, default: false },
    shippingEnabled: { type: Boolean, default: false },
    taxType: {
      type: String,
      enum: ["percentage", "fixed"], // `enum` ensures only these two values are allowed
      default: "percentage",
    },
    taxValue: { type: Number, default: 0 },

    // Discount details
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    discountValue: { type: Number, default: 0 },

    // Shipping details
    shippingValue: { type: Number, default: 0 },
  },
  {
    // Add `createdAt` and `updatedAt` fields automatically
    timestamps: true,
  }
);

export default model("Invoice", invoiceSchema);
