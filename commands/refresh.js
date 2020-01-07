const index = require("../index.js");
module.exports = {
  name: "refresh",
  args: false,
  admin: true,
  log: true,
  usage: "`!refresh`",
  description: "Updates the examination information for the current course channel.",
  async execute(message) {
    if (message.guild) {
      var channelName = message.channel.name;
      var exam = index.parseExam(channelName);
      if (exam) index.notifyExams(message, [exam], true);
      else message.reply(`invalid channel. Is <#${message.channel.id}> a course channel?`);
    }
    // The message was sent in a DM, can't retrieve the server info
    else return message.reply("Looks like you didn't send this message from a server");
  }
};
