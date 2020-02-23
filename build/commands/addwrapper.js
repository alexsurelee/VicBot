var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require("fs");
module.exports = {
    name: "addwrapper",
    args: true,
    admin: true,
    log: true,
    description: "Adds a wrapper course.",
    usage: "`!addwrapper <wrapper> <child>`",
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            args[0] = args[0].toLowerCase();
            args[1] = args[1].toLowerCase();
            const wrappers = require("../data/wrappers.json");
            wrappers[args[0]] = args[1];
            fs.writeFileSync(__dirname + "/../data/wrappers.json", JSON.stringify(wrappers));
            return message.channel.send(`Made ${args[0]} a wrapper for ${args[1]}.`);
        });
    }
};
