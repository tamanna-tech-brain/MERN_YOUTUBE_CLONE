import jwt from "jsonwebtoken";
import usermodel from "../models/user.js";

export async function getProfileById(req, res) {
  try {
    let { id } = req.params;

    if (id === "me") {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const decoded = jwt.verify(
            authHeader.split(" ")[1],
            process.env.JWT_SECRET || "youtube_clone_jwt_secret_key_production_2026"
          );
          id = decoded.id;
        } catch {
          return res.status(401).json({ success: false, message: "Invalid token" });
        }
      } else {
        return res.status(401).json({ success: false, message: "Authentication required for /profile/me" });
      }
    }

    const user = await usermodel.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
      message: "User found"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function updateProfileById(req, res) {
  try {
    let { id } = req.params;
    if (id === "me" && req.user?.id) {
      id = req.user.id;
    }

    const updateData = { ...req.body };
    delete updateData.password; // Do not update password here

    const updateUser = await usermodel.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    if (!updateUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    return res.status(200).json({
      success: true,
      data: updateUser,
      message: "User updated"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

