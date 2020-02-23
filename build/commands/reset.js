var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { forbiddenRanks } = require(__dirname + "/../../config.json");
const index = require("../index.js");
module.exports = {
    name: "reset",
    admin: true,
    args: true,
    description: "Resets the channel and role for a course.",
    usage: "`!reset <course>`",
    log: true,
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args.length) {
                return message.channel.send("Please include the name of the channel you wish to reset.");
            }
            else if (args.length > 1) {
                return message.channel.send("Please only include one rank to reset (no spaces).");
            }
            else if (message.guild.roles.find(role => role.name === args[0]) == null &&
                message.guild.channels.find(channel => channel.name === args[0]) == null) {
                return message.channel.send("Cannot find rank to reset.");
            }
            else if (forbiddenRanks.includes(args[0])) {
                return message.channel.send("You probably shouldn't reset this, and at the moment I'm not going to let you.");
            }
            else {
                const channel = message.guild.channels.find(channel => channel.name === args[0]);
                if (channel != null)
                    yield channel.delete();
                yield index.newRank(message, args);
                return message.channel.send(`Reset ${args[0]}.`);
            }
        });
    }
};
