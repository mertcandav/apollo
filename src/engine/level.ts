//#region require

const serverjson = require("../../jsonbase/server.json")
const leveljson = require("../../jsonbase/level.json")
const corejs = require("./core.js")

//#endregion

module.exports = {
    process: function(msg)  {
        if(serverjson.settings.levels == false)
            return
        if(Object.keys(serverjson.accounts).indexOf(msg.member.id) == -1)
            return

        let account = serverjson.accounts[msg.member.id]
        if(account.level == leveljson.settings.maxLevel && serverjson.channels.trade != "") {
            account.coin += leveljson.settings.expPerMsg
        } else {
            account.experience += leveljson.settings.expPerMsg
            if((account.level + 1) * leveljson.settings.levelMultiplier <= account.experience) {
                account.level += 1
                account.experience = 0
            }
        }
        corejs.saveJSON("./jsonbase/server.json",serverjson)
    }
}