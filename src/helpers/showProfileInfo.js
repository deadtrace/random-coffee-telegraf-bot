import User from "../models/User.js";
import logError from "./logError.js";
import parseForMarkdown from "./parseForMarkdown.js";
import showMainButtons from "./showMainButtons.js";

const showProfileInfo = async (ctx) => {
  try {
    const user = await User.findOne({ tid: ctx.chat.id }).exec();
    const { name, workspace, hobbies, photo_id } = user;
    const text = parseForMarkdown(
      `*Твой профиль:*\n*Имя и фамилия:* ${name}\n*Команда, роль, задачи 👨🏻‍💻:*\n${workspace}\n${
        hobbies ? `*Хобби, увлечения 🏂🏻:*\n${hobbies}` : ""
      }`
    );

    if (photo_id) {
      await ctx.replyWithPhoto(photo_id, {
        caption: text,
        parse_mode: "MarkdownV2",
      });
    } else {
      await ctx.replyWithMarkdownV2(text);
    }
  } catch (error) {
    logError(error, ctx);
    await ctx.reply(
      "Произошла ошибка при отображении твоих данных. Пожалуйста, напиши о возникшей проблеме в фидбек о боте. Разработчики обязательно всё быстро исправят)"
    );
  }
};

export default showProfileInfo;
