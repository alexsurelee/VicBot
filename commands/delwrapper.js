const fs = require("fs");
module.exports = {
  name: "delwrapper",
  args: true,
  admin: true,
  log: true,
  description: "Removes a wrapper course.",
  usage: "`!delwrapper <course>`",
  async execute(message, args) {
    const filePath = __dirname + "/../data/wrappers.json";
    args[0] = args[0].toLowerCase();
    if (fs.existsSync(filePath)) {
      const wrappers = require(filePath);
      delete wrappers[args[0]];
      fs.writeFileSync(
        filePath,
        JSON.stringify(wrappers)
      );
      return message.channel.send(`Removed ${args[0]} as a wrapper.`);
    }
    return message.channel.send(`No wrappers found!`);

  }
};
