//#region require

const corejs = require("../engine/core.js");
const botjson = require("../../jsonbase/bot.json")
const serverjson = require("../../jsonbase/server.json")

//#endregion

module.exports = {
    process: function(client,msg) {
        mval = corejs.cleanCommand(msg.content)
        if(mval == "about") {
            msg.delete()
            msg.reply({ embed: {
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL
                },
                color: botjson.style.color,
                title: `About Apollo`,
                fields: [
                    { name: "**Version**", value: botjson.info.version },
                    { name: "**Developer**", value: botjson.info.author },
                    { name: "**Developer GitHub**", value: botjson.info.authorgituri },
                    { name: "**Apollo Source**", value: botjson.info.gituri },
                ],
                footer: {
                    icon_url: client.user.avatarURL,
                    text: `© ${new Date().getFullYear()} ${botjson.info.author}` 
                }
            }})
            return true
        } else if(mval == "ping") {
            msg.delete()
            msg.reply("Rock!")
            return true
        } else if(mval == "help") {
            msg.delete()
            msg.reply({ embed: {
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL
                },
                color: botjson.style.color,
                title: `Help Apollo`,
                fields: [
                    { name: "**Admins**", value: "https://github.com/mertcandav/apollo/wiki/Admin" },
                    { name: "**Everyone**", value: "https://github.com/mertcandav/apollo/wiki/Everyone" }
                ],
                footer: {
                    icon_url: client.user.avatarURL,
                    text: `© ${new Date().getFullYear()} ${botjson.info.author}` 
                }
            }})
            return true
        } else if(mval == "random") {
            random(msg,mval)
            return true
        } else if(mval.startsWith("random ")) {
            random(msg,mval)
            return true
        } else if(mval.startsWith("getfunuri")) {
            getfunuri(msg)
            return true
        } else if(mval == "reportch") {
            msg.delete()
            msg.reply(
                serverjson.channels.report != "" ?
                "Report channel is <#" + serverjson.channels.report + ">" :
                "Ups! No report channels are set!")
            return true
        } else if(mval.startsWith("report ")) {
            report(msg)
            return true
        } else if(mval == "apollotradech") {
            msg.delete()
            msg.reply(corejs.generateEmbedMsg(msg,"Apollo Trade Channel","Apollo Trade channel is " + (
                serverjson.channels.trade != "" ? "<#" + serverjson.channels.trade + ">" : "not setted!")))
            return true
        }
        
        return false
    }
}

function random(msg,mval) {
    msg.delete()
    if(mval == "random") {
        msg.reply(corejs.random(100))
        return
    }

    let number = mval.substring(7)
    if(isNaN(number)) {
        msg.reply("Please enter only number!")
        return true
    }
    if(number < 0) {
        msg.reply("The maximum number can be at least 0!")
        return true
    }
    msg.reply(corejs.random(number))
}

function getfunuri(msg) {
    if(serverjson.settings.funUri) {
        msg.delete()
        if(serverjson.values.funUris.length > 0) {
            msg.reply(Object.values(serverjson.values.funUris)
            [
                corejs.random(serverjson.values.funUris.length-1)
            ])
        } else {
            msg.reply("Sorry, but no Fun Uri. Apply to admins to add one now!")
        }
    }
}

function report(msg) {
    if(serverjson.channels.report != "") {
        msg.delete()
        msg.guild.channels.get(
            serverjson.channels.report
        ).send({
            embed: {
                color: botjson.style.color,
                title: `Report`,
                fields: [
                    { name: "**Reportted By**", value: `<@!${msg.member.id}>` },
                    { name: "**Message**", value: "" + msg.content.substring(8) }
                ],
                timestamp: new Date(),
                footer: {
                    text: msg.member.displayName
                }
        }})
    }

    msg.reply(
        serverjson.channels.report != "" ?
        "Your report has been received, thanks!" :
        "Ups! No report channels are set!"
    )
}
