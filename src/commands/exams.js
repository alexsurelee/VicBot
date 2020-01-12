const index = require('../index.js');
const MAX_EMBED = 2000; // maximum characters allowed per embedded message
module.exports = {
  name: "exams",
  args: false,
  log: false,
  usage: "`!exams`",
  description:
    "Displays examination information for each of the user's course roles.",
  async execute(message) {
    // If the message is in a server
    if (message.guild) {
      if (message.channel.type != "text") {
        // direct message command
        message.reply(
          "You need to be in the ECS Discord server to use this command. https://discord.gg/x4S3hYP"
        );
        return;
      }
      // find the exam courses of the user by checking their roles
      const exams = new Array();
      message.member.roles.forEach(function(value) {
        const exam = parseRole(value.name);
        if (exam) exams.push(exam);
      });
      const examData = index.formatExams(message, exams, false); // get the formatted data
      if (examData.length > MAX_EMBED)
        message.reply(
          "too many arguments to process. Try reducing the amount of course roles you have."
        );
      else if (examData.length > 0) {
        // generate the embedded message
        const embeddedMessage = index.examDataEmbed(examData);
        message.reply(embeddedMessage);
      }
      else
        message.reply(
          "couldn't find exam data for your course roles for the current trimister."
        ); // none of the user courses were valid
    }
    // The message was sent in a DM, can't retrieve the server info
    else
      return message.reply(
        "Looks like you didn't send this message from a server"
      );
  }
};

/**
 * Checks if the input is a valid role.
 * @param {string}
 * @return {any}
 */
function parseRole(role) {
  if (/^[a-zA-Z]{4}-[0-9]{3}/.test(role)) {
    return role.slice(0, 4).toUpperCase() + role.slice(5, 8);
  }
  else return undefined;
}
