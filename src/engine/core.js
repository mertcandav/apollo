//#region require

const serverjson = require("../../jsonbase/server.json")
const botjson = require("../../jsonbase/bot.json")
const fs = require("fs")

//#endregion

module.exports = {
    cleanCommand: function(cmd) {
        return cmd.substring(1).toLowerCase().trimRight().trimLeft();
    },
    random: function(number) {
        number++
        return Math.floor(Math.random() * number)
    },
    saveJSON: function(path,model) {
        jsonval = JSON.stringify(model,null,4)
        fs.writeFile(path,jsonval,(err) => { })
    },
    isInviteLink: function(val) {
        return val.indexOf("https://discord.gg") != -1 ||
            val.indexOf("http://discord.gg") != -1 ||
            val.indexOf("discord.gg/") != -1
    },
    getBoolValue: function(val) {
        return val = val == "true" || val == "1" ?
                true :
                    val == "false" || val == "0" ?
                    false : "invalid"
    },
    isadmin: function(id) {
        return serverjson.admins.indexOf(id) != -1
    },
    isbannedword: function(val) {
        return serverjson.values.bannedWords.indexOf(val) != -1
    },
    isfunuri: function(val) {
        return serverjson.values.funUris.indexOf(val) != -1
    },
    isnsfwch: function(val) {
        return serverjson.channels.nsfw.indexOf(val) != -1
    },
    isjoinrole: function(val) {
        return serverjson.values.joinRoles.indexOf(val) != -1
    },
    isproduct: function(val) {
        return apolloTradejson.products.indexOf(val) != -1
    },
    getParams: function(val) {
        let array = val.split(',')
        for(let dex = 0; dex < array.length; dex++) {
            array[dex] = array[dex].trimLeft().trimRight()
        }
        return array
    },
    findIndexJSONKey: function(key,jsonbase) {
        let keys = Object.keys(jsonbase)
        for(let dex = 0; dex < keys.length; dex++) {
            if(key == keys[dex])
                return dex
        }
        return -1
    },
    generateEmbedMsg: function(msg,title,message) {
        return  msg != null ? {
            embed: {
                color: botjson.style.color,
                title: title,
                description: message
            }} :
            {
                embed: {
                    color: botjson.style.color,
                    title: title,
                    description: message
            }}
    },
    generateEmbedErrMsg: function(msg,title,message) {
        return  msg != null ? {
            embed: {
                author: {
                    name: msg.member.displayName,
                    icon_url: msg.member.user.avatarURL
                },
                color: botjson.style.errcolor,
                title: title,
                description: message
            }} :
            {
                embed: {
                    color: botjson.style.errcolor,
                    title: title,
                    description: message
            }}
    },
    generateEmbedSuccMsg: function(msg,title,message) {
        return msg != null ? {
            embed: {
                author: {
                    name: msg.member.displayName,
                    icon_url: msg.member.user.avatarURL
                },
                color: botjson.style.succcolor,
                title: title,
                description: message
            }} :
            {
                embed: {
                    color: botjson.style.succcolor,
                    title: title,
                    description: message
            }}
    },
    generateEmbedWarnMsg: function(msg,title,message) {
        return msg != null ? {
            embed: {
                author: {
                    name: msg.member.displayName,
                    icon_url: msg.member.user.avatarURL
                },
                color: botjson.style.warncolor,
                title: title,
                description: message
            }} :
            {
                embed: {
                    color: botjson.style.warncolor,
                    title: title,
                    description: message
            }}
    }
}
