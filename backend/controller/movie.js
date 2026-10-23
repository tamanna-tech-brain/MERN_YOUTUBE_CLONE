import fs from "fs";
import path from "path";
import { getPagination } from "../utils/pagination.js";
import { getSearchMatch } from "../utils/search.js";
import moviemodel from "../models/movie.js";

export async function createMovie(req, res) {
  try {
    const {
      userId,
      title,
      description,
      director,
      categoryId,
      language,
      duration,
      cast,
      releaseYear,
      poster,
      video
    } = req.body;

    const normalizedTitle = title ? title.toLowerCase() : "";
    const resolvedUserId = userId || req.user?.id;

    const movie = await moviemodel.create({
      userId: resolvedUserId,
      title: normalizedTitle,
      description,
      director: director || "",
      categoryId,
      language: language || "English",
      duration: duration || 0,
      cast,
      releaseYear,
      poster,
      video,
      likes: [],
      dislikes: []
    });

    return res.status(200).json({
      success: true,
      data: movie,
      message: "Movie created successfully"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function getMovies(req, res) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search = "", categoryId = "" } = req.query;

    let query = {};
    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: "i" };
    }
    if (categoryId && categoryId !== "all" && categoryId !== "cat_all") {
      query.categoryId = categoryId;
    }

    const movies = await moviemodel.find(query)
      .populate("userId", "username email avatar")
      .populate("categoryId", "name description image")
      .populate("cast", "name bio image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await moviemodel.countDocuments(query);

    return res.json({
      success: true,
      data: movies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getMoviesById(req, res) {
  try {
    const { id } = req.params;
    const movie = await moviemodel.findById(id)
      .populate("userId", "username email avatar")
      .populate("categoryId", "name description image")
      .populate("cast", "name bio image");

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: movie,
      message: "Movie is found successfully"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function updateMovieById(req, res) {
  try {
    const { id } = req.params;
    const updateMovie = await moviemodel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updateMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    return res.status(201).json({
      success: true,
      data: updateMovie,
      message: " updated successsfully"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function deleteMovieById(req, res) {
  try {
    const { id } = req.params;
    const movieDelete = await moviemodel.findByIdAndDelete(id);
    if (!movieDelete) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    return res.status(201).json({
      success: true,
      data: movieDelete,
      message: "Deleted successfully"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function likeMovie(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const movie = await moviemodel.findById(id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    if (!movie.likes) movie.likes = [];
    if (!movie.dislikes) movie.dislikes = [];

    const isLiked = movie.likes.some(uId => uId.toString() === userId);
    const isDisliked = movie.dislikes.some(uId => uId.toString() === userId);

    if (isLiked) {
      movie.likes = movie.likes.filter(uId => uId.toString() !== userId);
    } else {
      movie.likes.push(userId);
      if (isDisliked) {
        movie.dislikes = movie.dislikes.filter(uId => uId.toString() !== userId);
      }
    }

    await movie.save();

    return res.status(200).json({
      success: true,
      data: {
        likeCount: movie.likes.length,
        dislikeCount: movie.dislikes.length,
        userLiked: !isLiked,
        userDisliked: false
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function dislikeMovie(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const movie = await moviemodel.findById(id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    if (!movie.likes) movie.likes = [];
    if (!movie.dislikes) movie.dislikes = [];

    const isLiked = movie.likes.some(uId => uId.toString() === userId);
    const isDisliked = movie.dislikes.some(uId => uId.toString() === userId);

    if (isDisliked) {
      movie.dislikes = movie.dislikes.filter(uId => uId.toString() !== userId);
    } else {
      movie.dislikes.push(userId);
      if (isLiked) {
        movie.likes = movie.likes.filter(uId => uId.toString() !== userId);
      }
    }

    await movie.save();

    return res.status(200).json({
      success: true,
      data: {
        likeCount: movie.likes.length,
        dislikeCount: movie.dislikes.length,
        userLiked: false,
        userDisliked: !isDisliked
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function streamMovie(req, res) {
  try {
    const { id } = req.params;
    const movie = await moviemodel.findById(id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    if (!movie.video) {
      return res.redirect("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
    }

    if (movie.video.startsWith("http://") || movie.video.startsWith("https://")) {
      return res.redirect(movie.video);
    }

    const cleanPath = movie.video.replace(/^\/uploads\//, "").replace(/^uploads\//, "");
    const possiblePaths = [
      path.join(process.cwd(), "uploads", cleanPath),
      path.join("/tmp", cleanPath),
      path.join(process.cwd(), cleanPath)
    ];

    let filePath = possiblePaths.find(p => fs.existsSync(p));

    if (!filePath) {
      return res.redirect("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.status(416).send("Requested range not satisfiable\n" + start + " >= " + fileSize);
        return;
      }

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
