import SCENES from "../scenes/scenesList.js";

const viewProfileAction = async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.deleteMessage();
  return ctx.scene.enter(SCENES.VIEW_PROFILE);
};

export default viewProfileAction;
