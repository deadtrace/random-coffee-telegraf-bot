import { MEETING_STATUSES } from "../constants.js";
import Meeting from "../models/Meeting.js";
import { TEXTS } from "../texts.js";
import logError from "./logError.js";

const cancelMeeting = async (ctx, meeetingId) => {
  try {
    const meeting = await Meeting.findById(meeetingId);

    if (meeting) {
      if (meeting.status === MEETING_STATUSES.CANCELED) {
        return await ctx.reply(TEXTS.MEETING_CANCELED_ALREADY);
      }
      if (meeting.status === MEETING_STATUSES.MET) {
        return await ctx.reply(TEXTS.MEETING_MET_ALREADY);
      }
      meeting.status = MEETING_STATUSES.CANCELED;
      await meeting.save();

      const partnerId =
        meeting.tid1 === ctx.chat.id ? meeting.tid2 : meeting.tid1;
      await ctx.reply(TEXTS.MEETING_CANCELED_SUCCESSFULLY);
      try {
        await ctx.telegram.sendMessage(
          partnerId,
          TEXTS.COLLEAGUE_CANCELED_MEETING
        );
      } catch (error) {
        if (error.response?.error_code === 403) {
          await User.findOneAndDelete({ tid: partnerId });
        } else {
          logError(error, ctx);
        }
      }
    }
  } catch (error) {
    logError(error, ctx);
  }
};

export default cancelMeeting;
