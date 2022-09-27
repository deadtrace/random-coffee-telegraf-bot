import * as dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import Meeting from "../models/Meeting.js";
import shuffle from "lodash.shuffle";
import chunk from "lodash.chunk";
import randomCoffeeFound from "../helpers/randomCoffeeFound.js";
import { MEETING_STATUSES } from "../constants.js";
import sendReminder from "../helpers/sendReminder.js";

const initMeetups = async (ctx) => {
  if (ctx.chat.id === +process.env.ADMIN_ID) {
    const meetings = await Meeting.find({
      status: MEETING_STATUSES.NEW,
    }).exec();
    for (let meeting of meetings) {
      const { _id, tid1, tid2 } = meeting;
      await sendReminder(ctx, tid1, tid2, _id.toString());
      await sendReminder(ctx, tid2, tid1, _id.toString());
    }
  } else {
    await ctx.reply("Вам не доступна данная команда");
  }
};

export default initMeetups;
