lastArg = args[args.length-1];
const token = canvas.tokens.get(lastArg.targets[0].id);
const item = await fromUuid(lastArg.uuid);
if (lastArg.macroPass === "postAttackRoll" && lastArg.isFumble){
	const dice = 4 + (lastArg.spellLevel - 2);
	let roll = await new Roll(`${dice}d4`).roll();
	const damage = Math.floor(roll.total / 2);
	await MidiQOL.applyTokenDamage([{ damage: damage, type: "acid" }], damage, new Set([token]), item, new Set());

} else if (lastArg.macroPass === "postDamageRoll" && lastArg.hitTargets.length == 0){
	const damage = Math.floor(lastArg.damageTotal / 2);
	await MidiQOL.applyTokenDamage([{ damage: damage, type: "acid" }], damage, new Set([token]), item, new Set());
}