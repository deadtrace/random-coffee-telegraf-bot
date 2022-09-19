import SCENES from "../scenes/scenesList.js";

const giveBotFeedbackAction = (ctx) => {
  ctx.deleteMessage();
  ctx.scene.enter(SCENES.GIVE_BOT_FEEDBACK);
};

export default giveBotFeedbackAction;
