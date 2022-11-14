import User from "../models/User.js";
import logError from "./logError.js";

const showPartnerProfile = async (ctx, tid) => {
  try {
    const user = await User.findOne({ tid }).exec();
    const { name, workspace, hobbies, photo_id, username } = user;
    const text = `Профиль твоего собеседника:\nИмя и фамилия:\n${name} @${username}\nКоманда, роль, задачи 👨🏻‍💻:\n${workspace}\n${
      hobbies ? `Хобби, увлечения 🏂🏻:\n${hobbies}` : ""
    }`;

    if (photo_id) {
      await ctx.replyWithPhoto(photo_id, {
        caption: text,
      });
    } else {
      await ctx.reply(text);
    }
  } catch (error) {
    logError(error, ctx);
    await ctx.reply(
      "Произошла ошибка при загрузке данных партнера. Попробуй ещё раз позднее."
    );
  }
};

export default showPartnerProfile;
