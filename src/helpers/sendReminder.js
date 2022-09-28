import { Markup } from "telegraf";

const sendReminder = async (ctx, tid1, tid2, meetingId) => {
  await ctx.telegram.sendMessage(
    tid1,
    "Привет! Сегодня среда, а ты ещё не провёл встречу?\n\nЕсть варианты:\n– Встреча прошла, но ты забыл проинформировать нас – сделай это сейчас по кнопке снизу.\n– Встречу не проводили – спишись с коллегой, у тебя есть ещё 3 дня!",
    {
      reply_markup: {
        inline_keyboard: [
          [
            Markup.button.callback(
              "Посмотреть профиль партнера 📄",
              `meetup_watch-partner_${tid2}`
            ),
          ],
          [
            Markup.button.callback(
              "Проинформировать о прошедшей встрече ✅",
              `meetup_happened_${meetingId}`
            ),
          ],
          [
            Markup.button.callback(
              "Отменить встречу ❌",
              `meetup_cancel_${meetingId}`
            ),
          ],
        ],
      },
    }
  );
};

export default sendReminder;
