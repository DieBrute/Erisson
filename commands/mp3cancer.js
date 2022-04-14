module.exports = {
    name: "mp3cancer",
    description: "plays a mp3 file",
    alias: [],
    run: async (client, message, args) => {
        const id = message.channel.guild.members.get(message.author.id).voiceState.channelID;

        if (id === null) return client.createMessage(message.channel.id, 'join a voice channel');
        const channel = await client.getRESTChannel(id);
        const connection = await channel.join();

        connection.play('https://cdn.discordapp.com/attachments/931487798110859265/939558715072339998/bootleg_montero_cover.mp3');

        connection.on('end', () => { channel.leave(); });
    }
}