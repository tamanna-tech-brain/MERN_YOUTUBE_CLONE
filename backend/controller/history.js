import mongoose from "mongoose";
import historymodel from "../models/history.js";
import { getPagination } from "../utils/pagination.js";
import { getSearchMatch } from "../utils/search.js";

export const watchMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    const history = await historymodel.findOneAndUpdate(
      { userId, movieId },
      { userId, movieId, watchedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      data: history
    });

  } catch (err) {
    console.error("WATCH ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


export const getHistory = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search = "" } = req.query;
    const userId = req.user.id;

    const query = {
      $or: [
        { userId: userId },
        ...(mongoose.Types.ObjectId.isValid(userId) ? [{ userId: new mongoose.Types.ObjectId(userId) }] : [])
      ]
    };

    let history = await historymodel.find(query)
      .populate({
        path: "movieId",
        populate: [{ path: "cast" }, { path: "categoryId" }]
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (search.trim()) {
      const s = search.toLowerCase();
      history = history.filter(h => h.movieId && h.movieId.title && h.movieId.title.toLowerCase().includes(s));
    }

    const total = await historymodel.countDocuments(query);

    return res.json({
      success: true,
      data: history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.log("HISTORY ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};