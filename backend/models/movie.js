import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "user is required"]
  },
  title: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true
  },
  director: {
    type: String,
    default: ""
  },
  categoryId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
  ],
  language: {
    type: String,
    default: "English"
  },
  duration: {
    type: Number,
    default: 0
  },
  cast: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "casts",
      required: true
    },
  ],
  releaseYear: Number,
  poster: String,
  video: String,
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  ]
}, {
  timestamps: true
});

const moviemodel = mongoose.models.movies || mongoose.model("movies", movieSchema);

export default moviemodel;