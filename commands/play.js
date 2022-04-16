module.exports = {
    name: "yt",
    description: "Plays a song from a given URL",
    alias: [],
    run: async (client, message, args) => {
        const play = require('play-dl')
        const url = args.join(" ");

        // join voice channel using eris js
        const id = message.channel.guild.members.get(message.author.id).voiceState.channelID;
        if (id === null) return client.createMessage(message.channel.id, 'join a voice channel');

        const channel = await client.getRESTChannel(id);
        const connection = await channel.join();


        let stream = null
        try {
            stream = await play.stream(
                url,
                {
                    discordPlayerCompatibility: true,
                }
            );
        } catch (err) {
            if (err.message === "Already encoding") {
                stream = await play.stream(
                    url,
                    {
                        discordPlayerCompatibility: true,
                    }
                );
            }
            throw err;
        }
        connection.play(stream.stream)
        connection.on('end', () => { channel.leave() })

    }
}