var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Discord = require("discord.js");
const index = require("../index.js");
module.exports = {
    name: "alias",
    args: true,
    admin: false,
    log: false,
    usage: "`!alias <alias>`",
    description: "Lists the papers allocated to an alias.",
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const aliasRegex = /^\d{3}-level$/;
            for (let i = 0; i < args.length; i++) {
                if (!message.guild.roles.some(role => role.name === args[i])) {
                    message.channel.send(`Couldn't find ${args[i]}`);
                    continue;
                }
                if (!aliasRegex.test(args[i])) {
                    message.channel.send(`${args[0]} is not an alias.`);
                    continue;
                }
                const role = message.guild.roles.find(role => role.name === args[i]);
                let channels = "```";
                let count = 1;
                message.guild.channels.array().forEach(channel => {
                    if (role.permissionsIn(channel).has("VIEW_CHANNEL")) {
                        if (index.isPaper(channel)) {
                            channels += channel.name;
                            if (count % 4 === 0)
                                channels += "\n";
                            else
                                channels += "\t";
                            count++;
                        }
                    }
                });
                channels += "```";
                message.channel.send(new Discord.MessageEmbed().setTitle(args[i]).setDescription(channels));
            }
        });
    }
};
