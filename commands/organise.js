const index = require("../index.js");
module.exports = {
  name: "organise",
  admin: true,
  description: "Sorts the channels within the papers category.",
  usage: "`!organise`",
  log: true,
  async execute(message) {
    message.react("🕦");
    await index.organise(message);
    await message.reactions.removeAll();
    return message.react("✅");
  }
};
