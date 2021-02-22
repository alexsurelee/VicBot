const index = require("../index.js");
const fs = require("fs");

module.exports = {
  name: "rank",
  aliases: ["role"],
  args: true,
  description: "Add or remove class ranks.",
  usage: "`!rank <course> [course ...]`",
  log: false,
  async execute(message) {
    return message.reply(
      `Please use WgtnBot for managing courses. You can join with \`+join\` and leave with \`+leave\`.`
    );
  }
};
