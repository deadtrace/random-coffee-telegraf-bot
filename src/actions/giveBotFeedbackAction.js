import SCENES from "../scenes/scenesList.js";

const giveBotFeedbackAction = async (ctx) => {
  try {
    await ctx.deleteMessage();
    await ctx.answerCbQuery();
  } catch (error) {
    console.error(error);
  }
  ctx.scene.enter(SCENES.GIVE_BOT_FEEDBACK);
};

export default giveBotFeedbackAction;
