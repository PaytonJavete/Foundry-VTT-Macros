const lastArg = args[args.length-1];

const targetId = lastArg.targetUuids[0];
const token = await fromUuid(targetId);
const creatureType = token.actor.system.details.type.value;
const casterId = lastArg.actorUuid;
if (creatureType == "plant"){
	await game.dfreds.effectInterface.addEffect({ effectName: 'Blight Plant Disadvantage', uuid: targetId });	
	await game.dfreds.effectInterface.addEffect({ effectName: 'Blight Max Damage', uuid: casterId });
}

return;