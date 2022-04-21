const plays = require("play-dl");
// using play-dl to search for songs
// create a new command called 'pl'
// that allows user to search and add songs to a playlist,
const playlist = [];
module.exports = {
    name: "pl",
    description: "Search and add songs to a playlist",
    run: async (client, message, args) => {
        try {
            const id = message.channel.guild.members.get(message.author.id).voiceState.channelID;
            const channel = await client.getRESTChannel(id);
            channel.editPosition(1);
            const connection = await channel.join();
            if (id === null) return client.createMessage(message.channel.id, 'join a voice channel');
            // if no args, return
            if (!args.length) {
                client.createMessage(message.channel.id, "Please provide a search term");
            }
            client.on("streamEnd", async () => {
                // if playlist is empty, return
                if (!playlist.length) {
                    return;
                }
                // play the next song
                let stream = await plays.stream(playlist[0].url, {
                    discordPlayerCompatibility: true,
                })
                connection.play(stream.stream)
                playlist.shift();
            })
            //if first is 'start', start the playlist
            if (args[0] === "start") {
                // if playlist is not empty
                if (playlist.length) {
                    let stream = await plays.stream(playlist[0].url, {
                        discordPlayerCompatibility: true,
                    })
                    connection.play(stream.stream)
                    playlist.shift();// remove the first song from existing playlist
                }
            }
            if (args[0] === "next" || args[0] === "skip") {
                // if playlist is not empty
                if (playlist.length) {
                    // play the song
                    let stream = await plays.stream(playlist[0].url, {
                        discordPlayerCompatibility: true,
                    })
                    if (connection.playing) {
                        //if a song is currently playing, stop it
                        connection.stopPlaying();
                    }
                    //play the next song
                    connection.play(stream.stream)
                    playlist.shift(); // remove the first song from existing playlist
                }
                else{
                    // if playlist is empty, stop the actual music, then quit the voice channel
                    client.createMessage(message.channel.id, 'Playlist is empty, stopping music');
                    connection.stopPlaying();
                    client.disconnect();
                }
            }
            else { //search and add songs to playlist based on searching term, handling spaces
                const search = args.join(" ");
                const results = await plays.search(search, {
                    limit: 1
                });
                // if no results, return
                if (!results.length) {
                    client.createMessage(message.channel.id, "No results found");
                }
                // if results, send the first result
                const firstResult = results[0];
                // add song to playlist, create and send embed
                playlist.push(firstResult);
                return client.createMessage(message.channel.id, {
                    embed: {
                        title: firstResult.title,
                        url: firstResult.url,
                        description: firstResult.description,
                        color: 0x00ff00,
                        thumbnail: {
                            url: firstResult.thumbnails[0].url
                        },
                        fields: [{
                            name: "Duration", value: firstResult.durationRaw,
                        }],
                        footer: {
                            text: "Requested by " + message.author.username
                        }
                    },
                });
            }
        } catch (err) {
            console.log(err);
            client.disconnect();
        }
    }
};
