const secrets = require('./secrets');
const Discord = require('discord.js');
const client = new Discord.Client();
const airteaspoon = require('./airtable');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const botID = secrets.mentions.prod;
const clock = {
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 7 * 24 * 60 * 60 * 1000
};

client.on('message', message => {
    if (message.content == botID) {
        airteaspoon.getAllRemainingTasks().then((res) => {
            message.channel.send("```md\n/* TO DO */" + res + "```");
        }).catch((err) => {
            message.channel.send(err);
        })
    } else if (message.content.startsWith(botID)) {
        let params = message.content.split(" ");
        if (params[1] == "chapter") {
            // @manager-san chapter hori
            let chapterNumber = params.pop();
            let seriesName = params.slice(2, params.length).join(" ");
            airteaspoon.getChapterInfo(seriesName, chapterNumber).then((res) => {
                message.channel.send("```md\n" + res + "```");
            }).catch((err) => {
                message.channel.send(err)
            })
        } else if (params[1] == "deadline") {
            // @managersan deadline @user message {amount} {type}
            let span = params.pop(); // span type ["days"]            
            if (span != "hour" && span != "day" && span != "week" && span != "minute") {
                message.channel.send("```Errör: Invalid parameter: 'type'. It must be one of [minute, hour, day, week]```")
                return;
            }
            let time = params.pop();
            // TODO: make sure time is a Number
            let msg = params.slice(3, params.length).join(" ");
            let user = params[2];
            if(time * clock[span] >= 2147483647) {
                message.channel.send("```Errör: Deadlines can't be longer than 24 days because of stupid js things```")
                return;
            }
            setTimeout(() => {
                // message.author.username
                message.channel.send(user + " you have a reminder.\n```" + msg + " ```")
            }, parseInt(time) * clock[span]);
        } else if (params[1] == "help") {
            let helpMessage = "```"+
            "\nManager-san" +
            "\n  chapter   : Shows credits for specified chapter." +
            "\n              @Manager-san chapter hori 95" +
            "\n  deadline  : Pings user with message after specified time." +
            "\n            : @Manager-san deadline @user message 3 days" +
            "```"
            message.channel.send(helpMessage);
        }
    }
});

client.login(secrets.discord);