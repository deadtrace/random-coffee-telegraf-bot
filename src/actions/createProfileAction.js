import SCENES from "../scenes/scenesList.js";

const createProfileAction = async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup();
  ctx.scene.enter(SCENES.CREATE_PROFILE);
};

export default createProfileAction;
