import { createError } from "../error.js";
import notification from "../models/notification.js";

export const getNotificationByUserId = async (req, res, next) => {
    const {userId} = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        if (!userId || userId === "") {
           return next(createError(422,"UserId required")) 
        }
        const allNotificationByUserId = await notification.find({ user: userId, fromAdmin: false }).populate("user")
        .skip(limit * (page - 1))
        .limit(limit)
        .sort({ createdAt: -1 });
        res.status(200).json({message:"siccess", allNotificationByUserId});
    } catch (error) {
        console.log(error);
        next(createError(500,"Something went wrong"));
    }
}