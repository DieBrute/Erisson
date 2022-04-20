module.exports = {
    name: "resume",
    description: "resumes the music",
    alias: [],
    run: async (client, message, args) => {
        const id = message.channel.guild.members.get(message.author.id).voiceState.channelID;
        if (id === null) return client.createMessage(message.channel.id, "Can't resume a bot in a channel you are not in");
        else
            client.createMessage(message.channel.id, "Resumed the music");
        const channel = await client.getRESTChannel(id);
        const connection = await channel.join();
        connection.resume()
    }
}