//#region require

const corejs = require("../engine/core.js");
const botjson = require("../../jsonbase/bot.json")
const serverjson = require("../../jsonbase/server.json")

//#endregion

module.exports = {
    process: function(msg) {
        mval = corejs.cleanCommand(msg.content)
        if (mval == "author" || mval == "developer") {
            msg.reply("Author is " + botjson.info.author + "\nGitHub: " + botjson.info.authorgituri)
            return true
        } else if(mval == "repostory" || mval == "repo" || mval == "gitrepo") {
            msg.reply("GitHub repostory link of apollo;\n" + botjson.info.gituri)
            return true
        } else if(mval == "random") {
            msg.reply(corejs.random(100).toString())
            return true
        } else if(mval.startsWith("random ")) {
            msg.reply(corejs.random(mval.substring(7)).toString())
            return true
        }
        
        return false
    }
}
