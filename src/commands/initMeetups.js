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
        const [user] = pair;
        try {
          await ctx.telegram.sendMessage(
            user.tid,
            "К сожалению, на этой неделе для Вас не нашлось коллеги. Ждите приглашения на следующей неделе!"
          );
        } catch (error) {
          if (error.response?.error_code === 403) {
            await User.findOneAndDelete({ tid: user.tid });
          } else {
            logError(error, ctx);
          }
        }
      }
    }
  } else {
    await ctx.reply("Вам не доступна данная команда");
  }
};

export default initMeetups;
