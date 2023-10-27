const lastArg = args[args.length - 1];

let duration = 3600 * lastArg.damageTotal;

lastArg.targetUuids.forEach(async (uuid) => {
	let tokenM = await fromUuid(uuid);
	let effectM = tokenM.actor.effects.find(e => e.name == "Psychic Whispers").update({duration: {seconds: duration}})
});