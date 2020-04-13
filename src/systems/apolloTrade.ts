//#region require

const dicordjs = require("discord.js")
const serverjson = require("../../jsonbase/server.json")
const corejs = require("../engine/core.js")
const apolloTradejson = require("../../jsonbase/apolloTrade.json")

//#endregion

module.exports = {
    process: function(msg) {
        if(serverjson.channels.trade == "") {
            return false
        }
        let dex = corejs.findIndexJSONKey(msg.member.id,apolloTradejson.accounts)
        if(dex == -1) {
            return false
        }
        let account = apolloTradejson.accounts[msg.member.id]
        let mval = corejs.cleanCommand(msg.content)
        if(mval == "balance") {
            msg.delete()
            msg.reply("Your Apollo Coins: " + account.coin)
            return true
        }
        return false
    }
}
