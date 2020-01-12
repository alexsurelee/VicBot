const index = require('../index.js');
const { courseCodes } = require('../config.json');
module.exports = {
  name: 'setexamurl',
  args: true,
  admin: true,
  log: true,
  usage: '`!setexamurl <exam data url>`',
  description: 'Changes the URL where to fetch updated exam data.',
  async execute(message, args) {
    // If the message is in a server
    if (message.guild) {
      if (index.updateConfigUrl(args[0]))
        message.reply('successfully updated the URL and processed the data.');
      else message.reply('invalid URL. Does the URL end with `./xlsx`?');
    }
    // The message was sent in a DM, can't retrieve the server info
    else
      return message.reply(
        "Looks like you didn't send this message from a server"
      );
  }
};
