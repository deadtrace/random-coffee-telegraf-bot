import Meeting from "../models/Meeting.js";
import User from "../models/User.js";
import { MEETING_STATUSES } from "../constants.js";
import logError from "./logError.js";

const prepareStats = async (ctx) => {
  try {
    const meetingsNewCount = await Meeting.count({
      status: MEETING_STATUSES.NEW,
    });
    const meetingsMetCount = await Meeting.count({
      status: MEETING_STATUSES.MET,
    });
    const meetingsCanceledCount = await Meeting.count({
      status: MEETING_STATUSES.CANCELED,
    });
    const meetingsTotalCount = await Meeting.count();

    const usersTotal = await User.count();
    const usersRegistered = await User.count({ registered: true });

    const text = `На прошедшей неделе было запланировано ${meetingsTotalCount} встреч:\n- о ${meetingsNewCount} встречах бот не получил никакой информации;\n- ${meetingsMetCount} встреч успешно состоялись;\n- ${meetingsCanceledCount} встреч были отменены;\n\nЗа всё время в боте зарегистрировались ${usersTotal} пользователей.\nНа этой неделе зарегистрированы на встречу ${usersRegistered} пользователей.`;

    ctx.telegram.sendMessage(process.env.FEEDBACK_CHANNEL_ID, text);
  } catch (error) {
    logError(error, ctx);
  }
};

export default prepareStats;
