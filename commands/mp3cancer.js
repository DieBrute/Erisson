module.exports = {
    name: "mp3cancer",
    description: "plays a mp3 file",
    alias: [],
    run: async (client, message, args) => {
        const id = message.channel.guild.members.get(message.author.id).voiceState.channelID;

        connection.on('end', () => { channel.leave(); });
    }
}

