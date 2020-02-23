var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = {
    name: "delrank",
    args: true,
    admin: true,
    log: true,
    usage: "`!delrank <course>`",
    description: "Deletes a class's role and channel.",
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            args[0] = args[0].toLowerCase();
            if (!args.length) {
                return message.channel.send("Please provide a rank to delete. Type !ranks for a list.");
            }
            else if (args.length > 1) {
                return message.channel.send("Please only list one rank to delete.");
            }
            else if (!args[0].includes("-")) {
                return message.channel.send("Classes should include the `-` symbol");
            }
            else if (args[0].includes("+")) {
                return message.channel.send("You cannot include the `+` symbol in a rank.");
            }
            else if (args[0].length !== 8) {
                return message.channel.send("Classes should be 8 characters long, e.g. `engr-101`");
            }
            else if (message.guild.roles.find(role => role.name === args[0]) == null &&
                message.guild.channels.find(channel => channel.name === args[0]) == null) {
                return message.channel.send("Cannot find rank to delete.");
            }
            else {
                if (message.guild.roles.find(role => role.name === args[0]) != null)
                    yield message.guild.roles.find(role => role.name === args[0]).delete();
                if (message.guild.channels.find(channel => channel.name === args[0]) != null)
                    yield message.guild.channels
                        .find(channel => channel.name === args[0])
                        .delete();
                return message.channel.send(`Deleted ${args[0]}.`);
            }
        });
    }
};
