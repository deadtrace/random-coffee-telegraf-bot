import { MEETING_STATUSES } from "../constants.js";
import Meeting from "../models/Meeting.js";

const cancelMeeting = async (ctx, meeetingId) => {
  try {
    const meeting = await Meeting.findById(meeetingId);

    if (meeting) {
      if (meeting.status === MEETING_STATUSES.CANCELED) {
        return await ctx.reply("Встреча уже была ранее отменена.");
      }
      if (meeting.status === MEETING_STATUSES.MET) {
        return await ctx.reply("Ваш коллега сообщил, что встреча состоялась.");
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
    }
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
  }
};

export default cancelMeeting;
