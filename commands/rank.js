module.exports = {
    name: 'rank',
    description: 'Add or remove class ranks.',
    execute(message, args){
        if (!args.length) {
            return message.channel.send(`Please provide a class to join. Type !ranks for a list.`);
        }
        else{
            args.forEach(function(item, index, array){
                addRank(message, item);
            });
        }
    }
}