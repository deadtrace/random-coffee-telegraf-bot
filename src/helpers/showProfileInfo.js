import User from "../models/User.js";
import logError from "./logError.js";
import showMainButtons from "./showMainButtons.js";

const showProfileInfo = async (ctx) => {
  try {
    const user = await User.findOne({ tid: ctx.chat.id }).exec();
    const { name, workspace, hobbies, photo_id } = user;
    const text = `Твой профиль:\n*Имя и фамилия:* ${name}\n*Команда, роль, задачи 👨🏻‍💻:*\n${workspace}\n${
      hobbies ? `*Хобби, увлечения 🏂🏻:*\n${hobbies}` : ""
    }`;

    if (photo_id) {
      await ctx.replyWithPhoto(photo_id, {
        parse_mode: "MarkdownV2",
        caption: text,
      });
    } else {
      await ctx.replyWithMarkdownV2(text);
    }
  } catch (error) {
    logError(error);
    await ctx.reply("Произошла ошибка при загрузке данных пользователя");
    await showMainButtons(ctx);
  }
};

export default showProfileInfo;
