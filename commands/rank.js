const index = require("../index.js");
const fs = require("fs");

module.exports = {
  name: "rank",
  aliases: ["role"],
  args: true,
  description: "Add or remove class ranks.",
  usage: "`!rank <course> [course ...]`",
  log: false,
  async execute(message, args) {
    const noDashCourseRegex = /^[a-zA-Z]{4}[1-4]\d\d$/;
    let alias = args[0];
    if (noDashCourseRegex.test(alias))
      alias = alias.slice(0, 4) + "-" + alias.slice(4, 7);

    if (args[0] === "boomer") {
      message.reply("ok boomer");
    }
    else if (message.channel.name === "bots" || message.member.hasPermission("ADMINISTRATOR")) {
      if (index.aliasRegex.test(alias)) {
        if (fs.existsSync(__dirname + "/../data/aliases.json")) {
          const aliases = require(__dirname + "/../data/aliases.json");
          if (aliases[alias]) {
            aliases[alias].forEach(course => {
              index.rank(message, course);
            });
          }
        }
      }
      else {
        args.forEach(rank => {
          index.rank(message, rank);
        });
      }
    }
    else {
      message.reply("Please go to the bots channel!");
    }
  }
};
