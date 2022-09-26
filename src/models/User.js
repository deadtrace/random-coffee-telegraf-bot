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
    photo: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
