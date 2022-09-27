import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    tid: {
      type: Number,
      required: true,
    },
    username: String,
    type: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Feedback", FeedbackSchema);
