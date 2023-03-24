const lastArg = args[args.length - 1];

if (args[0] == "on"){
	game.user.updateTokenTargets([lastArg.tokenId]);
	const item = await fromUuid(lastArg.efData.origin);
	await item.roll();
}

if (args[0].tag === "OnUse") {
	let damage = lastArg.damageList[0].appliedDamage;
	const actor = canvas.tokens.get(lastArg.tokenId).actor;
	await actor.applyDamage(damage);
}