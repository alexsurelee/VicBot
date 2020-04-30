const index = require("../index.js");
module.exports = {
  name: "warn",
  args: true,
  admin: true,
  log: true,
  description: "Warns a user.",
  usage: "`!warn <user> <reason>`",
  async execute(message, args) {
    const user = message.mentions.users.first();
    index.warn(user, message);
  }
};
