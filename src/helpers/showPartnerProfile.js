import User from "../models/User.js";
import logError from "./logError.js";
import parseForMarkdown from "./parseForMarkdown.js";

const user_not_exist = "user_not_exist";

const showPartnerProfile = async (ctx, tid) => {
  try {
    const user = await User.findOne({ tid }).exec();
    if (!user) throw new Error(user_not_exist);

    let { name, workspace, hobbies, photo_id, username } = user;
    name = parseForMarkdown(name);
    const nameLink = `[${name}](tg://user?id=${tid})`;
    workspace = parseForMarkdown(workspace);
    if (username) username = parseForMarkdown(`@${username}`);
    hobbies = parseForMarkdown(hobbies);

    const text = `*Профиль твоего собеседника:*\n*Имя и фамилия:*\n${
      username ? name : nameLink
    } ${username ? username : ""}\n*Команда, роль, задачи 👨🏻‍💻:*\n${workspace}\n${
      hobbies ? `*Хобби, увлечения 🏂🏻:*\n${hobbies}` : ""
    }`;

    if (photo_id) {
      await ctx.replyWithPhoto(photo_id, {
        caption: text,
        parse_mode: "MarkdownV2",
      });
    } else {
      await ctx.replyWithMarkdownV2(text);
    }
  } catch (error) {
    if (error.message === user_not_exist) {
      await ctx.reply("Данные о пользователе были удалены из бота.");
    } else {
      logError(error, ctx);
      await ctx.reply("Произошла ошибка при загрузке данных партнера.");
    }
  }
};

export default showPartnerProfile;
