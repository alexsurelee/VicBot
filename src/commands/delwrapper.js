const fs = require("fs");
module.exports = {
  name: "delwrapper",
  args: true,
  admin: true,
  log: true,
  description: "Removes a wrapper course.",
  usage: "`!delwrapper <course>`",
  async execute(message, args) {
    args[0] = args[0].toLowerCase();

    const wrappers = require("../data/wrappers.json");
    delete wrappers[args[0]];
    fs.writeFileSync(
      __dirname + "/../data/wrappers.json",
      JSON.stringify(wrappers)
    );
    return message.channel.send(`Removed ${args[0]} as a wrapper.`);
  }
};
