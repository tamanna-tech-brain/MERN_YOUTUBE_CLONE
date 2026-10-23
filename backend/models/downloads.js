import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "movies",
    required: true,
  },

  downloadedAt: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
});

downloadSchema.index(
  {userId: 1, movieId: 1 },
  { unique: true }
);

export default mongoose.models.downloads || mongoose.model("downloads", downloadSchema);