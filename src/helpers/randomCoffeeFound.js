import * as dotenv from "dotenv";
dotenv.config();
import { Markup } from "telegraf";

const randomCoffeeFound = async (ctx) => {
  await ctx.telegram.sendMessage(
    process.env.TEST_USER_ID,
    `Мы нашли тебе коллегу для встречи - …
Постарайся провести встречу в течение одной недели.
Провели встречу – проинформируй об успешности встречи по кнопке снизу
Не сможешь провести встречу – отмени ее также по кнопке снизу
  `,
    {
      reply_markup: {
        inline_keyboard: [
          [
            Markup.button.callback(
              "Посмотреть профиль партнера 📄",
              "meetup_watch-partner_something"
            ),
          ],
          [
            Markup.button.callback(
              "Проинформировать о прошедшей встрече ✅",
              "meetup_happened_something"
            ),
          ],
          [
            Markup.button.callback(
              "Отменить встречу ❌",
              "meetup_cancel_something"
            ),
          ],
        ],
      },
    }
  );
};

export default randomCoffeeFound;
