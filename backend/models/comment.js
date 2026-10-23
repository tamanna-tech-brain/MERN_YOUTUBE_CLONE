import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
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
  text: {
    type: String,
    required: true,
    trim: true
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  ]
}, {
  timestamps: true
});

const Comment = mongoose.models.comments || mongoose.model("comments", commentSchema);

export default Comment;
