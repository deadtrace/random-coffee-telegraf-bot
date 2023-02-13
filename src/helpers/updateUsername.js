import User from "../models/User.js";

const updateUsername = async (ctx) => {
  try {
    await User.updateOne(
      { tid: ctx.chat.id },
      { username: ctx.chat.username ?? null }
    );
  } catch (error) {
    console.error(error);
  }
};

export default updateUsername;
