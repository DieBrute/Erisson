module.exports = {
    name: "weather",
    description: "Returns weather for a given city",
    alias: [],
    run: async (client, message, args) => {
        const weather = require('weather-js');
        weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) {
            if (err) message.channel.createMessage(err);
            if (result === undefined || result.length === 0) {
                message.channel.createMessage('**Please enter a valid location.**');
                return;
            }
            var current = result[0].current;
            var location = result[0].location;

            message.channel.createMessage({
                embed: {
                    color: 0x00AE86,
                    description: `**${current.skytext}**`,
                    fields: [
                        {
                            name: '**Temperature**',
                            value: `**${current.temperature}°C**`,
                            inline: true
                        },
                        {
                            name: '**Feels Like**',
                            value: `**${current.feelslike}°C**`,
                            inline: true
                        },
                        {
                            name: '**Winds**',
                            value: `**${current.winddisplay}**`,
                            inline: true
                        },
                        {
                            name: '**Humidity**',
                            value: `**${current.humidity}%**`,
                            inline: true
                        }
                    ],
                    footer: {
                        text: `Weather for ${current.observationpoint}`
                    }
                }
            })
        })
    }
}