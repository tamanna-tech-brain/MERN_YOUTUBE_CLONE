import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  subscriber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  channel: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });

const Subscription = mongoose.models.subscriptions || mongoose.model("subscriptions", subscriptionSchema);

export default Subscription;
