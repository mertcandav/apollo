//#region require

const dicordjs = require("discord.js")
const serverjson = require("../../jsonbase/server.json")
const corejs = require("../engine/core.js")
const apolloTradejson = require("../../jsonbase/apolloTrade.json")

//#endregion

module.exports = {
    process: function(msg) {
        if(serverjson.settings.apolloTrade == false) {
            return false
        }
        let dex = corejs.findIndexJSONKey(msg.id,apolloTradejson.members)
        if(dex == -1) {
            return false
        }
        let member = apolloTradejson.members[msg.member.id]
        let mval = corejs.cleanCommand(msg.content)
        if(mval == "balance") {
            msg.delete()
            msg.reply("Your balance: " + member.coin)
            return true
        }
        return false
    }
}
