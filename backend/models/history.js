import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "movies",
    required: true
  },

  watchedAt: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
});



export default mongoose.models.history || mongoose.model("history", historySchema);