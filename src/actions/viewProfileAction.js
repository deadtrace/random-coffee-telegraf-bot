import SCENES from "../scenes/scenesList.js";

const viewProfileAction = (ctx) => {
  ctx.deleteMessage();
  ctx.scene.enter(SCENES.VIEW_PROFILE);
};

export default viewProfileAction;
