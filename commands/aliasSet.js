module.exports = {
    name: 'aliasSet',
    execute(message, role, change){
        if (role.guild.channels.find(channel => channel.name === null)) return message.channel.send(`Couldn't find ${change}`);
    const channel = role.guild.channels.find(ch => ch.name === change);
    if (role.permissionsIn(channel).has(`VIEW_CHANNEL`)) {
        await channel.updateOverwrite(role, { VIEW_CHANNEL: null });
        return message.channel.send(`Removed ${role.name} from ${change}`);
    }
    else {
        await channel.updateOverwrite(role, { VIEW_CHANNEL: true });
        return message.channel.send(`Added ${role.name} to ${change}`);
    }
    }
}