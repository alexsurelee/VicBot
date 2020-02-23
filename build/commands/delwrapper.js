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
    name: "delwrapper",
    args: true,
    admin: true,
    log: true,
    description: "Removes a wrapper course.",
    usage: "`!delwrapper <course>`",
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            args[0] = args[0].toLowerCase();
            const wrappers = require("../data/wrappers.json");
            delete wrappers[args[0]];
            fs.writeFileSync(__dirname + "/../data/wrappers.json", JSON.stringify(wrappers));
            return message.channel.send(`Removed ${args[0]} as a wrapper.`);
        });
    }
};
