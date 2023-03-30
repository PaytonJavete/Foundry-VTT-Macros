lastArg = args[args.length-1];
const token = canvas.tokens.get(lastArg.tokenId);
const actor = token.actor;

if(args[0] === "on"){
	let magics = {
		weapons: [],
		effects: []
	}

	actor.effects.forEach(async (effect) => {
		if (effect.origin != null){
			origin = await fromUuid(effect.origin);
			if ((origin?.type == "spell" || origin?.system?.properties?.mgc 
				|| (origin?.system?.rarity != "" && origin?.system?.rarity != undefined)) 
				&& origin?.name != "Antimagic Field"){
				
				magics.effects.push(effect.id);
				await effect.update({"disabled": true});		
			}
		}
	});
	
	actor.items.forEach(async (item) => {
		if (item?.system?.properties?.mgc && item?.type == "weapon"){
			magics.weapons.push({id: item.id, attackBonus: item.system.attackBonus, damage: item.system.damage});
			await item.update({"system.attackBonus": ""});
			let damage = item.system.damage;
			if (item.system.baseItem != "") damage = game.items.find(i => i.name.toLowerCase() == item.system.baseItem).system.damage;
			await item.update({"system.damage": damage});
		}
	});

	DAE.setFlag(actor, "AntimagicField", magics);
} else if (args[0] === "off"){
	const magics = DAE.getFlag(actor, "AntimagicField");

	actor.effects.forEach(async (effect) => {
		if (magics.effects.includes(effect.id)) await effect.update({"disabled": false});
	});

	for (item of magics.weapons){
		actorItem = actor.items.get(item.id);
		await actorItem.update({"system.attackBonus": item.attackBonus});
		await actorItem.update({"system.damage": item.damage});
	}
}