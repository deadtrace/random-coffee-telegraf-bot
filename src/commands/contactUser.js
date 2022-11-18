import logError from "../helpers/logError.js";

const contactUser = async (ctx) => {
  if (ctx.chat.id === +process.env.ADMIN_ID) {
    const arr = ctx.message.text.split(" ");
    const tid = arr[1];
    const message = arr.slice(2).join(" ");
    try {
      await ctx.telegram.sendMessage(tid, message);
    } catch (error) {
      logError(error, ctx);
    }
  }
};

export default contactUser;
