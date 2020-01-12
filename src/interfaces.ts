import { Message } from "discord.js";

interface command {
	name: string,
	args: boolean,
	admin: boolean,
	aliases: string[],
	log: boolean,
	description: string,
	usage: string,
	execute(message: Message, args: string[]): Promise<any>
}