import showMainButtons from "../helpers/showMainButtons.js";

const registerForRandomCoffeeAction = async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.deleteMessage();
  ctx.session.registered = true;
  await showMainButtons(ctx);
};

export default registerForRandomCoffeeAction;
