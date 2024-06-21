/** @format */

import express from "express";
import {
  Comments,
  createTournament,
  getComments,
  tournamentDetails,
  getTournaments,
  deleteTournament,
  updateTournamentStatus,
  getAllTournaments,
  storeLeaderboard,
  getAllLeaderboards,
  getLeaderboardByTournament,
  getLeaderboardByUserId,
  giveAnswer,
} from "../controller/tournament.js";
import { varifyToken } from "../varifyToken.js";
const router = express.Router();

router.post("/create", varifyToken, createTournament);
router.get("/get-tournament-details/:id", varifyToken, tournamentDetails);
router.post("/add/comment", Comments);
router.get("/get/tournament-comments/:tournamentId", varifyToken, getComments);
router.get("/", getTournaments);
router.put("/:id", deleteTournament);
router.put("/update-status/:id", updateTournamentStatus);
router.get("/all-tournaments", varifyToken, getAllTournaments);
router.post("/add-leaderboard", varifyToken, storeLeaderboard);
router.get("/get-all-leaderboards", varifyToken, getAllLeaderboards);
router.get(
  "/get-leaderboard-by-tournament/:tournamentId",
  getLeaderboardByTournament
);
router.get(
  "/get-leaderboard-by-userid/:userId",
  varifyToken,
  getLeaderboardByUserId
);
router.put("/give-answer/:id", giveAnswer); // :id =  question ID

export default router;
