//#region require

const corejs = require("../engine/core.js");
const botjson = require("../../jsonbase/bot.json")
const serverjson = require("../../jsonbase/server.json")
const leveljson = require("../../jsonbase/level.json")

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
        } else if(mval == "profile") {
            msg.delete()
            let account = serverjson.accounts[msg.member.id]
            let obj = { embed: {
                author: {
                    name: msg.member.displayName,
                    icon_url: msg.member.user.avatarURL
                },
                color: botjson.style.succcolor,
                title: `Profile`,
                fields: [
                    { name: "**Level**", value: `${account.level}/${leveljson.settings.maxLevel}` },
                    { name: "**Expericence**", value: account.level == leveljson.settings.maxLevel ?
                        `Maximum` :
                        `${account.experience}/${(account.level+1)*leveljson.settings.levelMultiplier}`
                    },
                    { name: "**Economy**", value:
`Apollo Coins: ${account.coin}
Total items: ${Object.keys(account.inventory).length}` },
                ],
                timestamp: new Date()
            }}
            msg.reply(obj)
            return true
        } else if(mval == "server") {
            msg.delete()
            let account = serverjson.accounts[msg.member.id]
            let obj = { embed: {
                author: {
                    name: msg.guild.name,
                    icon_url: `https://cdn.discordapp.com/icons/${msg.guild.id}/${msg.guild.icon}.png`
                },
                color: botjson.style.warncolor,
                title: `Server State`,
                fields: [
                    { name: "**Members**", value:
`**Total**: ${msg.guild.members.size}
**Bot**: ${msg.guild.members.filter(x => x.user.bot).size}
**Online**: ${msg.guild.members.filter(x => x.presence.status != "offline").size}
**Offline**: ${msg.guild.members.filter(x => x.presence.status == "offline").size}` },
                    { name: "**System**", value:
`**Apolo Trade**: ${serverjson.channels.trade != "" ? "Enable" : "Disable"}
**Apolo Report**: ${serverjson.channels.report != "" ? "Enable" : "Disable"}
**Apolo FunUri**: ${serverjson.settings.funUri ? "Enable" : "Disable"}
**Level Sysem**: ${serverjson.settings.levels ? "Enable" : "Disable"}` },
                    { name: "**Protection**", value:
`**Bannedword Protection**: ${serverjson.settings.bannedWordProtection ? "Enable" : "Disable"}
**Invitation Link Protection**: ${serverjson.settings.invitationLinkProtection ? "Enable" : "Disable"}`}
                ],
                timestamp: new Date()
            }}
            msg.reply(obj)
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
