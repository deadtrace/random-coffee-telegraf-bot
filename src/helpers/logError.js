import * as dotenv from "dotenv";
dotenv.config();
import Error from "../models/Error.js";

const logError = async (error, ctx) => {
  const { name, message } = error;
  try {
    console.log(error);
    await Error.create({ name, message });
    const { FEEDBACK_CHANNEL_ID } = process.env;
    if (ctx) {
      await ctx.telegram.sendMessage(
        FEEDBACK_CHANNEL_ID,
        `Произошла ошибка у пользователя @${ctx.chat.username}(${ctx.chat.id}):\n${name}\n${message}`
      );
    }
  } catch (err) {
    console.log(err);
  }
};

export default logError;
