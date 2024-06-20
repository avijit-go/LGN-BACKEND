/** @format */

import mongoose from "mongoose";
const registerSchhema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    age: {
      type: String,
    },
    dob: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    streaimingTime: {
      type: String,
    },
    accountType: {
      type: String,
      default: "user",
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isDelete: { type: Boolean },
  },
  { timestamps: true }
);

export default mongoose.model("User", registerSchhema);
