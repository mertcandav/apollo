// MIT License
// 
// Copyright (c) 2020 Mertcan Davulcu
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

//#region reuqire

const discordjs = require("discord.js")
const adminjs = require("./commands/admin.js")
const protectionjs = require("./engine/protection.js")
const corejs = require("./engine/core.js")
const eng_apolloTrade = require("./engine/apolloTrade.ts")
const eng_level = require("./engine/level.ts")
const eng_general = require("./engine/general.ts")
const sys_apolloTrade = require("./systems/apolloTrade.ts")
const sys_level = require("./systems/level.ts")
const everyonejs = require("./commands/everyone.js")
const apolloTradejson = require("../jsonbase/apolloTrade.json")
const serverjson = require("../jsonbase/server.json")
const specialjson = require("../jsonbase/special.json")
const botjson = require("../jsonbase/bot.json")

//#endregion

//#region Fields

const client = new discordjs.Client()
const prefix = botjson.prefix

//#endregion

//#region Starting

client.login(specialjson.token)

client.on('ready', (msg) => {
  client.user.setActivity(botjson.activity.status, { type: botjson.activity.type })
  console.log(`HEEEYY! ${client.user.tag} is woooorking!`)
})

//#endregion

//#region Join - Leave

client.on("guildMemberAdd", msg => {
	serverjson.accounts[msg.id] = {
			experience: 0,
			messages: 0,
			level: 0,
			coin: 0,
			inventory: {}
	}
	corejs.saveJSON("./jsonbase/server.json",serverjson)

	let roles = Object.values(serverjson.values.joinRoles)
	for(let dex = 0; dex < roles.length; dex++) {
		msg.addRole(msg.guild.roles.get(roles[dex])).catch(
			() => {
				/* Catch */
		})
	}

	if(serverjson.channels.join != "") {
  		msg.guild.channels.get(serverjson.channels.join).send("<@" + msg.user.id + ">" + serverjson.messages.join)
	  	return
	}
})

client.on("guildMemberRemove", msg => {
	if(corejs.findIndexJSONKey(msg.id,serverjson.accounts) != -1) {
		delete serverjson.accounts[msg.id]
		corejs.saveJSON("./jsonbase/serverjson.json",serverjson)
	}
	if(serverjson.channels.join != "") {
  		msg.guild.channels.get(serverjson.channels.leave).send("<@" + msg.user.id + ">" + serverjson.messages.leave)
	  	return
	}
})

//#endregion

client.on("message", msg => {
	if(protectionjs.process(msg))
		return

	if(!msg.content.startsWith(prefix)) {
		if(msg.member.id != client.user.id) {
			eng_apolloTrade.process(msg)
			eng_level.process(msg)
			eng_general.process(client,msg)
		}
		return
	}

	if(serverjson.admins.indexOf(msg.member.id) != -1 && adminjs.process(client,msg)) {
		return
	} else if(everyonejs.process(client,msg)) {
		return
	} else if(sys_apolloTrade.process(client,msg)) {
		return
	} else if(sys_level.process(client,msg)) {
		return
	} else {
		msg.reply("Hmm, this command is not defined!")
	}
})
