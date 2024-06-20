/** @format */

import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    // option: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, default: "" },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { _id: false }
);

const TournamentQuestion = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    question: {
      type: String,
      trim: true,
      required: [true, "Question is required"],
    },
    correctOption: { type: String, default: "" },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
    optionA: {
      text: { type: String },
      image: { type: String },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    optionB: {
      text: { type: String },
      image: { type: String },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    optionC: {
      text: { type: String },
      image: { type: String },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    optionD: {
      text: { type: String },
      image: { type: String },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const LeaderBoardScheema = mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Tournament Id is required"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "User Id is required"],
    },
    questionId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Question Id is required"],
    },
    correctPredictions: {
      type: Number,
      default: 0,
    },
    totalTimeSpend: {
      type: Number,
      required: [true, "Total time spent is required"],
      default: 0,
    },
  },
  { timestamps: true }
);

export const leaderBoardScheema = mongoose.model(
  "Leaderboard",
  LeaderBoardScheema
);

export default mongoose.model("Question", TournamentQuestion);
