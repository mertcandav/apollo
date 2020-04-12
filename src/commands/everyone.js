//#region require

const corejs = require("../engine/core.js");
const botjson = require("../../jsonbase/bot.json")
const serverjson = require("../../jsonbase/server.json")

//#endregion

module.exports = {
    process: function(msg) {
        mval = corejs.cleanCommand(msg.content)
        if (mval == "author" || mval == "developer") {
            msg.delete()
            msg.reply("Author is " + botjson.info.author + "\nGitHub: " + botjson.info.authorgituri)
            return true
        } else if(mval == "repostory" || mval == "repo" || mval == "gitrepo") {
            msg.delete()
            msg.reply("GitHub repostory link of apollo;\n" + botjson.info.gituri)
            return true
        } else if(mval == "ping") {
            msg.delete()
            msg.reply("Rock!")
            return true
        }else if(mval == "random") {
            msg.delete()
            msg.reply(corejs.random(100))
            return true
        } else if(mval.startsWith("random ")) {
            msg.delete()
            msg.reply(corejs.random(mval.substring(7)))
            return true
        } else if(mval.startsWith("getfunuri")) {
            if(serverjson.settings.funUri) {
                msg.delete()
                if(serverjson.values.funUris.length > 0) {
                    msg.reply(Object.values(serverjson.values.funUris)
                    [
                        corejs.random(serverjson.values.funUris.length-1)
                    ])
                } else {
                    msg.reply("Sorry, but no Fun Uri. Apply to admins to add one now!")
                }
            }
            return true
        } else if(mval == "reportch") {
            msg.delete()
            msg.reply(
                serverjson.channels.report != "" ?
                    "Report channel is <#" + serverjson.channels.report + ">" :
                    "Ups! No report channels are set!"
                    )
            return true
        } else if(mval.startsWith("report ")) {
            if(serverjson.channels.report != "") {
                msg.delete()
                msg.guild.channels.get(
                    serverjson.channels.report
                ).send("Reportted by <@!" + msg.member.id + ">\n----------\n" + msg.content.substring(8))
            }

            msg.reply(
                serverjson.channels.report != "" ?
                "Your report has been received, thanks!" :
                "Ups! No report channels are set!"
            )

            return true
        }
        
        return false
    }
}
