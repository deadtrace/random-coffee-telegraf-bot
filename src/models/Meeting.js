import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema(
  {
    tid1: {
      type: Number,
      required: true,
    },
    tid2: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "canceled", "met"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Meeting", MeetingSchema);
