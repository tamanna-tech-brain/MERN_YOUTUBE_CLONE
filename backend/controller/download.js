import mongoose from "mongoose";
import downloadmodel from "../models/downloads.js";
import { getPagination } from "../utils/pagination.js";

export const downloadMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    const newDownload = await downloadmodel.findOneAndUpdate(
      { userId, movieId },
      { userId, movieId, downloadedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

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

    const query = {
      $or: [
        { userId: userId },
        ...(mongoose.Types.ObjectId.isValid(userId) ? [{ userId: new mongoose.Types.ObjectId(userId) }] : [])
      ]
    };

    let downloads = await downloadmodel.find(query)
      .populate({
        path: "movieId",
        populate: [{ path: "cast" }, { path: "categoryId" }]
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (search.trim()) {
      const s = search.toLowerCase();
      downloads = downloads.filter(d => d.movieId && d.movieId.title && d.movieId.title.toLowerCase().includes(s));
    }

    const total = await downloadmodel.countDocuments(query);

    return res.json({
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};