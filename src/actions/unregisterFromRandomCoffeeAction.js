import showMainButtons from "../helpers/showMainButtons.js";

const unegisterFromRandomCoffeeAction = async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.deleteMessage();
  ctx.session.registered = false;
  await showMainButtons(ctx);
};

export default unegisterFromRandomCoffeeAction;
