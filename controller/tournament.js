/** @format */

import mongoose from "mongoose";
import { createError } from "../error.js";
import tournamentScheema from "../models/tournament.js";
import registerScheema from "../models/register.js";
import socketIoClient from "socket.io-client";
import tournamentQuestion, {
  leaderBoardScheema,
} from "../models/tournamentQuestion.js";
import Notification from "../models/notification.js";
import Question from "../models/tournamentQuestion.js";
import Prediction from "../models/prediction.js"

// Start Create Tournaments

// validate the mongodb ID
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export const createTournament = async (req, res, next) => {
  try {
    const tournamentData = req.body;

    if (!tournamentData.title) {
      return res.status(422).json({ error: "Enter tournament title" });
    }

    if (!tournamentData.created_by) {
      return res.status(400).json({ error: "Provide user type" });
    } else if (
      tournamentData.created_by !== "admin" &&
      tournamentData.created_by !== "streamer"
    ) {
      return res
        .status(400)
        .json({ error: "You are not allowed to create a tournament" });
    }

    if (!tournamentData.streaming_link) {
      return res.status(422).json({ error: "Enter streaming link" });
    }

    if (!tournamentData.tournament_by) {
      return res.status(422).json({ error: "Provide tournament_by" });
    }

    if (!tournamentData.streaming_date) {
      return res.status(422).json({ error: "Enter streaming_date" });
    }

    if (!tournamentData.streaming_time) {
      return res.status(422).json({ error: "Enter streaming_time" });
    }

    if (!tournamentData.userId) {
      return res
        .status(422)
        .json({ error: "UserId required for create tournament" });
    } else if (!isValidObjectId(tournamentData.userId)) {
      return res
        .status(400)
        .json({ error: "Valid userId required for create tournament" });
    }

    const existUser = await registerScheema.findOne({
      _id: tournamentData.userId,
    });
    if (!existUser) {
      return res
        .status(403)
        .json({ error: "UserId invalid for create tournament" });
    }

    const existTournament = await tournamentScheema.findOne({
      title: tournamentData.title,
    });
    if (existTournament) {
      return res.status(403).json({ error: "Tournament already exists" });
    }

    const newTournament = new tournamentScheema({ ...req.body });
    const tournament = await newTournament.save();
    res.status(201).json({
      success: true,
      message: "Tournament added successfully",
      id: newTournament.id,
      tournament: tournament,
    });
  } catch (error) {
    console.log(error);
    next(createError(500, "Check data models and data types"));
  }
};

export const tournamentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid tournament ID" });
    }

    const tournament = await tournamentScheema.findById(id);
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Tournament fetch success", tournament });
  } catch (error) {
    console.log(error);
    next(createError(500, "Failed to fetch tournament"));
  }
};

// REST API endpoint to add a comment to a specific stream (tournament)

export const Comments = async (req, res, next) => {
  const tournamentId = req.body.tournamentId;
  const { content, author } = req.body;

  if (!content || !author) {
    return res.status(400).json({ message: "Content and author are required" });
  }

  try {
    const tournament = await tournamentScheema.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const newComment = { content, author };
    tournament.comments.push(newComment);
    await tournament.save();

    // Emit the new comment to all connected clients in the room
    req.app.get("io").to(tournamentId).emit("newComment", newComment);

    res.status(201).json({ message: "Comment added" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getComments = async (req, res, next) => {
  const tournamentId = req.params.tournamentId;
  try {
    const tournament = await tournamentScheema.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    res.json(tournament.comments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getTournaments = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const tournaments = await tournamentScheema
      .find({ is_deleted: { $ne: true } })
      .limit(limit)
      .skip(limit * (page - 1))
      .sort({ createdAt: -1 });
    return res.status(200).json({ status: 200, tournaments });
  } catch (error) {
    next(error);
  }
};

export const deleteTournament = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(404).json({ message: "Tournament ID not found" });
    }
    const updatedTornamentrData = await tournamentScheema.findByIdAndUpdate(
      req.params.id,
      { $set: { is_deleted: true } },
      { new: true }
    );
    /* Create a notification for user */
    const notificationObj = Notification({
      _id: new mongoose.Types.ObjectId(),
      user: updatedTornamentrData.userId,
      type: 8,
      fromAdmin: true,
    });
    const notificationData = await notificationObj.save();
    return res.status(200).json({
      mesage: "Tournament has been deleted",
      status: 200,
      tournment: updatedTornamentrData,
      notification: notificationData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTournamentStatus = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(404).json({ message: "Tournament ID not found" });
    }
    console.log("req.body.is_active ", req.body.is_active);
    const updatedTornamentrData = await tournamentScheema.findByIdAndUpdate(
      req.params.id,
      { $set: { is_active: req.body.is_active } },
      { new: true }
    );
    /* Create a notification for user */
    const notificationObj = Notification({
      _id: new mongoose.Types.ObjectId(),
      user: updatedTornamentrData.userId,
      type: req.body.is_active === "active" ? 6 : 7,
      fromAdmin: true,
    });
    const notificationData = await notificationObj.save();
    return res.status(200).json({
      mesage: "Tournament status has been changed",
      status: 200,
      tournment: updatedTornamentrData,
      notification: notificationData,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTournaments = async (req, res) => {
  const allTournaments = await tournamentScheema.find();
  res.status(200).json({
    success: true,
    message: "Tournament fetched successfully",
    allTournaments,
  });
};

export const storeLeaderboard = async (req, res, next) => {
  const {
    tournamentId,
    userId,
    questionId,
    correctPredictions,
    totalTimeSpend,
  } = req.body;
  console.log(req.body);
  try {
    if (tournamentId === "" || !tournamentId) {
      return next(createError(422, "Tournament id cannot be empty"));
    } else if (!isValidObjectId(tournamentId)) {
      return next(createError(400, "Invalid tournamentid"));
    }
    if (userId === "" || !userId) {
      return next(createError(422, "User id cannot be empty"));
    } else if (!isValidObjectId(userId)) {
      return next(createError(400, "Invalid userid"));
    }
    if (questionId === "" || !questionId) {
      return next(createError(422, "Question id cannot be empty"));
    } else if (!isValidObjectId(questionId)) {
      return next(createError(400, "Invalid questionid"));
    }

    const isExistUser = await registerScheema.findOne({ _id: userId });
    const isExistQuestion = await tournamentQuestion.findOne({
      _id: questionId,
    });
    const isTournamentExist = await tournamentScheema.findOne({
      _id: tournamentId,
    });

    if (!isExistUser || !isExistQuestion || !isTournamentExist) {
      return next(
        createError(400, "Invalid user or tournament or tournament question")
      );
    }
    const newLeaderBoard = await leaderBoardScheema({
      userId,
      questionId,
      tournamentId,
      correctPredictions,
      totalTimeSpend,
    });
    await newLeaderBoard.save();
    res.status(201).json({
      success: true,
      message: "Leaderboard saved successfully",
      id: newLeaderBoard._id,
    });
  } catch (error) {
    console.log("error", error);
    return next(createError(500, "something went wrong"));
  }
};

export const getAllLeaderboards = async (req, res, next) => {
  try {
    const leaderBoards = await leaderBoardScheema.find();
    console.log("okay");
    res.status(200).json({
      success: true,
      message: "Leaderboards fetched successfully",
      leaderboards: leaderBoards,
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, "something went wrong"));
  }
};

export const getLeaderboardByTournament = async (req, res, next) => {
  const { tournamentId } = req.params;
  try {
    if (tournamentId === "" || !tournamentId) {
      return next(createError(422, "Tournamenty Id is required"));
    } else if (!isValidObjectId(tournamentId)) {
      return next(createError(400, "Invalid tournament Id"));
    }
    const leaderBoardByTournament = await leaderBoardScheema
      .find({
        tournamentId: tournamentId,
      })
      .populate("userId");
    res.status(200).json({
      success: true,
      message: "Leaderboard fetched successfully",
      leaderboard: leaderBoardByTournament,
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, "Something went wrong"));
  }
};

export const getLeaderboardByUserId = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (userId === "" || !userId) {
      return next(createError(422, "userId is required"));
    } else if (!isValidObjectId(userId)) {
      return next(createError(400, "userId is not a valid"));
    }
    const leaderboardByUserId = await leaderBoardScheema.find({ userId });
    res.status(200).json({
      success: true,
      message: "Leaderboard fetched successfully",
      leaderboardByUserId,
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, "Something went wrong"));
  }
};

export const giveAnswer = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(createError(422, "Please provide a id"));
    }
    const questionDetails = await Question.findById(req.params.id)
    const optionField = `option${req.body.optionNumber}.users`;
    console.log("optionField:", optionField);
    const result = await Question.updateOne(
      { _id: req.params.id },
      { $addToSet: { [optionField]: req.body.userId } }
    );
    /* Save data into prdiction table */
    const predictionData = Prediction({
      _id: new mongoose.Types.ObjectId(),
      user: req.body.userId,
      question: req.params.id,
      answer: req.body.optionNumber,
      tournament: questionDetails.tourId,
    });
    await predictionData.save();
    return res
      .status(200)
      .json({ message: "User added to option successfully.", status: 200 });
  } catch (error) {
    next(error);
  }
};


export const getPredictionList = async(req, res, next) => {
  try {
    if (!req.params.userId) {
      return next(createError(422, "Please provide a id"));
    }
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const list = await Prediction.find({user: req.params.userId}).populate({
      path: "question",
      select: { _id: 1, question: 1 },
    }).populate({
      path: "tournament",
      select: { _id: 1, title: 1 },
    }).limit(limit).skip(limit*(page-1)).sort({createdAt: -1});
    return res.status(200).json({message: "GET prediction list", status: true, result: list})
  } catch (error) {
    next(error);
  }
}