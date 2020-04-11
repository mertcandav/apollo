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
const everyonejs = require("./commands/everyone.js")
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

client.on('ready', () => {
  client.user.setActivity(prefix + "help", { type: 'WATCHING' })
  console.log(`HEEEYY! ${client.user.tag} is woooorking!`)
})

//#endregion

//#region Join - Leave

client.on('guildMemberAdd', msg =>
{
  msg.guild.channels.get(serverjson.channels.join).send("<@" + msg.user.id + ">" + serverjson.messages.join)
  return
})

client.on('guildMemberRemove', msg =>
{
  msg.guild.channels.get(serverjson.channels.leave).send("<@" + msg.user.id + ">" + serverjson.messages.leave)
  return
})

//#endregion

client.on("message", msg => {
	if(protectionjs.process(msg))
		return

	if(!msg.content.startsWith(";"))
		return

	if(serverjson.admins.indexOf(msg.member.id) != -1 && adminjs.process(msg)) {
		return
	} else if(everyonejs.process(msg)) {
		return
	} else {
		msg.reply("Hmm, this command is not defined!")
	}
})
