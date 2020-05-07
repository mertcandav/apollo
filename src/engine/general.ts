//#region require

const corejs = require("./core.js")
const apolloTradejson = require("../../jsonbase/apolloTrade.json")
const serverjson = require("../../jsonbase/server.json")
const specialjson = require("../../jsonbase/special.json")
const botjson = require("../../jsonbase/bot.json")

//#endregion

module.exports = {
    process: function(client, msg) {
        let account = serverjson.accounts[msg.member.id]
        account.messages += 1
        corejs.saveJSON("./jsonbase/server.json",serverjson)
    }
}
