import { Scenes, Composer, Markup } from "telegraf";
import SCENES from "./scenesList.js";
import showMainButtons from "../helpers/showMainButtons.js";
import Feedback from "../models/Feedback.js";
import Meeting from "../models/Meeting.js";
import User from "../models/User.js";
import { MEETING_STATUSES } from "../constants.js";
import logError from "../helpers/logError.js";

const feedback = new Composer();
feedback.on("text", async (ctx) => {
  const { lastBotMessage, meetupId } = ctx.session;
  if (lastBotMessage) {
    try {
      await ctx.telegram.editMessageReplyMarkup(
        ctx.chat.id,
        lastBotMessage,
        "",
        {}
      );
    } catch (error) {
      console.error(error);
    }
  }

  if (meetupId) {
    try {
      const meeting = await Meeting.findById(meetupId);
      if (
        meeting.status === MEETING_STATUSES.NEW ||
        meeting.status === MEETING_STATUSES.CANCELED
      ) {
        meeting.status = MEETING_STATUSES.MET;
        await meeting.save();
      }
    } catch (error) {
      logError(error, ctx);
    }
  }

  const { username, id } = ctx.chat;
  const { text } = ctx.message;

  const formattedText = `Отзыв о встрече от ${
    username ? `@${username}` : ""
  }(${id}):\n${text}`;
  const { FEEDBACK_CHANNEL_ID } = process.env;

  try {
    await ctx.telegram.sendMessage(FEEDBACK_CHANNEL_ID, formattedText);
    await Feedback.create({
      tid: id,
      username: String(username),
      type: "meeting",
      text,
    });
    await ctx.reply("Спасибо за отзыв о встрече!");
  } catch (error) {
    await ctx.reply(
      "Произошла ошибка при отправке обратной связи. Попробуй ещё раз позднее."
    );
  }

  try {
    await User.findOneAndUpdate({ tid: ctx.chat.id }, { registered: true });
  } catch (error) {
    logError(error, ctx);
  }

  await showMainButtons(
    ctx,
    "Мы закинули тебя в очередь на поиск нового коллеги, совсем скоро оповестим тебя 😉"
  );
  return ctx.scene.leave();
});
feedback.action("without-feedback", async (ctx) => {
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error(error);
  }
  const { meetupId } = ctx.session;
  if (meetupId) {
    try {
      const meeting = await Meeting.findById(meetupId);
      if (
        meeting.status === MEETING_STATUSES.NEW ||
        meeting.status === MEETING_STATUSES.CANCELED
      ) {
        meeting.status = MEETING_STATUSES.MET;
        await meeting.save();
      }
    } catch (error) {
      logError(error, ctx);
    }
  }

  try {
    await User.findOneAndUpdate({ tid: ctx.chat.id }, { registered: true });
  } catch (error) {
    logError(error, ctx);
  }

  await showMainButtons(
    ctx,
    "Мы закинули тебя в очередь на поиск нового коллеги, совсем скоро оповестим тебя 😉"
  );
  return ctx.scene.leave();
});

const giveMeetupFeedbackScene = new Scenes.WizardScene(
  SCENES.GIVE_MEETUP_FEEDBACK,
  async (ctx) => {
    const { message_id } = await ctx.reply(
      "Как прошла встреча? Напиши отзыв",
      Markup.inlineKeyboard([
        Markup.button.callback("Без отзыва", "without-feedback"),
      ])
    );
    ctx.session.lastBotMessage = message_id;
    return ctx.wizard.next();
  },
  feedback
);

export default giveMeetupFeedbackScene;
