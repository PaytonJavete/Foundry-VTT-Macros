const lastArg = args[args.length - 1];

if (args[0].tag === "OnUse"){
	const actor = lastArg.actor;
	const uuid = lastArg.actorUuid;

	arr = Object.values(actor.system.attributes.movement);
	arr.length = 5;
	speed = Math.max(...arr) / 2;

	ui.notifications.info(`You can move up to ${speed} ft. as part of your rage bonus action (Instinctive Pounce)`);

	let type = DAE.getFlag(actor, "Storm");

	await game.dfreds.effectInterface.addEffect({ effectName: `Shielding Storm - ${type}`, uuid });

	if(type == 'Fire') actor.items.getName('Herald Firestorm').roll();
	else if (type == 'Snow') actor.items.getName('Snowstorm').roll();
	else actor.items.getName('Thunderstorm').roll();
}
else if (args[0] == "off"){
	const uuid = lastArg.actorUuid;
	const actor = await fromUuid(uuid);
	let type = DAE.getFlag(actor, "Storm");

	await game.dfreds.effectInterface.removeEffect({ effectName: `Shielding Storm - ${type}`, uuid });
}