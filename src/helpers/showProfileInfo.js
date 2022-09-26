const showProfileInfo = async (ctx, userId) => {
  const { name, workspace, hobbies, photo } = ctx.session.userInfo;
  const text = `Твой профиль:\n*Имя и фамилия:* ${name}\n*Команда, роль, задачи 👨🏻‍💻:*\n${workspace}\n${
    hobbies ? `*Хобби, увлечения 🏂🏻:*\n${hobbies}` : ""
  }`;
  if (photo) {
    await ctx.replyWithPhoto(photo[0].file_id, {
      parse_mode: "MarkdownV2",
      caption: text,
    });
  } else {
    await ctx.replyWithMarkdownV2(text);
  }
};

export default showProfileInfo;
