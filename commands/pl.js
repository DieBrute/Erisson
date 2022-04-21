const plays = require("play-dl");
// using play-dl to search for songs
// create a new command called 'pl'
// that allows user to search and add songs to a playlist,
const playlist = [];
module.exports = {
    name: "pl",
    aliases: ["playlist"],
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
            client.on("end", async () => {
                // if playlist is empty, return
                if (!playlist.length) {
                    return;
                }
                // play the next song
                let stream = await plays.stream(playlist[0].url, {
                    discordPlayerCompatibility: true,
                })
                client.editStatus("Playing:", {
                    name: `${playlist[0].title}`,
                    type: 0
                })
                connection.play(stream.stream)
                playlist.shift();
            })
            //if first is 'start', start the playlist
            if (args[0] === "start" || args[0] === "play" || args[0] === "s") {
                // if playlist is not empty
                if (playlist.length) {
                    let stream = await plays.stream(playlist[0].url, {
                        discordPlayerCompatibility: true,
                    })
                    connection.play(stream.stream)
                    client.editStatus("Playing", {
                        name: `${playlist[0].title}`,
                        type: 0
                    })
                    playlist.shift();//remove the first song from existing playlist
                    return;
                } else {
                    client.createMessage(message.channel.id, "Playlist is empty, there is nothing to play");
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
                    client.editStatus("Playing", {
                        name: `${playlist[0].title}`,
                        type: 0
                    })
                    connection.play(stream.stream)
                    playlist.shift(); // remove the first song from existing playlist
                    return;
                } else {
                    // if playlist is empty, stop the actual music, then quit the voice channel
                    client.createMessage(message.channel.id, 'Playlist is empty, stopping music');
                    connection.stopPlaying();
                    client.editStatus("Awaiting", {
                        name: `${playlist[0].title}`,
                        type: 0
                    })
                }
            }
            if (args[0] === "ls" || args[0] === "list" || args[0] === "show") {
                if (playlist.length) {
                    let list = "";
                    for (let i = 0; i < playlist.length; i++) {
                        list += `${i + 1}. ${playlist[i].title} - ${playlist[i].durationRaw}\n`;
                    }
                    client.createMessage(message.channel.id, list);
                } else {
                    client.createMessage(message.channel.id, "Playlist is empty");
                }
                return;
            }
            if (args[0] === "remove" || args[0] === "rm") {
                if (!playlist.length) {
                    client.createMessage(message.channel.id, "Playlist is empty");
                    return;
                }
                if (args[1] === undefined) {
                    client.createMessage(message.channel.id, "Please specify a song to remove");
                    return;
                }
                let index = parseInt(args[1]);
                if (isNaN(index)) {
                    client.createMessage(message.channel.id, "Please specify a valid number");
                    return;
                }
                if (index > playlist.length) {
                    client.createMessage(message.channel.id, "Please specify a valid number");
                    return;
                }
                name = playlist[index - 1].title;
                playlist.splice(index - 1, 1);
                client.createMessage(message.channel.id, "Removed song :" + "```" + name + "```");
                return;
            }
            if (args[0] === "clear" || args[0] === "cl") {
                playlist.splice(0, playlist.length);
                client.createMessage(message.channel.id, "playlist is now empty ");
                return;
            }
            if (args[0] === "search" || args[0] === "cherche" || args[0] === "se" || args[0] === "add" || args[0] === "a") {
                //search and add songs to playlist based on searching term, handling spaces
                args.shift()
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
            if (args[0] === "help" || args[0] === "h") {
                client.createMessage(message.channel.id,
                    "To add a song to the playlist:" +
                    "```\n" +
                    "- !pl add <search term>\n" +
                    "- !pl a <search term>\n" +
                    "```" +
                    "To show the playlist:" +
                    "```\n" +
                    "- !pl show\n" +
                    "- !pl list\n" +
                    "- !pl ls\n" +
                    "```" +
                    "To remove a song from the playlist:" +
                    "```\n" +
                    "- !pl rm <number>\n" +
                    "- !pl remove <number>\n" +
                    "```" +
                    "To start a playlist:" +
                    "```\n" +
                    "- !pl start\n" +
                    "- !pl play \n" +
                    "- !pl s\n" +
                    "```" +
                    "To skip a song:" +
                    "```\n" +
                    "- !pl skip\n" +
                    "- !pl next\n" +
                    "```" +
                    "To see the help command for the playlist (this page):" +
                    "```\n" +
                    "!pl help\n" +
                    "```");
            }
        } catch (err) {
            console.log(err);
            client.disconnect();
        }
    }
};
