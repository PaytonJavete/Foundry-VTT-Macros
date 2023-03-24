let tactor;
let itemName = args[0].itemData.name;
if (args[0].tokenUuid) tactor = (await fromUuid(args[0].tokenUuid)).actor;
else tactor = game.actors.get(args[0].actorId);

let effect =  tactor.effects.find(i => i.label === itemName && i.duration.duration === 86400);
if(effect){
	let duration = duplicate(effect.duration);
	duration.duration = (24*3600) + ((args[0].spellLevel-2)*48*3600);
	duration.remaining = (24*3600) + ((args[0].spellLevel-2)*48*3600);
	duration.seconds = (24*3600) + ((args[0].spellLevel-2)*48*3600);
	await effect.update({duration});
}