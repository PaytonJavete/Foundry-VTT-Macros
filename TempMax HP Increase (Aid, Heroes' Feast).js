lastArg = args[args.length-1];
const token = canvas.tokens.get(lastArg.tokenId);

if (args[0] === "on"){
	const heal = args[1];
	const item = await fromUuid(lastArg.origin);
	await MidiQOL.applyTokenDamage([{ damage: heal, type: "healing" }], heal, new Set([token]), item, new Set());	
} else if (args[0] === "off"){
	const actor = token.actor;
	let value = actor.system.attributes.hp.value;
	let max = actor.system.attributes.hp.max;
	if (value > max){
		actor.update({"system.attributes.hp.value": max});
	}
}