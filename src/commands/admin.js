//#region require

const serverjson = require("../../jsonbase/server.json")
const fs = require("fs")

//#endregion

module.exports = {
    process: function(msg) {
        mval = msg.content.substring(1).toLowerCase()
        if(mval == "admins") {
            admins(msg.channel)
        } else if(mval.startsWith("setadmin ")) {
            setadmin(mval)
        } else if(mval.startsWith("removeadmin ")) {
            removeadmin(mval)
        } else if(mval.startsWith("isadmin ")) {
            cache = mval.substring(11)
            cache = cache.substring(0,cache.length-1)
            msg.channel.send("<@!" + cache + "> is " + (isadmin(cache) ? "admin!" : "not admin!"));
        }
    }
}

function isadmin(id) {
    return serverjson.admins.indexOf(id) != -1
}

function setadmin(mval) {
    cache = mval.substring(12)
    cache = cache.substring(0,cache.length-1)
    if(isadmin(cache) == true)
        return
    serverjson.admins.push(cache)
    jsonval = JSON.stringify(serverjson)
    fs.writeFile("./jsonbase/server.json",jsonval,(err) => { })
}

function removeadmin(mval) {
    cache = mval.substring(12)
    cache = cache.substring(0,cache.length-1)
    if(isadmin(cache) == true)
        return;
    delete serverjson.admins.pop(cache)
    jsonval = JSON.stringify(serverjson)
    fs.writeFile("./jsonbase/server.json",jsonval,(err) => { })
}

function admins(channel) {
    let val = ""
    all = serverjson.admins.forEach((key) => {
        val += "<@!" + key + ">\n"
    })
    channel.send(val)
}
