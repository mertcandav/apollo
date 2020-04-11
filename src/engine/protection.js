//#region require

const serverjson = require("../../jsonbase/server.json")
const corejs = require("./core.js")

//#endregion

module.exports = {
    process: function(msg) {
        if(serverjson.settings.inviteLinkProtection) {
            if(corejs.isInviteLink(msg.content)) {
                msg.delete()
                msg.reply("Ups, you've got invite link protection, please follow the rules!")
                return true
            }
        } else if(serverjson.settings.bannedWordProtection) {
            for(let key of serverjson.values.bannedWords) {
                if(msg.content.includes(key)) {
                    msg.delete()
                    msg.reply("Ups, you've got banned word protection, please follow the rules!")
                    return true
                }
            }
        }

        return false
    }
}
