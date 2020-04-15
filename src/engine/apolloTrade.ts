//#region require

const apolloTradejson = require("../../jsonbase/apolloTrade.json")
const corejs = require("./core.js")

//#endregion

module.exports = {
    process: function(msg)  {
        apolloTradejson.accounts[msg.member.id].coin += apolloTradejson.settings.coinPerMsg
        corejs.saveJSON("./jsonbase/apolloTrade.json",apolloTradejson)
    },
    existsInv: function(id,product) {
        let products = Object.keys(apolloTradejson.accounts[id].inventory)
        return products.indexOf(product) != -1
    }
}
