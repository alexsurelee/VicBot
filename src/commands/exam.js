const index = require('../index.js');
const MAX_EMBED = 2000; // maximum characters allowed per embedded message
module.exports = {
  name: 'exam',
  args: false,
  log: false,
  usage: '`!exam | <course> [course ...]`',
  description: 'Displays examination information for the course specified.',
  async execute(message, args) {
    if (args.length == 0) {
      const channelName = message.channel.name;
      const exam = index.parseExam(channelName);
      if (!exam) return message.reply("Looks like this isn't a course channel, try specifying a course or execute this command in a course channel!");
      const examData = index.formatExams(message, [exam], true); // get the formatted data
      const embeddedMessage = index.examDataEmbed(examData);
      message.reply(embeddedMessage);
    }
    else {
      const exams = [args.length];
      for (let i = 0; i < args.length; i++) {
        exams[i] = args[i];
      }
      const examData = index.formatExams(message, exams, true); // get the formatted data
      if (examData.length > MAX_EMBED)
        message.reply(
          "too many arguments to process. Try reducing the amount of courses."
        );
      else {
        // generate the embedded message
        const embeddedMessage = index.examDataEmbed(examData);
        message.reply(embeddedMessage);
      }
    }
  }
};
