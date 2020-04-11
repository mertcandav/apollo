//#region require

const corejs = require("../engine/core.js");
const serverjson = require("../../jsonbase/server.json")

//#endregion

module.exports = {
    process: function(msg) {
        mval = corejs.cleanCommand(msg.content)
        if(mval == "random") {
            msg.reply(corejs.random(100).toString())
            return true
        } else if(mval.startsWith("random ")) {
            msg.reply(corejs.random(mval.substring(7)).toString())
            return true
        }
        
        return false
    }
}
