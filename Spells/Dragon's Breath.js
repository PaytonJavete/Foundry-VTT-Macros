const lastArg = args[args.length-1];
const target = canvas.tokens.get(lastArg.tokenId).actor;

if(args[0] == "on"){
	//create item
	const item = await fromUuid(lastArg.origin);
	const spellDC = item.parent.system.attributes.spelldc;
	const actionItem = duplicate(item);
	const damageDice = args[1]+1;
	const damageType = args[2];
    actionItem.system.components.concentration = false;
    actionItem.system.level = args[1];
    actionItem.system.preparation.mode = "atwill";
    actionItem.system.uses = {max: null, per: "", value: null};
    actionItem.system.duration = { value: null, units: "inst" };
    actionItem.system.activation.type = "action";
    actionItem.system.actionType = "save";
    actionItem.system.save = {ability: 'dex', dc: spellDC, scaling: 'flat'}
    actionItem.system.range.units = "self";
    actionItem.system.target = {value: 15, width: null, units: 'ft', type: 'cone'};
    actionItem.system.damage.parts[0] = [`${damageDice}d6[${damageType}]`, damageType];

    setProperty(actionItem, "flags.itemacro", {});
	setProperty(actionItem, "effects", []);
	actionItem.name = `Dragon Breath (${damageType})`;

	let image = ""
	switch(damageType){
		case "acid":
			image = "icons/magic/acid/projectile-smoke-glowing.webp";
			break;
		case "cold":
			image = "icons/magic/water/projectile-icecicle.webp";
			break;
		case "fire":
			image = "icons/magic/fire/beam-jet-stream-trails-orange.webp";
			break;
		case "lightning":
			image = "icons/magic/lightning/bolt-beam-strike-blue.webp";
			break;
		case "poison":
			image = "icons/magic/air/fog-gas-smoke-dense-green.webp";
			break;
	}
	actionItem.img = image;

    const newItem = await target.createEmbeddedDocuments("Item", [actionItem]);

    DAE.setFlag(target, "Dragon's Breath", newItem[0].id);
}
else if (args[0] == "off"){
	//delete item
	const itemId = DAE.getFlag(target, "Dragon's Breath");
	target.items.get(itemId).delete();
}