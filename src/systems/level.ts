//#region require

const dicordjs = require("discord.js")
const serverjson = require("../../jsonbase/server.json")
const corejs = require("../engine/core.js")
//const eng_level = require("../engine/level.ts")
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
    msg.reply("Level multiplier amount updated successfully!")
}
