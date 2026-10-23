import Subscription from "../models/subscription.js";

export const toggleSubscription = async (req, res) => {
  try {
    const { channelId } = req.params;
    const subscriber = req.user.id;

    const existing = await Subscription.findOne({ subscriber, channel: channelId });

    let isSubscribed = false;
    if (existing) {
      await Subscription.findByIdAndDelete(existing._id);
      isSubscribed = false;
    } else {
      await Subscription.create({ subscriber, channel: channelId });
      isSubscribed = true;
    }

    const subscriberCount = await Subscription.countDocuments({ channel: channelId });

    return res.status(200).json({
      success: true,
      data: {
        isSubscribed,
        subscriberCount
      },
      message: isSubscribed ? "Subscribed successfully" : "Unsubscribed successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const checkSubscription = async (req, res) => {
  try {
    const { channelId } = req.params;
    const subscriber = req.user.id;

    const existing = await Subscription.findOne({ subscriber, channel: channelId });
    const subscriberCount = await Subscription.countDocuments({ channel: channelId });

    return res.status(200).json({
      success: true,
      data: {
        isSubscribed: !!existing,
        subscriberCount
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSubscriptions = async (req, res) => {
  try {
    const subscriber = req.user.id;
    const subscriptions = await Subscription.find({ subscriber }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSubscriberCount = async (req, res) => {
  try {
    const { channelId } = req.params;
    const subscriberCount = await Subscription.countDocuments({ channel: channelId });

    return res.status(200).json({
      success: true,
      data: { subscriberCount }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
