const plays = require('play-dl');
module.exports = {
    name: "play",
    description: "plays a song if URL is provided",
    alias: [],
    run: async (client, message, args) => {
        try{
            const id = message.channel.guild.members.get(message.author.id).voiceState.channelID;
            if (id === null) return client.createMessage(message.channel.id, 'join a voice channel');
            const channel = await client.getRESTChannel(id);
            channel.editPosition(1);
            const connection = await channel.join();
            
            let yt_info = await plays.search(args[0], {
                limit: 1
            })
            let stream = await plays.stream(
                yt_info[0].url,
                {
                    discordPlayerCompatibility: true,
                }
            );
            connection.play(stream.stream)

            connection.on('end', () => { channel.leave(); });
        } catch (err) {
            console.log(err);
            client.disconnect();
        }
    }
}