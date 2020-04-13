//#region require

const serverjson = require("../../jsonbase/server.json")
const botjson = require("../../jsonbase/bot.json")

//#endregion

module.exports = {
    process: function(msg) {
        if(serverjson.settings.apolloTrade == false) {
            return false
        }
        return false
    }
}
