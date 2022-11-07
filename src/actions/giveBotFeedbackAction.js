import SCENES from "../scenes/scenesList.js";

const giveBotFeedbackAction = async (ctx) => {
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error(error);
  }
  ctx.answerCbQuery();
  ctx.scene.enter(SCENES.GIVE_BOT_FEEDBACK);
};

export default giveBotFeedbackAction;
