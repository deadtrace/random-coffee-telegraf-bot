import * as dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import Meeting from "../models/Meeting.js";
import shuffle from "lodash.shuffle";
import chunk from "lodash.chunk";
import randomCoffeeFound from "../helpers/randomCoffeeFound.js";
import { MEETING_STATUSES } from "../constants.js";

const initMeetups = async (ctx) => {
  if (ctx.chat.id === +process.env.ADMIN_ID) {
    const registeredUsers = await User.find({ registered: true }).exec();
    const pairs = chunk(shuffle(registeredUsers), 2);

    for (let pair of pairs) {
      if (pair.length === 2) {
        const [user1, user2] = pair;
        try {
          await Meeting.deleteMany({});
          await Meeting.create({
            tid1: user1.tid,
            tid2: user2.tid,
            status: MEETING_STATUSES.NEW,
          });
          await randomCoffeeFound(ctx, user1.tid, user2);
          await randomCoffeeFound(ctx, user2.tid, user1);
        } catch (error) {
          console.log(error);
        }
      } else {
        // TODO: сообщить о том, что не нашли пару
      }
    }
  } else {
    await ctx.reply("Вам не доступна данная команда");
  }
};

export default initMeetups;
