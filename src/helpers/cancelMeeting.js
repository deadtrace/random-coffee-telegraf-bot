import { MEETING_STATUSES } from "../constants.js";
import Meeting from "../models/Meeting.js";

const cancelMeeting = async (ctx, meeetingId) => {
  try {
    const meeting = await Meeting.findById(meeetingId);
    if (meeting.status === MEETING_STATUSES.CANCELED) {
      return await ctx.reply("Встреча уже была ранее отменена.");
    }
    meeting.status = MEETING_STATUSES.CANCELED;
    await meeting.save();

    const partnerId =
      meeting.tid1 === ctx.chat.id ? meeting.tid2 : meeting.tid1;
    await ctx.reply("Встреча успешно отменена!");
    await ctx.telegram.sendMessage(
      partnerId,
      "К сожалению, коллега отменил встречу на этой неделе."
    );
  } catch (error) {
    console.log(error);
  }
};

export default cancelMeeting;
