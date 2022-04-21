module.exports = {
    name: "pause",
    description: "stops the music",
    alias: [],
    run: async (client, message, args) => {
        const id = message.channel.guild.members.get(message.author.id).voiceState.channelID;
        if (id === null) return client.createMessage(message.channel.id, "Can't stop a bot in a channel you are not in");
        else
            client.createMessage(message.channel.id, "Pause");
        const channel = await client.getRESTChannel(id);
        const connection = await channel.join();
        connection.pause()
        client.editStatus("Pause", {
            name: `:pause_button:`,
            type: 0
        })
    }
}