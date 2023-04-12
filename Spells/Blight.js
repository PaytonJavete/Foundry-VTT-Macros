lastArg = args[args.length-1];
console.log(lastArg);

lastArg.targetUuids.forEach(async (uuid) => {
	token = await fromUuid(uuid);
	creatureType = token.actor.system.details.type.value;
	if (creatureType == "plant"){
		await game.dfreds.effectInterface.addEffect({ effectName: 'Blight Plant Disadvantage', uuid });
		uuid = lastArg.actorUuid;
		await game.dfreds.effectInterface.addEffect({ effectName: 'Blight Max Damage', uuid });
	}	
});