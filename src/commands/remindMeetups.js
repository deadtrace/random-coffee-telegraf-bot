import Meeting from "../models/Meeting.js";
import { MEETING_STATUSES } from "../constants.js";
import sendReminder from "../helpers/sendReminder.js";
import { TEXTS } from "../texts.js";
import logError from "../helpers/logError.js";

const remindMeetups = async (ctx) => {
  try {
    if (ctx.chat.id !== +process.env.ADMIN_ID) {
      return await ctx.reply(TEXTS.NOT_ALLOWED_TO_USE_THIS_COMMAND);
    }

    const meetings = await Meeting.find({
      status: MEETING_STATUSES.NEW,
    }).exec();

    for (let meeting of meetings) {
      const { _id, tid1, tid2 } = meeting;
      await sendReminder(ctx, tid1, tid2, _id.toString());
      await sendReminder(ctx, tid2, tid1, _id.toString());
    }
  } catch (error) {
    logError(error, ctx);
  }
};

export default remindMeetups;
