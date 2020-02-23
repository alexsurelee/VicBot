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
    name: "rank",
    aliases: ["role"],
    args: true,
    description: "Add or remove class ranks.",
    usage: "`!rank <course> [course ...]`",
    log: false,
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args[0] === "boomer") {
                message.reply("ok boomer");
            }
            else if (message.channel.name === "bots" || message.member.hasPermission("ADMINISTRATOR")) {
                args.forEach(function (rank) {
                    index.rank(message, rank);
                });
            }
            else {
                message.reply("Please go to the bots channel!");
            }
        });
    }
};
