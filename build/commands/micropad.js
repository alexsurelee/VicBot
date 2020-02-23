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
    name: "micropad",
    args: false,
    usage: "`!micropad`",
    log: false,
    description: "Provides information about micropad.",
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            message.channel.send("<:micropad:339927818181935105> is the easy to use powerful notepad app developed by our very own Nick. Check it out at https://getmicropad.com");
        });
    }
};
