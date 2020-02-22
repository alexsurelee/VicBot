const fs = require("fs");
module.exports = {
  name: "addwrapper",
  args: true,
  admin: true,
  log: true,
  description: "Adds a wrapper course.",
  usage: "`!addwrapper <wrapper> <child>`",
  async execute(message, args) {
    args[0] = args[0].toLowerCase();
    args[1] = args[1].toLowerCase();

    const wrappers = require("../data/wrappers.json");
    wrappers[args[0]] = args[1];
    fs.writeFileSync(__dirname + "/../data/wrappers.json", JSON.stringify(wrappers));
    return message.channel.send(`Made ${args[0]} a wrapper for ${args[1]}.`);
  }
};
