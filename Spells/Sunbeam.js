lastArg = args[args.length-1];

lastArg.targetUuids.forEach(async (uuid) => {
	token = await fromUuid(uuid);
	creatureType = token.actor.system.details.type.value;
	if (creatureType == "undead" || creatureType == "ooze"){
		await game.dfreds.effectInterface.addEffect({ effectName: 'Sunbeam Disadv', uuid })	
	}	
});