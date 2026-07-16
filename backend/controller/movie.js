import { getPagination } from "../utils/pagination.js";
import { getSearchMatch } from "../utils/search.js";
import moviemodel from "../models/movie.js";

export async function createMovie(req, res) {
  try {
    const { userId, title, description, categoryId, language, duration, cast, releaseYear, poster, video} = req.body;
    const normalizedTitle = title.toLowerCase();
    const movie = await moviemodel.create({
        userId,
        title:normalizedTitle,
        description,
        categoryId,
        language,
        duration,
        cast,
        releaseYear,
        poster,
        video
      });
    
    res.status(200).json({
      success: true,
      data: movie,
      message: "Movie created successfully"
    });
    

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function getMovies(req, res) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search = "" } = req.query;

    const matchStage = getSearchMatch(search, "title");

    const movies = await moviemodel.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },

      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      { $skip: skip },
      { $limit: limit }
    ]);

    const total = await moviemodel.countDocuments(matchStage);

    res.json({
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
    res.status(500).json({ message: err.message });
  }
}

export async function getMoviesById(req, res) {
  try {
    const { id } = req.params;
    const movie = await moviemodel.findById(id)
      .populate("categoryId")
      .populate("cast");
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }
    res.status(200).json({
      success: true,
      data: movie,
      message: "Movie is found successfully"
    });
    

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function updateMovieById(req, res) {
  try {
    const { id } = req.params;
    const updateMovie = await moviemodel.findByIdAndUpdate(id, req.body, {new:true});
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
    res.status(400).json({
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
    res.status(201).json({
      success: true,
      data : movieDelete,
      message: "Deleted successfully"
    });
    

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

