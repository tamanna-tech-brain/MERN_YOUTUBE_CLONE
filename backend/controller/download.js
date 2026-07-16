import mongoose from "mongoose";
import downloadmodel from "../models/downloads.js";
import { getPagination } from "../utils/pagination.js";

export const downloadMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    const newDownload = await downloadmodel.create({
      userId,
      movieId,
    });

    res.json({
      success: true,
      message: "Downloaded successfully",
      data: newDownload,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getDownloads = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search = "" } = req.query;

    const userId = req.user.id;

    // 🔥 user match
    const matchStage = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    // 🔥 search match (safe)
    const searchStage = search
      ? {
          "movieId.title": {
            $regex: search,
            $options: "i",
          },
        }
      : null;

    // =======================
    // 🔥 MAIN DATA QUERY
    // =======================
    const downloads = await downloadmodel.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: "movies",
          localField: "movieId",
          foreignField: "_id",
          as: "movieId",
        },
      },

      { $unwind: "$movieId" },

      ...(searchStage ? [{ $match: searchStage }] : []),

      { $skip: skip },
      { $limit: limit },
    ]);

    // =======================
    // 🔥 TOTAL COUNT QUERY
    // =======================
    const totalAgg = await downloadmodel.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: "movies",
          localField: "movieId",
          foreignField: "_id",
          as: "movieId",
        },
      },

      { $unwind: "$movieId" },

      ...(searchStage ? [{ $match: searchStage }] : []),

      { $count: "total" },
    ]);

    const total = totalAgg[0]?.total || 0;

    res.json({
      success: true,
      data: downloads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log("DOWNLOAD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};