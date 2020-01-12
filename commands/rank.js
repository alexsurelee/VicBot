const index = require("../index.js");

module.exports = {
  name: "rank",
  aliases: ["role"],
  args: true,
  description: "Add or remove class ranks.",
  usage: "`!rank <course> [course ...]`",
  log: false,
  async execute(message, args) {
    if (args[0] === "boomer") {
      message.reply("ok boomer");
    }
    else if (message.channel.name === "bots") {
      args.forEach(function(rank) {
        index.rank(message, rank);
      });
    }
    else {
      message.reply("Please go to the bots channel!");
    }
  }
};
