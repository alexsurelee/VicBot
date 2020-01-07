const index = require("../index.js");
const { courseCodes } = require("../config.json");
module.exports = {
  name: "updateexams",
  args: false,
  admin: true,
  usage: "`!updateexams`",
  log: true,
  description: "Updates exam data from the set URL.",
  async execute(message) {
    // If the message is in a server
    if (message.guild) {
      if (index.fetchData()) message.reply("an error has occurred attempting to fetch the exam data. Is the URL valid?");
      else {
        if (new Date() - index.getExamLastUpdated() < 10000) { // updated within 10 seconds
          index.processData();
          message.reply("successfully fetched and processed the exam data.");
        } else message.reply("an error has occurred attempting to fetch the exam data. Is the URL valid?");
      }
    }
    // The message was sent in a DM, can't retrieve the server info
    else return message.reply("Looks like you didn't send this message from a server");
  }
};
