import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  tid: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

export default mongoose.model("ChatAdmin", UserSchema);
