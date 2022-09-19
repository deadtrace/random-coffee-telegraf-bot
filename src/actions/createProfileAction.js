import SCENES from "../scenes/scenesList.js";

const createProfileAction = (ctx) => {
  ctx.editMessageReplyMarkup();
  ctx.answerCbQuery(`Создание профиля...`);
  ctx.scene.enter(SCENES.CREATE_PROFILE);
};

export default createProfileAction;
