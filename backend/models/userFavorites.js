import mongoose from "mongoose";

const userFavoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "movies",
    required: true
  }

}, {
  timestamps: true
});
userFavoriteSchema.index(
  { userId: 1, movieId: 1 },
  { unique: true }
);

export default mongoose.models.userFavorites || mongoose.model("userFavorites", userFavoriteSchema);