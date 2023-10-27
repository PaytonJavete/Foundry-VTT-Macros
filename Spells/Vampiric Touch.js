lastArg = args[args.length-1];
const token = canvas.tokens.get(lastArg.tokenId);
const actor = token.actor;

// save damage data
if (lastArg.item.system.components.concentration){
	let formula = "";
	// for checking if potent blood used
	if (lastArg.item.system.preparation.mode == "atwill"){
		formula = lastArg.item.system.damage.parts[0][0];	
	} else {
		formula = `${lastArg.spellLevel}d6[necrotic]`
	}
	DAE.setFlag(actor, "VampiricTouchDamage", formula);
}

if (lastArg.hitTargets.length != 1){
	if (lastArg.item.system.components.concentration) MidiQOL.addConcentration(actor, {item: item, targets: new Set([token]), templateUuid: null});
	return;
}

let damage = lastArg.damageList[0].appliedDamage;
let totalHeal = Math.floor(damage / 2);
await MidiQOL.applyTokenDamage([{ damage: totalHeal, type: "healing" }], totalHeal, new Set([token]), item, new Set());