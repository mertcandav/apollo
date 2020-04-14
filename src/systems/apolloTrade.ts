//#region require

const dicordjs = require("discord.js")
const botjson = require("../../jsonbase/bot.json")
const serverjson = require("../../jsonbase/server.json")
const corejs = require("../engine/core.js")
const apolloTradejson = require("../../jsonbase/apolloTrade.json")

//#endregion

module.exports = {
    process: function(client,msg) {
        if(serverjson.channels.trade == "") {
            return false
        }
        let dex = corejs.findIndexJSONKey(msg.member.id,apolloTradejson.accounts)
        if(dex == -1) {
            return false
        }
        let account = apolloTradejson.accounts[msg.member.id]
        let mval = corejs.cleanCommand(msg.content)
        if(mval == "balance") {
            msg.delete()
            msg.reply(corejs.generateEmbedMsg(msg,"Apollo Coins",account.coin))
            return true
        } else if(mval.startsWith("shop ")) {
            showshop(client,msg)
            return true
        } else if(mval.startsWith("inv ")) {
            showinv(client,msg)
            return true
        }
        return false
    }
}

function showshop(client,msg) {
    msg.delete()
    let cache = msg.content.substring(5)
    if(isNaN(cache)) {
        msg.reply("Please enter only number!")
        return
    }
    let keys = Object.keys(apolloTradejson.shop)
    if(keys.length == 0) {
        msg.reply("There are no products in the shop!")
        return
    }
    let itemPerPage = 6 // Item count of one page
    let pageCount = Math.ceil(keys.length / itemPerPage)
    if(pageCount < cache) {
        msg.reply(`There are no more than ${pageCount} pages on the shop.`)
        return
    }
    let firstItem = (itemPerPage * cache) -itemPerPage;
    keys = keys.slice(firstItem)
    let obj = { embed: {
        author: {
            name: client.user.username,
            icon_url: client.user.avatarURL
        },
		color: botjson.style.color,
		title: `Shop - Page ${cache}`,
        fields: []
    }}
    for(let counter = 1; counter <= itemPerPage; counter++) {
        if(keys.length >= counter) {
            obj.embed.fields.push({
                name: `**${keys[counter-1]}**`,
                value: `Price: ${apolloTradejson.shop[keys[counter-1]].amount}\nStock: ${apolloTradejson.shop[keys[counter-1]].stock}`,
                inline: true
            })
        }
    }
    msg.reply(obj)
    /*let val = `Shop; Page: ${cache}\`\`\`typescript`
    for(let counter = 1; counter <= itemPerPage; counter++) {
        val += keys.length >= counter ? `\n${keys[counter-1]}; Price:${apolloTradejson.shop[keys[counter-1]].amount} ; Stock:${
            apolloTradejson.shop[keys[counter-1]].stock}` : ""
    }
    val += "```"
    msg.reply(val)*/
}

function showinv(client,msg) {
    msg.delete()
    let cache = msg.content.substring(4)
    if(isNaN(cache)) {
        msg.reply("Please enter only number!")
        return
    }
    let account = apolloTradejson.accounts[msg.member.id]
    let keys = Object.keys(account.inventory)
    if(keys.length == 0) {
        msg.reply("There are no item in the your inventory!")
        return
    }
    let itemPerPage = 6 // Item count of one page
    let pageCount = Math.ceil(keys.length / itemPerPage)
    if(pageCount < cache) {
        msg.reply(`There are no more than ${pageCount} pages on the your inventory.`)
        return
    }
    let firstItem = (itemPerPage * cache) -itemPerPage;
    keys = keys.slice(firstItem)
    let obj = { embed: {
        author: {
            name: msg.member.displayName,
            icon_url: msg.member.user.avatarURL
        },
		color: botjson.style.color,
		title: `Inventory - Page ${cache}`,
        fields: []
    }}
    for(let counter = 1; counter <= itemPerPage; counter++) {
        if(keys.length >= counter) {
            obj.embed.fields.push({
                name: `**${keys[counter-1]}**`,
                value: `Item: ${[keys[counter-1]]}\nCount: ${account.inventory[keys[counter-1]].count}`,
                inline: true
            })
        }
    }
    msg.reply(obj)
    /*let val = `Shop; Page: ${cache}\`\`\`typescript`
    for(let counter = 1; counter <= itemPerPage; counter++) {
        val += keys.length >= counter ? `\n${keys[counter-1]}; Price:${apolloTradejson.shop[keys[counter-1]].amount} ; Stock:${
            apolloTradejson.shop[keys[counter-1]].stock}` : ""
    }
    val += "```"
    msg.reply(val)*/
}
