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

// scenes
import createProfileScene from "./scenes/createProfileScene.js";
import viewProfileScene from "./scenes/viewProfileScene.js";
import editProfileScene from "./scenes/editProfileScene.js";
import giveBotFeedbackScene from "./scenes/giveBotFeedbackScene.js";
import editProfileNameScene from "./scenes/editProfileNameScene.js";
import editProfileWorkspaceScene from "./scenes/editProfileWorkspace.js";
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
bot.command("session", (ctx) => {
  ctx.reply(ctx.session);
});
bot.command("profile", async (ctx) => {
  showProfileInfo(ctx);
});
bot.command("menu", async (ctx) => {
  showMainButtons(ctx);
});
bot.command("register", async (ctx) => {
  randomCoffeeFound(ctx);
});

// bot actions
bot.action(ACTIONS.CREATE_PROFILE, createProfileAction);
bot.action(ACTIONS.GIVE_FEEDBACK, giveBotFeedbackAction);
bot.action(ACTIONS.VIEW_PROFILE, viewProfileAction);
bot.action(ACTIONS.REGISTER_FOR_RANDOM_COFFEE, registerForRandomCoffeeAction);
bot.action(
  ACTIONS.UNREGISTER_FROM_RANDOM_COFFEE,
  unegisterFromRandomCoffeeAction
);
bot.action(/meetup_(.+)/, async (ctx, next) => {
  await ctx.answerCbQuery();
  await ctx.reply(ctx.match[1]);
  await ctx.editMessageReplyMarkup({});
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
