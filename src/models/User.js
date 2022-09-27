import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    tid: {
      type: Number,
      required: true,
    },
    username: String,
    name: {
      type: String,
      required: true,
    },
    workspace: {
      type: String,
      required: true,
    },
    hobbies: String,
    photo_id: String,
    registered: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
