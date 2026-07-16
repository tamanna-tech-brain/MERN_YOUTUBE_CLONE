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
        lowercase:true,
    },
    description: {
        type: String,
        required: true
    },
    categoryId: [
        {
       type: mongoose.Schema.Types.ObjectId,
       ref: "categories",
       required: true,
    },
],
    language: String,

    duration: Number,

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
},
{
        timestamps:true
    },
);
const moviemodel = mongoose.model("movies", movieSchema)

export default moviemodel;