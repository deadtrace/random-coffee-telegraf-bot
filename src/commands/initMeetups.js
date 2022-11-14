import * as dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import Meeting from "../models/Meeting.js";
import shuffle from "lodash.shuffle";
import chunk from "lodash.chunk";
import randomCoffeeFound from "../helpers/randomCoffeeFound.js";
import { MEETING_STATUSES } from "../constants.js";
import logError from "../helpers/logError.js";
import prepareStats from "../helpers/prepareStats.js";
import { TEXTS } from "../texts.js";
import ChatAdmin from "../models/ChatAdmin.js";

const initMeetups = async (ctx) => {
  if (ctx.chat.id === +process.env.ADMIN_ID) {
    await prepareStats(ctx);
    await Meeting.deleteMany({});

    const registeredUsers = await User.find({ registered: true }).exec();
    const pairs = chunk(shuffle(registeredUsers), 2);

    for (let pair of pairs) {
      if (pair.length === 2) {
        const [user1, user2] = pair;
        try {
          const meeting = await Meeting.create({
            tid1: user1.tid,
            tid2: user2.tid,
            status: MEETING_STATUSES.NEW,
          });

          await randomCoffeeFound(
            ctx,
            user1.tid,
            user2,
            meeting._id.toString()
          );
          await randomCoffeeFound(
            ctx,
            user2.tid,
            user1,
            meeting._id.toString()
          );
        } catch (error) {
          logError(error, ctx);
        }
      } else {
        // ОБРАБОТКА СЛУЧАЯ НЕЧЁТНОГО ПОЛЬЗОВАТЕЛЯ, ЕМУ В КАЧЕСТВЕ ПАРЫ НЕОБХОДИМО ОПРЕДЕЛИТЬ ОДНОГО ИЗ АДМИНИСТРАТОРОВ
        const [user] = pair;
        try {
          const admins = await ChatAdmin.find().exec();
          const admin = admins[Math.floor(Math.random() * admins.length)];
          const meeting = await Meeting.create({
            tid1: user.tid,
            tid2: admin.tid,
            status: MEETING_STATUSES.NEW,
          });
          await randomCoffeeFound(ctx, user.tid, admin, meeting._id.toString());
          await randomCoffeeFound(ctx, admin.tid, user, meeting._id.toString());
        } catch (error) {
          logError(error, ctx);
        }
      }
    }
  } else {
    await ctx.reply(TEXTS.NOT_ALLOWED_TO_USE_THIS_COMMAND);
  }
};

export default initMeetups;
