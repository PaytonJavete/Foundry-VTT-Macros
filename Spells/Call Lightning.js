const lastArg = args[args.length-1];
const token = canvas.tokens.get(lastArg.tokenId);
const actor = token.actor;
const item = await fromUuid(lastArg.uuid);

// save damage data
if (item.system.components.concentration != false){
	const isStorm = await DAE.getFlag(actor, "CallLightning");
	let die = lastArg.spellLevel;
	if (isStorm) die += 1;
	await DAE.setFlag(actor, "CallLightning", die);
}