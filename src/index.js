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
    `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_LINK}/${DB_COLLECTION}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("DB OK");
  })
  .catch((err) => {
    console.log("DB ERROR", err);
  });

// commands
import startCommand from "./commands/start.js";

// scenes
import createProfileScene from "./scenes/createProfileScene.js";
import giveBotFeedbackScene from "./scenes/giveBotFeedbackScene.js";

// actions
import ACTIONS from "./actions/actionsList.js";
import createProfileAction from "./actions/createProfileAction.js";
import giveBotFeedbackAction from "./actions/giveBotFeedbackAction.js";

//helpers
import showProfileInfo from "./helpers/showProfileInfo.js";
import showMainButtons from "./helpers/showMainButtons.js";

// bot setup
const bot = new Telegraf(BOT_TOKEN);
bot.use(new TSL({ database: "data/session.json" }).middleware());
const stage = new Scenes.Stage([createProfileScene, giveBotFeedbackScene]);
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

// bot actions
bot.action(ACTIONS.CREATE_PROFILE, createProfileAction);
bot.action(ACTIONS.GIVE_FEEDBACK, giveBotFeedbackAction);
bot.action(/.+/, (ctx) => {
  return ctx.answerCbQuery(`${ctx.match[0]}`);
});

// launching
bot
  .launch()
  .then(() => console.log("BOT SUCCESSFULLY STARTED", new Date()))
  .catch((err) => console.log(err));
