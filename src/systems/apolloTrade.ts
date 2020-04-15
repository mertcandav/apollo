//#region require

const dicordjs = require("discord.js")
const botjson = require("../../jsonbase/bot.json")
const serverjson = require("../../jsonbase/server.json")
const corejs = require("../engine/core.js")
const eng_apolloTrade = require("../engine/apolloTrade.ts")
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

        let mval = corejs.cleanCommand(msg.content)
        if(corejs.isadmin(msg.member.id) == true) {
            if(mval.startsWith("product ")) {
                addproduct(msg)
                return true
            } else if(mval.startsWith("rmproduct ")) {
                removeproduct(msg)
                return true
            } else if(mval.startsWith("coinpermsg ")) {
                setcoinpermsg(msg)
                return true
            } else if(mval == "coinpermsg") {
                msg.delete()
                msg.reply(`Apollo Coin per message: ${apolloTradejson.settings.coinPerMsg}`)
                return true
            }
        }

        let account = apolloTradejson.accounts[msg.member.id]
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
        } else if(mval.startsWith("cointop ")) {
            showcointop(msg)
            return true
        } else if(mval.startsWith("buy ")) {
            buyproduct(msg)
            return true
        } else if(mval.startsWith("bet ")) {
            bet(msg)
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
    let keys = Object.keys(apolloTradejson.products)
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
		color: botjson.style.color,
		title: `Shop - Page ${cache}`,
        fields: []
    }}
    for(let counter = 1; counter <= itemPerPage; counter++) {
        if(keys.length >= counter) {
            obj.embed.fields.push({
                name: `**${keys[counter-1]}**`,
                value: `Price: ${apolloTradejson.products[keys[counter-1]].price}\nStock: ${apolloTradejson.products[keys[counter-1]].stock}`,
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

function addproduct(msg) {
    msg.delete()
    let content = msg.content.substring(8).trimLeft()
    let args = corejs.getParams(content)
    if(args.length < 2) {
        msg.reply("Price and stock must be specified!")
        return
    } else if(args.length < 3) {
        msg.reply("Stock must be specified!")
        return
    } else if(args.length > 3) {
        msg.reply("The number of arguments can be up to three!")
        return
    }

    if(isNaN(args[1])) {
        msg.reply("The price should consist of numbers only!")
        return
    } else if(isNaN(args[2])) {
        msg.reply("The stock should consist of numbers only!")
        return
    }

    if(corejs.isproduct(args[0])) {
        msg.reply("A product with this name is already in stock!")
        return
    }

    apolloTradejson.products[args[0]] = {
        price: parseInt(args[1]),
        stock: parseInt(args[2])
    }
    corejs.saveJSON("./jsonbase/apolloTrade.json",apolloTradejson)
    msg.reply("Successfully added product to shop")
}

function removeproduct(msg) {
    msg.delete()
    let content = msg.content.substring(10).trimLeft()
    if(corejs.isproduct(content) == false) {
        msg.reply("A product with this name is already not exists in stocks!")
        return
    }

    delete apolloTradejson.products[content]
    corejs.saveJSON("./jsonbase/apolloTrade.json",apolloTradejson)
    msg.reply("Successfully removed product from shop")
}

function setcoinpermsg(msg) {
    msg.delete()
    let content = msg.content.substring(11).trimLeft()
    if(isNaN(content)) {
        msg.reply("Please enter only number")
        return
    }

    apolloTradejson.settings.coinPerMsg = parseInt(content)
    corejs.saveJSON("./jsonbase/apolloTrade.json",apolloTradejson)
    msg.reply("Apollo Coin per message amount updated successfully!")
}

function showcointop(msg) {
    msg.delete()
    let cache = msg.content.substring(8)
    if(isNaN(cache)) {
        msg.reply("Please enter only number!")
        return
    }
    let keys = Object.keys(apolloTradejson.accounts).sort((x,y) =>
        apolloTradejson.accounts[y].coin - apolloTradejson.accounts[x].coin)
    let accountPerPage = 5 // Item count of one page
    let pageCount = Math.ceil(keys.length / accountPerPage)
    if(pageCount < cache) {
        msg.reply(`There are no more than ${pageCount} pages on the coin top list.`)
        return
    }
    let firstItem = (accountPerPage * cache) -accountPerPage;
    keys = keys.slice(firstItem)
    let obj = { embed: {
		color: botjson.style.color,
		title: `Coin Top - Page ${cache}`,
        fields: []
    }}
    for(let counter = 1; counter <= accountPerPage; counter++) {
        if(keys.length >= counter) {
            let account = apolloTradejson.accounts[keys[counter -1]]
            obj.embed.fields.push({
                name: `**${(firstItem) + counter}**`,
                value: `Account: <@!${keys[counter-1]}>\nCoin: ${account.coin}`,
            })
        }
    }
    msg.reply(obj)
}

function buyproduct(msg) {
    msg.delete()
    let cache = msg.content.substring(4).trimLeft()
    let args = corejs.getParams(cache)
    let count = 1
    if(args.length > 2) {
        msg.reply("There can be a maximum of 3 parameters!")
        return
    } else if(args.length == 2) {
        if(isNaN(args[1])) {
            msg.reply("The count should consist of numbers only!")
            return
        }
        count = parseInt(args[1])
    }
    if(corejs.isproduct(args[0]) == false) {
        msg.reply("A product with this name is not exists in stocks!")
        return
    }
    let product = apolloTradejson.products[args[0]]
    let account = apolloTradejson.accounts[msg.member.id]
    if(product.price * count > account.coin) {
        msg.reply("You don't have enough Apollo Coins to buy this product!")
        return
    }
    if(product.stock < count) {
        msg.reply("The product you want to buy does not have as much stock as you want!")
        return
    }

    if(eng_apolloTrade.existsInv(msg.member.id,args[0])) {
        account.inventory[args[0]].count += count
    } else {
        account.inventory[args[0]] = {
            count: count
        }
    }
    account.coin -= product.price

    if(product.stock == count) {
        delete apolloTradejson.products[args[0]]
    } else {
        product.stock -= count
    }

    corejs.saveJSON("./jsonbase/apolloTrade.json",apolloTradejson)

    msg.reply("You have successfully purchased the product!")
}

function bet(msg) {
    msg.delete()
    let cache = msg.content.substring(4).trimLeft()
    if(isNaN(cache)) {
        msg.reply("Please enter only number!")
        return
    }
    let amount = parseInt(cache)
    if(amount < 1) {
        msg.reply("You have to deposit at least 1 Apollo Coin!")
        return
    }
    let account = apolloTradejson.accounts[msg.member.id]
    if(account.coin < amount) {
        msg.reply("You don't have that much Apollo Coin!")
        return
    }
    let chance = corejs.random(100)
    if(chance >= 50) {
        account.coin += amount
        msg.reply("You win the bet!")
    } else {
        account.coin -= amount
        msg.reply("You lost the bet!")
    }
    corejs.saveJSON("./jsonbase/apolloTrade.json",apolloTradejson)
}
