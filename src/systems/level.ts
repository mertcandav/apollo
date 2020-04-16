//#region require

const dicordjs = require("discord.js")
const serverjson = require("../../jsonbase/server.json")
const botjson = require("../../jsonbase/bot.json")
const corejs = require("../engine/core.js")
const eng_level = require("../engine/level.ts")
const leveljson = require("../../jsonbase/level.json")

//#endregion

module.exports = {
    process: function(client,msg) {
        if(serverjson.settings.levels == false) {
            return false
        }
        let dex = corejs.findIndexJSONKey(msg.member.id,serverjson.accounts)
        if(dex == -1) {
            return false
        }

        let mval = corejs.cleanCommand(msg.content)
        if(corejs.isadmin(msg.member.id) == true) {
            if(mval.startsWith("levelmultiplier ")) {
                setLevelMultiplier(msg)
                return true
            } else if(mval == "levelmultiplier") {
                msg.delete()
                msg.reply(`Level multiplier: ${leveljson.settings.levelMultiplier}`)
                return true
            } else if(mval.startsWith("exppermsg ")) {
                setexppermsg(msg)
                return true
            } else if(mval == "exppermsg") {
                msg.delete()
                msg.reply(`Experience per message: ${leveljson.settings.expPerMsg}`)
                return true
            } else if(mval.startsWith("maxlevel ")) {
                setmaxlevel(msg)
                return true
            } else if(mval == "maxlevel") {
                msg.delete()
                msg.reply(`Maximum level: ${leveljson.settings.maxLevel}`)
                return true
            } else if(mval.startsWith("leveltop ")) {
                showleveltop(msg)
                return true
            }
        }
        return false
    }
}

function setLevelMultiplier(msg) {
    msg.delete()
    let content = msg.content.substring(16).trimLeft()
    if(isNaN(content)) {
        msg.reply("Please enter only number")
        return
    }
    if(content < 1) {
        msg.reply("It can be set to at least 1!")
        return
    }

    leveljson.settings.levelMultiplier = parseInt(content)
    corejs.saveJSON("./jsonbase/level.json",leveljson)
    msg.reply("Level multiplier updated successfully!")
}

function setexppermsg(msg) {
    msg.delete()
    let content = msg.content.substring(10).trimLeft()
    if(isNaN(content)) {
        msg.reply("Please enter only number")
        return
    }
    if(content < 1) {
        msg.reply("It can be set to at least 1!")
        return
    }

    leveljson.settings.expPerMsg = parseInt(content)
    corejs.saveJSON("./jsonbase/level.json",leveljson)
    msg.reply("Experience per message amount updated successfully!")
}

function setmaxlevel(msg) {
    msg.delete()
    let content = msg.content.substring(9).trimLeft()
    if(isNaN(content)) {
        msg.reply("Please enter only number")
        return
    }
    if(content < 1) {
        msg.reply("It can be set to at least 1!")
        return
    }

    leveljson.settings.maxLevel = parseInt(content)
    corejs.saveJSON("./jsonbase/level.json",leveljson)
    msg.reply("Maximum level updated successfully!")
}

function showleveltop(msg) {
    msg.delete()
    let cache = msg.content.substring(9)
    if(isNaN(cache)) {
        msg.reply("Please enter only number!")
        return
    }
    let keys = Object.keys(serverjson.accounts).sort((x,y) =>
        serverjson.accounts[y].level - serverjson.accounts[x].level)
    let accountPerPage = 5 // Item count of one page
    let pageCount = Math.ceil(keys.length / accountPerPage)
    if(pageCount < cache) {
        msg.reply(`There are no more than ${pageCount} pages on the level top list.`)
        return
    }
    let firstItem = (accountPerPage * cache) -accountPerPage;
    keys = keys.slice(firstItem)
    let obj = { embed: {
		color: botjson.style.color,
		title: `Level Top - Page ${cache}`,
        fields: []
    }}
    for(let counter = 1; counter <= accountPerPage; counter++) {
        if(keys.length >= counter) {
            let account = serverjson.accounts[keys[counter -1]]
            obj.embed.fields.push({
                name: `**${(firstItem) + counter}**`,
                value: `Account: <@!${keys[counter-1]}>\nLevel: ${account.level}`,
            })
        }
    }
    msg.reply(obj)
}
