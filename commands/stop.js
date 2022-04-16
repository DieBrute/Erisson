module.exports = {
    name: "stop",
    description: "Stops the current song",
    alias: [],
    run: async (client, message, args) => {
        const id = message.channel.guild.members.get(message.author.id).voiceState.channelID;
        if (id === null) return client.createMessage(message.channel.id, 'join a voice channel');
        const channel = await client.getRESTChannel(id);
        channel.leave();
    }
}
