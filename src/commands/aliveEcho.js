import logError from "../helpers/logError.js";

const aliveEcho = async (ctx) => {
  if (ctx.chat.id === +process.env.ADMIN_ID) {
    try {
      await ctx.reply("alive");
    } catch (error) {
      logError(error, ctx);
    }
  }
};

export default aliveEcho;
