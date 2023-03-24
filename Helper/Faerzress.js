const lastArg = args[args.length - 1];

if (args[0] == "off" && lastArg["expiry-reason"]?.includes("1Spell")) {
	const effectData = lastArg.efData;
	let actor = canvas.tokens.get(lastArg.tokenId).actor;
	
	roll = await new Roll("1d20").evaluate({async: true});
	if (roll.total == 1){
		tableRoll = await game.tables.find(table => table.name == "Wild Magic Surge").roll();
		content = "<h3>Faerzress Magic Surge</h3>";
  		content += tableRoll.results[0].text;
		ChatMessage.create({
			user: game.user._id,
			speaker: ChatMessage.getSpeaker({token: actor}),
			content: content
			})	
	}

	await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
}