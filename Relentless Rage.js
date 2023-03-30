async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const lastArg = args[args.length - 1];
let actor = canvas.tokens.get(lastArg.tokenId).actor;
let DC = args[1];
hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Rage', actor.uuid);
effectData = lastArg.efData;
console.log(args);

if (args[0] == "off" && lastArg["expiry-reason"] == 'midi-qol:rest') {	
	effectData.changes[0].value = 10;
	await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);	
}

if (args[0] == "off" && lastArg["expiry-reason"] == 'midi-qol:zeroHP' && hasEffectApplied) {
	await wait(1000); // needed cause sometiems updates too fast
	save_roll = await actor.rollAbilitySave('con', {chatMessage : true, async: true });
	if (save_roll.total >= DC){
		await actor.update({"system.attributes.hp.value": 1});
		effectData.changes[0].value = DC+5;
	}
	await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);	
}

if (args[0] == "off" && lastArg["expiry-reason"] == 'midi-qol:zeroHP' && !hasEffectApplied) {
	await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
}