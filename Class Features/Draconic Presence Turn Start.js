const lastArg = args[args.length-1];
const target = canvas.tokens.get(lastArg.tokenId).actor;
const pTokens = canvas.tokens.placeables.filter(t => t.actor.effects.some(e => e.label == "Draconic Presence" && e.flags?.ActiveAuras?.isAura));
if (pTokens.length != 1) return ui.notifcations.error("Draconic Presense Turn Start getting actor returned array greater than 1");
const caster = pTokens[0].actor;

let flag = DAE.getFlag(caster, "Draconic Presence");
if (flag.immune.includes(target.uuid)) return;

let effect = target.effects.find(i => i.label === "Draconic Presence");
if (lastArg.failedSaves.length == 0){
	flag.immune.push(target.uuid);
	DAE.setFlag(caster, "Draconic Presence", flag);
	let changes = duplicate(effect.changes);
	changes[0].value = changes[0].value.replace('applyCondition=true', 'applyCondition=false');
	await effect.update({changes});
}
else {
	let effectData = duplicate(effect);
	effectData.changes = [];
	setProperty(effectData, "flags.ActiveAuras", {});
	if (flag.type == "fear") effectData.changes.push({key: 'macro.CE', value: 'Frightened', mode: 0, priority: 20});
	else if (flag.type == "awe") effectData.changes.push({key: 'macro.CE', value: 'Charmed', mode: 0, priority: 20});
	await target.createEmbeddedDocuments('ActiveEffect', [effectData]);
	effect.delete();
	//need to set new concentration data as well
	let conc = await caster.getFlag("midi-qol", "concentration-data");
	conc.targets.push({actorUuid: lastArg.actorUuid, tokenUuid: lastArg.tokenUuid});
	await caster.setFlag("midi-qol", "concentration-data", conc);
}