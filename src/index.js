// libraries import
import * as dotenv from "dotenv";
dotenv.config();
import { Telegraf, Scenes } from "telegraf";
import TSL from "telegraf-session-local";
import mongoose from "mongoose";

// environment variables
const { BOT_TOKEN, DB_USERNAME, DB_PASSWORD, DB_LINK, DB_COLLECTION } =
  process.env;

mongoose
  .connect(
    `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_LINK}/${DB_COLLECTION}`
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

// scenes
import createProfileScene from "./scenes/createProfileScene.js";
import viewProfileScene from "./scenes/viewProfileScene.js";
import editProfileScene from "./scenes/editProfileScene.js";
import giveBotFeedbackScene from "./scenes/giveBotFeedbackScene.js";
import editProfileNameScene from "./scenes/editProfileNameScene.js";
import editProfileWorkspaceScene from "./scenes/editProfileWorkspaceScene.js";
import editProfileHobbiesScene from "./scenes/editProfileHobbiesScene.js";
import editProfilePhotoScene from "./scenes/editProfilePhotoScene.js";

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
import randomCoffeeFound from "./helpers/randomCoffeeFound.js";
import showPartnerProfile from "./helpers/showPartnerProfile.js";
import cancelMeeting from "./helpers/cancelMeeting.js";

// bot setup
const bot = new Telegraf(BOT_TOKEN);
bot.use(new TSL({ database: "data/session.json" }).middleware());
const stage = new Scenes.Stage([
  createProfileScene,
  giveBotFeedbackScene,
  viewProfileScene,
  editProfileScene,
  editProfileNameScene,
  editProfileWorkspaceScene,
  editProfileHobbiesScene,
  editProfilePhotoScene,
]);
bot.use(stage.middleware());

// bot reactions
bot.start(startCommand);
// FOR DEVELOP PURPOSES ONLY. TODO: DELETE
bot.command("profile", async (ctx) => {
  showProfileInfo(ctx);
});
bot.command("menu", async (ctx) => {
  showMainButtons(ctx);
});
bot.command("register", async (ctx) => {
  randomCoffeeFound(ctx);
});
bot.command("init_meetups", initMeetups);
bot.command("remind_meetups", remindMeetups);

// bot actions
bot.action(ACTIONS.CREATE_PROFILE, createProfileAction);
bot.action(ACTIONS.GIVE_FEEDBACK, giveBotFeedbackAction);
bot.action(ACTIONS.VIEW_PROFILE, viewProfileAction);
bot.action(ACTIONS.REGISTER_FOR_RANDOM_COFFEE, registerForRandomCoffeeAction);
bot.action(
  ACTIONS.UNREGISTER_FROM_RANDOM_COFFEE,
  unegisterFromRandomCoffeeAction
);
bot.action(/meetup_watch-partner_(.+)/, async (ctx, next) => {
  await ctx.answerCbQuery();
  await showPartnerProfile(ctx, +ctx.match[1]);
});
bot.action(/meetup_cancel_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageReplyMarkup();
  await cancelMeeting(ctx, ctx.match[1]);
});
bot.action(/.+/, async (ctx) => {
  await ctx.deleteMessage();
  return ctx.answerCbQuery();
});

// launching
bot
  .launch()
  .then(() => console.log("BOT SUCCESSFULLY STARTED", new Date()))
  .catch((err) => console.log(err));
