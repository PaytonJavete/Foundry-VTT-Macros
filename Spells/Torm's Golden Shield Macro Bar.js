let concentrating = actor.effects.some(effect => effect.sourceName == "Torm's Golden Shield" && effect.label == "Concentrating");
if(!concentrating){
	let [target] = game.user.targets;
	DAE.setFlag(actor, "Torm GS Tracker", target.id);
    dnd5e.documents.macro.rollItem("Torm's Golden Shield");
} else {
	let [target] = game.user.targets;
	let prevTargetID = DAE.getFlag(actor, "Torm GS Tracker");
	let prevTarget = canvas.tokens.get(prevTargetID);
	let effect = prevTarget.actor.effects.find(e => e.name.includes("Torm's Golden Shield"));
	if (effect != undefined) effect.delete();

	let flag = await actor.getFlag("midi-qol", "concentration-data");
	flag.targets.push({actorUuid: target.actor.uuid, tokenUuid: target.uuid});
	await actor.setFlag("midi-qol", "concentration-data", flag);

	DAE.setFlag(actor, "Torm GS Tracker", target.id);

    const item = actor.items.getName("Torm's Golden Shield");
    const workflowItemData = duplicate(item);
    workflowItemData.system.components.concentration = false;
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.uses = {max: null, per: "", value: null};

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemRoll(spellItem, options);  
}