import SCENES from "../scenes/scenesList.js";

const viewProfileAction = async (ctx) => {
  await ctx.answerCbQuery();
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error(error);
  }
  return ctx.scene.enter(SCENES.VIEW_PROFILE);
};

export default viewProfileAction;
