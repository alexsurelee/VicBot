import { Message } from "discord.js";

export interface Command {
	name: string;
	args: boolean;
	admin: boolean;
	aliases: string[];
	log: boolean;
	description: string;
	usage: string;
	execute(message: Message, args: string[]): Promise<any>;
}