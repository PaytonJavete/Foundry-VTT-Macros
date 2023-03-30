lastArg = args[args.length-1];

let validTargets = lastArg.targets.filter(target => target.actor.system.details.type.value != "undead" &&  target.actor.system.details.type.value != "construct");
validIds = validTargets.map((t) => t.id);
game.user.updateTokenTargets(validIds);

lastArg.targetUuids.forEach(async (uuid) => {
	token = await fromUuid(uuid);
	creatureType = token.actor.system.details.type;
	if (creatureType.value == "plant" || (creatureType.value == "elemental" && creatureType.subtype?.includes("Water"))){
		await game.dfreds.effectInterface.addEffect({ effectName: 'Horrid Wilting Disadvantage', uuid });	
	}	
});