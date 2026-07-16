import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email must be unique"],
        lowercase:true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
});

const User =
  mongoose.models.user || mongoose.model("users", userSchema);

export default User;