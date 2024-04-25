import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
});

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: [5, "Title must contain atleast 5 Characters"],
    maxLength: [40, "Title must not exceed 40 Characters"],
  },
  price: {
    type: Number,
    required: true,
  },

  images: {
    type: [imageSchema],
  },
  Description: {
    type: String,
    required: true,
    maxLength: [2000, "Description must not exceed 2000 words"],
  },

  Category: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  user_icon: {
    type: String,
    required: true,
  },
});

export const Item = mongoose.model("Item", ItemSchema);
