//#region require

const apolloTradejson = require("../../jsonbase/apolloTrade.json")
const corejs = require("./core.js")

//#endregion

module.exports = {
    process: function(msg)  {
        apolloTradejson.accounts[msg.member.id].coin += apolloTradejson.settings.coinPerMsg
        corejs.saveJSON("./jsonbase/apolloTrade.json",apolloTradejson)
    }
}
