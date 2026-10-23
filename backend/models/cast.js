import mongoose from "mongoose";

const castSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  age: Number,

  bio: String,

  image: String 

}, {
  timestamps: true
});

const Cast = mongoose.models.casts || mongoose.model("casts", castSchema);
if (!mongoose.models.cast) {
  try {
    mongoose.model("cast", castSchema);
  } catch {}
}

export default Cast;