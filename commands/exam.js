const index = require("../index.js");
var MAX_EMBED = 2000; // maximum characters allowed per embedded message
module.exports = {
  name: "exam",
  args: true,
  log: false,
  usage: "`!exam <course> [course ...]`",
  description: "Displays examination information for the course specified.",
  async execute(message, args) {
    var exams = [args.length];
    for (var i = 0; i < args.length; i++) {
      exams[i] = args[i];
    }
    var examData = index.formatExams(message, exams, true); // get the formatted data
    if (examData.length > MAX_EMBED) message.reply(`too many arguments to process. Try reducing the amount of courses.`);
    else { // generate the embedded message
      const embeddedMessage = index.examDataEmbed(examData);
      message.reply(embeddedMessage);
    }
  }
};
