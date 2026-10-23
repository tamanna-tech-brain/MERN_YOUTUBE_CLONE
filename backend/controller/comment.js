import Comment from "../models/comment.js";

export const createComment = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required"
      });
    }

    const comment = await Comment.create({
      userId,
      movieId,
      text: text.trim()
    });

    const populated = await Comment.findById(comment._id).populate("userId", "username email");

    const io = req.app.get("io");
    if (io) {
      io.to(`video-${movieId}`).emit("comment-received", populated);
    }

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: populated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCommentsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const comments = await Comment.find({ movieId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: comments
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment"
      });
    }

    await Comment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
