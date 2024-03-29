// libraries import
import * as dotenv from "dotenv";
dotenv.config();
import { Telegraf, Scenes } from "telegraf";
import TSL from "telegraf-session-local";
import mongoose from "mongoose";

// environment variables
const { BOT_TOKEN, DB_USERNAME, DB_PASSWORD, DB_LINK, DB_COLLECTION, STAND } =
  process.env;

mongoose
  .connect(
    `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_LINK}/${DB_COLLECTION}?authSource=admin`
  )
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((error) => {
    console.log("DB NOT CONNECTED");
    console.log(error);
  });

// commands
import startCommand from "./commands/start.js";
import initMeetups from "./commands/initMeetups.js";
import remindMeetups from "./commands/remindMeetups.js";
import askAboutFutureMeetups from "./commands/askAboutFutureMeetups.js";

// scenes
import SCENES from "./scenes/scenesList.js";
import createProfileScene from "./scenes/createProfileScene.js";
import viewProfileScene from "./scenes/viewProfileScene.js";
import editProfileScene from "./scenes/editProfileScene.js";
import giveBotFeedbackScene from "./scenes/giveBotFeedbackScene.js";
import editProfileNameScene from "./scenes/editProfileNameScene.js";
import editProfileWorkspaceScene from "./scenes/editProfileWorkspaceScene.js";
import editProfileHobbiesScene from "./scenes/editProfileHobbiesScene.js";
import editProfilePhotoScene from "./scenes/editProfilePhotoScene.js";
import giveMeetupFeedbackScene from "./scenes/giveMeetupFeedbackScene.js";

// actions
import ACTIONS from "./actions/actionsList.js";
import createProfileAction from "./actions/createProfileAction.js";
import giveBotFeedbackAction from "./actions/giveBotFeedbackAction.js";
import viewProfileAction from "./actions/viewProfileAction.js";
import registerForRandomCoffeeAction from "./actions/registerForRandomCoffeeAction.js";
import unegisterFromRandomCoffeeAction from "./actions/unregisterFromRandomCoffeeAction.js";

//helpers
import showProfileInfo from "./helpers/showProfileInfo.js";
import showMainButtons from "./helpers/showMainButtons.js";
import showPartnerProfile from "./helpers/showPartnerProfile.js";
import cancelMeeting from "./helpers/cancelMeeting.js";
import handleRegister from "./helpers/handleRegister.js";
import logError from "./helpers/logError.js";
import contactUser from "./commands/contactUser.js";
import aliveEcho from "./commands/aliveEcho.js";
import updateUsername from "./helpers/updateUsername.js";
//import newYearCommand from "./commands/newYearCommand.js";

// bot setup
const bot = new Telegraf(BOT_TOKEN);
bot.use(new TSL({ database: `data/session-${STAND}.json` }).middleware());
const stage = new Scenes.Stage([
  createProfileScene,
  giveBotFeedbackScene,
  viewProfileScene,
  editProfileScene,
  editProfileNameScene,
  editProfileWorkspaceScene,
  editProfileHobbiesScene,
  editProfilePhotoScene,
  giveMeetupFeedbackScene,
]);
bot.use(stage.middleware());

// bot reactions
bot.start(startCommand);
bot.command("profile", async (ctx) => {
  showProfileInfo(ctx);
});
bot.command("menu", async (ctx) => {
  showMainButtons(ctx);
});

// admin commands
bot.command("init_meetups", initMeetups);
bot.command("remind_meetups", remindMeetups);
bot.command("ask_about_future_meetups", askAboutFutureMeetups);
bot.command("contact", contactUser);
bot.command("alive", aliveEcho);
//bot.command("new_year", newYearCommand);

// bot actions
bot.action(ACTIONS.CREATE_PROFILE, createProfileAction);
bot.action(ACTIONS.GIVE_FEEDBACK, giveBotFeedbackAction);
bot.action(ACTIONS.VIEW_PROFILE, viewProfileAction);
bot.action(ACTIONS.REGISTER_FOR_RANDOM_COFFEE, registerForRandomCoffeeAction);
bot.action(
  ACTIONS.UNREGISTER_FROM_RANDOM_COFFEE,
  unegisterFromRandomCoffeeAction
);

bot.action(/register_(.+)/, async (ctx) => {
  const value = ctx.match[1] === "true";
  try {
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup();
  } catch (error) {
    console.error(error);
  }
  updateUsername(ctx);
  await handleRegister(ctx, value);
});

bot.action(/meetup_watch-partner_(.+)/, async (ctx) => {
  try {
    await ctx.answerCbQuery();
  } catch (error) {
    console.error(error);
  }
  updateUsername(ctx);
  await showPartnerProfile(ctx, +ctx.match[1]);
});
bot.action(/meetup_happened_(.+)/, async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup();
  } catch (error) {
    console.error(error);
  }
  ctx.session.meetupId = ctx.match[1];
  updateUsername(ctx);
  await ctx.scene.enter(SCENES.GIVE_MEETUP_FEEDBACK);
});
bot.action(/meetup_cancel_(.+)/, async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup();
  } catch (error) {
    console.error(error);
  }
  updateUsername(ctx);
  await cancelMeeting(ctx, ctx.match[1]);
});

bot.action(/.+/, async (ctx) => {
  try {
    await ctx.deleteMessage();
    await ctx.answerCbQuery();
  } catch (error) {
    console.error(error);
  }
  updateUsername(ctx);
});

// launching
bot
  .launch()
  .then(() => console.log("BOT SUCCESSFULLY STARTED", new Date()))
  .catch((err) => logError(err));
