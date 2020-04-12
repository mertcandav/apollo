//#region require

const serverjson = require("../../jsonbase/server.json")
const corejs = require("../engine/core.js")

//#endregion

module.exports = {
    process: function(msg) {
        mval = corejs.cleanCommand(msg.content)
        if(mval == "admins") {
            admins(msg)
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
            msg.reply("<@!" + cache + "> is " + (corejs.isadmin(cache) ? "admin!" : "not admin!"))
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
        } else if (mval == "invitationlinkprotection") {
            msg.delete()
            msg.reply("Invitation Link Protection is " + (
                serverjson.settings.invitationLinkProtection ? "Enable" : "Disable"))
            return true
        } else if (mval.startsWith("invitationlinkprotection ")) {
            setInvitationLinkProtection(msg,mval)
            return true
        } else if(mval == "bannedwords") {
            bannedwords(msg)
            return true
        } else if(mval.startsWith("banword ")) {
            banword(msg,mval)
            return true
        } else if(mval.startsWith("unbanword ")) {
            unbanword(msg,mval)
            return true
        } else if(mval.startsWith("isbannedword ")) {
            cache = mval.substring(13)
            msg.reply("``" + cache + "`` is " + (corejs.isbannedword(cache) ? "banned word!" : "not banned word!"))
            return true
        } else if(mval == "bannedwordprotection") {
            msg.delete()
            msg.reply("Banned Word Protection is " + (
                serverjson.settings.bannedWordProtection ? "Enable" : "Disable"))
            return true
        } else if(mval.startsWith("bannedwordprotection ")) {
            setbannedWordProtection(msg,mval)
            return true
        } else if(mval.startsWith("addfunuri ")) {
            addFunUri(msg)
            return true
        } else if(mval.startsWith("delfunuri ")) {
            delFunUri(msg)
            return true
        } else if(mval.startsWith("isfunuri ")) {
            msg.delete();
            cache = msg.content.substring(10)
            msg.reply("``" + cache + "`` is " + (corejs.isfunuri(cache) ? "Fun Uri!" : "not Fun Uri!"))
            return true
        } else if(mval == "funuri") {
            msg.delete()
            msg.reply("Fun Uri is " + (
                serverjson.settings.funUri ? "Enable!" : "Disable!"))
            return true
        } else if(mval.startsWith("funuri ")) {
            setFunUri(msg)
            return true
        } else if(mval == "nsfwch") {
            msg.delete()
            msg.reply("<#" + msg.channel.id + "> is " + (
                corejs.isnsfwch(msg.channel.id) ? "Nsfw channel!" : "not Nsfw channel!"))
            return true
        } else if(mval.startsWith("nsfwch ")) {
            setnsfwch(msg,mval)
            return true
        } else if(mval.startsWith("voting ")) {
            voting(msg)
            return true
        } else if(mval.startsWith("reportch ")) {
            setreportch(msg)
            return true
        }
        
        return false
    }
}

function setInvitationLinkProtection(msg,mval) {
    msg.delete()
    cache = mval.substring(25)
    cache = corejs.getBoolValue(cache)
    if(cache == "invalid") {
        msg.reply("You have entered an invalid value!")
        return
    }
    if(serverjson.settings.invitationLinkProtection === cache) {
        msg.reply("Invitation Link Protection is already " + (
            cache ? "enable!" : "disable"
        ));
        return 
    }
    serverjson.settings.invitationLinkProtection = cache
    corejs.saveJSON("./jsonbase/server.json",serverjson);
    msg.reply("Invitation Link Protection is setted " + (cache ? "enable!" : "disable"))
}

function setbannedWordProtection(msg,mval) {
    msg.delete()
    cache = mval.substring(21)
    cache = corejs.getBoolValue(cache)
    if(cache == "invalid") {
        msg.reply("You have entered an invalid value!")
        return
    }
    if(serverjson.settings.bannedWordProtection === cache) {
        msg.reply("Banned Word Protection is already " + (
            cache ? "enable!" : "disable"
        ));
        return 
    }
    serverjson.settings.bannedWordProtection = cache
    corejs.saveJSON("./jsonbase/server.json",serverjson)
    msg.reply("Banned Word Protection is setted " + (cache ? "enable!" : "disable"))
}

function setjoinch(msg,mval) {
    msg.delete()
    cache = mval.substring(12)
    cache = cache.substring(0,cache.length-1)
    if(serverjson.channels.join === cache) {
        msg.reply("<#" + cache + "> is already set as join cahannel!")
        return 
    }
    serverjson.channels.join = cache
    corejs.saveJSON("./jsonbase/server.json",serverjson)
    msg.reply("<#" + cache + "> setted join channel!")
}

function setleavech(msg,mval) {
    msg.delete()
    cache = mval.substring(13)
    cache = cache.substring(0,cache.length-1)
    if(serverjson.channels.leave === cache) {
        msg.reply("<#" + cache + "> is already set as leave cahannel!")
        return 
    }
    serverjson.channels.leave = cache
    corejs.saveJSON("./jsonbase/server.json",serverjson)
    msg.reply("<#" + cache + "> setted leave channel!")
}

function setjoinmsg(msg,mval) {
    msg.delete()
    cache = mval.substring(11)
    if(serverjson.messages.join === cache) {
        msg.reply("'" + cache + "' is already set as join message!")
        return 
    }
    serverjson.messages.join = cache
    corejs.saveJSON("./jsonbase/server.json",serverjson)
    msg.reply("'" + cache + "' setted join message!")
}

function setleavemsg(msg,mval) {
    msg.delete()
    cache = mval.substring(12)
    if(serverjson.messages.leave === cache) {
        msg.reply("'" + cache + "' is already set as leave message!")
        return 
    }
    serverjson.messages.leave = cache
    corejs.saveJSON("./jsonbase/server.json",serverjson)
    msg.reply("'" + cache + "' setted leave message!")
}

function setadmin(msg,mval) {
    msg.delete()
    cache = mval.substring(12)
    cache = cache.substring(0,cache.length-1)
    if(corejs.isadmin(cache) == true) {
        msg.reply("<@!" + cache + "> already is admin!")
        return
    }
    serverjson.admins.push(cache)
    corejs.saveJSON("./jsonbase/server.json",serverjson)
    msg.reply("<@!" + cache + "> setted admin!")
}

function unadmin(msg,mval) {
    msg.delete()
    cache = mval.substring(11)
    cache = cache.substring(0,cache.length-1)
    if(corejs.isadmin(cache) == false) {
        msg.reply("<@!" + cache + "> already is not admin!")
        return
    }
    delete serverjson.admins.pop(cache)
    corejs.saveJSON("./jsonbase/server.json",serverjson)
    msg.reply("<@!" + cache + "> removed from admins!")
}

function admins(msg) {
    let val = "Admins;\n"
    serverjson.admins.forEach((key) => {
        val += "<@!" + key + ">\n"
    })
    msg.reply(val)
}

function banword(msg,mval) {
    msg.delete()
    cache = mval.substring(8)
    if(corejs.isbannedword(cache) == true) {
        msg.reply("``" + cache + "`` already is banned word!")
        return
    }
    serverjson.values.bannedWords.push(cache)
    corejs.saveJSON("./jsonbase/server.json",serverjson)
    msg.reply("``" + cache + "` added to banned words!")
}

function unbanword(msg,mval) {
    msg.delete()
    cache = mval.substring(10)
    if(corejs.isbannedword(cache) == false) {
        msg.reply("``" + cache + "`` already is not banned word!")
        return
    }
    delete serverjson.values.bannedWords.pop(cache)
    corejs.saveJSON("./jsonbase/server.json",serverjson)
    msg.reply("``" + cache + "`` removed from banned words!")
}

function bannedwords(msg) {
    let val = "Banned Words;\n"
    let dex = 1;
    serverjson.values.bannedWords.forEach((key) => {
        val += "``" + key + "`` "
        if(dex == 3) {
            val += "\n"
            dex = 0
        }
        dex++
    })
    msg.reply(val)
}

function setFunUri(msg) {
    msg.delete()
    cache = msg.content.substring(7).trimLeft().trimRight()
    cache = corejs.getBoolValue(cache)
    if(cache == "invalid") {
        msg.reply("You have entered an invalid value!")
        return
    }
    if(serverjson.settings.funUri === cache) {
        msg.reply("Fun Uri feature is already " + (
            cache ? "enable!" : "disable"
        ));
        return 
    }
    serverjson.settings.funUri = cache
    corejs.saveJSON("./jsonbase/server.json",serverjson)
    msg.reply("Fun Uri feature is setted " + (cache ? "enable!" : "disable"))
}

function addFunUri(msg) {
    msg.delete()
    cache = msg.content.substring(11).trimLeft().trimRight()
    if(corejs.isfunuri(cache) == true) {
        msg.reply("``" + cache + "`` already is Fun Uri!")
        return
    }
    serverjson.values.funUris.push(cache)
    corejs.saveJSON("./jsonbase/server.json",serverjson)
    msg.reply("``" + cache + "`` added to Fun Uri!")
}

function delFunUri(msg) {
    msg.delete()
    cache = msg.content.substring(11).trimLeft().trimRight()
    if(corejs.isfunuri(cache) == false) {
        msg.reply("``" + cache + "`` already is not Fun Uri!")
        return
    }
    delete serverjson.values.funUris.pop(cache)
    corejs.saveJSON("./jsonbase/server.json",serverjson)
    msg.reply("``" + cache + "`` removed from Fun Uris!")
}

function setnsfwch(msg) {
    msg.delete()
    cache = corejs.cleanCommand(msg.content.substring(8))
    cache = corejs.getBoolValue(cache)
    if(cache == "invalid") {
        msg.reply("You have entered an invalid value!")
        return
    } else if(cache == true && corejs.isnsfwch(msg.channel.id) == true) {
        msg.reply("<#" + msg.channel.id + "> already is Nsfw channel!")
        return
    } else if(cache == false && corejs.isnsfwch(msg.channel.id) == false) {
        msg.reply("<#" + msg.channel.id + "> already is not Nsfw channel!")
        return
    }
    if(cache == true)
        serverjson.channels.nsfw.push(msg.channel.id)
    else
        delete serverjson.channels.nsfw.pop(msg.channel.id)
    corejs.saveJSON("./jsonbase/server.json",serverjson)
    msg.reply("<#" + msg.channel.id + "> is setted " + (cache ? "Nsfw channel!" : "not Nsfw channel!"))
}

function voting(msg) {
    msg.delete()
    let content = msg.content.substring(7).trimLeft()
    let args = corejs.getParams(content)
    if(args.length < 1) {
        msg.reply("At least the title of the vote must be specified!")
        return
    } else if(args.length > 11) {
        msg.reply("A maximum of 10 options can be placed!")
        return
    }
    
    if(args.length == 1) {
        msg.channel.send("@everyone\n**" + args[0] + "**\n:green_square: Yes         :red_square: No").then(
            (message) => {
                message.react("🟩"),
                message.react("🟥")
        }).catch(() => {})
        return
    } else if(args.length == 2) {
        msg.reply("At least two options must be specified in the voting or not at all!")
        return
    }

    let dex = 0
    let val = "@everyone\n"
    for(; dex < args.length; dex++) {
        let item = args[dex]
        if(item == "") {
            msg.reply("The argument cannot be empty!")
            return
        }
        val += dex == 0 ?
            "**" + item + "**\n" :
            (dex == 1 ? ":one: " + item + "\n" :
                dex == 2 ? ":two: " + item + "\n" :
                    dex == 3 ? ":three: " +item + "\n" :
                        dex == 4 ? ":four: " + item + "\n" :
                            dex == 5 ? ":five: " + item + "\n" :
                                dex == 6 ? ":six: " + item + "\n" :
                                    dex == 7 ? ":seven: " + item + "\n" :
                                        dex == 8 ? ":eight: " + item + "\n" :
                                            dex == 9 ? ":nine: " + item + "\n" :
                                            ":keycap_ten: " + item + "\n")
    }
    msg.channel.send(val).then(
        (message) => {
            if(args.length == 3) {
                message.react("1️⃣")
                message.react("2️⃣")
            } else if(args.length == 4) {
                message.react("1️⃣")
                message.react("2️⃣")
                message.react("3️⃣")
            } else if(args.length == 5) {
                message.react("1️⃣")
                message.react("2️⃣")
                message.react("3️⃣")
                message.react("4️⃣")
            } else if(args.length == 6) {
                message.react("1️⃣")
                message.react("2️⃣")
                message.react("3️⃣")
                message.react("4️⃣")
                message.react("5️⃣")
            } else if(args.length == 7) {
                message.react("1️⃣")
                message.react("2️⃣")
                message.react("3️⃣")
                message.react("4️⃣")
                message.react("5️⃣")
                message.react("6️⃣")
            } else if(args.length == 8) {
                message.react("1️⃣")
                message.react("2️⃣")
                message.react("3️⃣")
                message.react("4️⃣")
                message.react("5️⃣")
                message.react("6️⃣")
                message.react("7️⃣")
            } else if(args.length == 9) {
                message.react("1️⃣")
                message.react("2️⃣")
                message.react("3️⃣")
                message.react("4️⃣")
                message.react("5️⃣")
                message.react("6️⃣")
                message.react("7️⃣")
                message.react("8️⃣")
            } else if(args.length == 10) {
                message.react("1️⃣")
                message.react("2️⃣")
                message.react("3️⃣")
                message.react("4️⃣")
                message.react("5️⃣")
                message.react("6️⃣")
                message.react("7️⃣")
                message.react("8️⃣")
                message.react("9️⃣")
            } else {
                message.react("1️⃣")
                message.react("2️⃣")
                message.react("3️⃣")
                message.react("4️⃣")
                message.react("5️⃣")
                message.react("6️⃣")
                message.react("7️⃣")
                message.react("8️⃣")
                message.react("9️⃣")
                message.react("🔟")
            }
    }).catch(() => {})
}

function setreportch(msg) {
    msg.delete()
    cache = msg.content.substring(9).trimLeft().trimRight()
    if(cache == "remove") {
        if(serverjson.channels.report == "") {
            msg.reply("Already is not exists report channel!")
            return
        }
        serverjson.channels.report = ""
        corejs.saveJSON("./jsonbase/server.json",serverjson)
        msg.reply("Removed report channel!")
        return                
    }
    cache = cache.substring(2,cache.length-1)
    if(serverjson.channels.report == cache) {
        msg.reply("<#" + cache + "> already is report channel!")
        return
    }
    serverjson.channels.report = cache
    corejs.saveJSON("./jsonbase/server.json",serverjson)
    msg.reply("<#" + cache + "> is setted report channel!")
}
