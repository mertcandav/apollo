//#region require

const serverjson = require("../../jsonbase/server.json")
const corejs = require("../engine/core.js")
const fs = require("fs")

//#endregion

module.exports = {
    process: function(msg) {
        mval = corejs.cleanCommand(msg.content)
        if(mval == "admins") {
            admins(msg.channel)
            return true
        } else if(mval.startsWith("setadmin ")) {
            setadmin(msg,mval)
            return true
        } else if(mval.startsWith("unadmin ")) {
            unadmin(msg,mval)
            return true
        } else if(mval.startsWith("isadmin ")) {
            cache = mval.substring(11)
            cache = cache.substring(0,cache.length-1)
            msg.channel.send("<@!" + cache + "> is " + (isadmin(cache) ? "admin!" : "not admin!"))
            return true
        } else if (mval.startsWith("write ")) {
            msg.delete()
            cache = mval.substring(6)
            msg.channel.send(cache)
            return true
        } else if (mval.startsWith("setjoinch ")) {
            setjoinch(msg,mval)
            return true
        } else if (mval.startsWith("setleavech ")) {
            setleavech(msg,mval)
            return true
        } else if (mval.startsWith("setjoinmsg ")) {
            setjoinmsg(msg,mval)
            return true
        } else if (mval.startsWith("setleavemsg ")) {
            setleavemsg(msg,mval)
            return true
        } else if (mval == "invitelinkprotection") {
            msg.delete()
            msg.reply("Invite Link Protection is " + (
                serverjson.settings.inviteLinkProtection ? "Enable" : "Disable"))
            return true
        } else if (mval.startsWith("invitelinkprotection ")) {
            setInviteLinkProtection(msg,mval)
            return true
        }
        
        return false
    }
}

function setInviteLinkProtection(msg,mval) {
    msg.delete()
    cache = mval.substring(21)
    cache = corejs.getBoolValue(cache)
    if(cache == "invalid") {
        msg.reply("You have entered an invalid value!")
        return
    }
    if(serverjson.settings.inviteLinkProtection === cache) {
        msg.reply("Invite Link Protection is already " + (
            cache ? "enable!" : "disable"
        ));
        return 
    }
    serverjson.settings.inviteLinkProtection = cache
    corejs.saveJSON("./jsonbase/server.json",serverjson);
    msg.reply("Invite Link Protection is setted " + (cache ? "enable!" : "disable"))
}

function isadmin(id) {
    return serverjson.admins.indexOf(id) != -1
}

function setjoinch(msg,mval) {
    msg.delete()
    cache = mval.substring(12)
    cache = cache.substring(0,cache.length-1)
    if(serverjson.channels.join === cache) {
        msg.reply("<#" + cache + "> is already set as join cahannel!");
        return 
    }
    serverjson.channels.join = cache
    corejs.saveJSON("./jsonbase/server.json",serverjson);
    msg.reply("<#" + cache + "> setted join channel!")
}

function setleavech(msg,mval) {
    msg.delete()
    cache = mval.substring(13)
    cache = cache.substring(0,cache.length-1)
    if(serverjson.channels.leave === cache) {
        msg.reply("<#" + cache + "> is already set as leave cahannel!");
        return 
    }
    serverjson.channels.leave = cache
    corejs.saveJSON("./jsonbase/server.json",serverjson);
    msg.reply("<#" + cache + "> setted leave channel!")
}

function setjoinmsg(msg,mval) {
    msg.delete()
    cache = mval.substring(11)
    if(serverjson.messages.join === cache) {
        msg.reply("'" + cache + "' is already set as join message!");
        return 
    }
    serverjson.messages.join = cache
    corejs.saveJSON("./jsonbase/server.json",serverjson);
    msg.reply("'" + cache + "' setted join message!")
}

function setleavemsg(msg,mval) {
    msg.delete()
    cache = mval.substring(12)
    if(serverjson.messages.leave === cache) {
        msg.reply("'" + cache + "' is already set as leave message!");
        return 
    }
    serverjson.messages.leave = cache
    corejs.saveJSON("./jsonbase/server.json",serverjson);
    msg.reply("'" + cache + "' setted leave message!")
}

function setadmin(msg,mval) {
    msg.delete()
    cache = mval.substring(12)
    cache = cache.substring(0,cache.length-1)
    if(isadmin(cache) == true) {
        msg.reply("<@!" + cache + "> already is admin!")
        return
    }
    serverjson.admins.push(cache)
    corejs.saveJSON("./jsonbase/server.json",serverjson);
    msg.reply("<@!" + cache + "> setted admin!")
}

function unadmin(msg,mval) {
    msg.delete()
    cache = mval.substring(11)
    cache = cache.substring(0,cache.length-1)
    if(isadmin(cache) == false) {
        msg.channel.send("<@!" + cache + "> already is not admin!")
        return
    }
    delete serverjson.admins.pop(cache)
    corejs.saveJSON("./jsonbase/server.json",serverjson);
    msg.channel.send("<@!" + cache + "> removed from admins!")
}

function admins(channel) {
    let val = ""
    all = serverjson.admins.forEach((key) => {
        val += "<@!" + key + ">\n"
    })
    channel.send(val)
}
