var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const index = require("../index.js");
module.exports = {
    name: "queue",
    args: false,
    admin: false,
    log: false,
    description: "Displays the currently queue.",
    usage: "`!queue`",
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const serverQueue = index.getQueue(message.guild.id);
            if (!serverQueue)
                return message.channel.send("There is nothing playing.");
            return message.channel.send(`__**Song queue:**__${serverQueue.songs
                .map(song => `**-** ${song.title}`)
                .join("\n")}**Now playing:** ${serverQueue.songs[0].title}`);
        });
    }
};
