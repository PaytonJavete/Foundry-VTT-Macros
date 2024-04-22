let concentrating = actor.effects.some(effect => effect.sourceName == "Fizban's Platinum Shield" && effect.label == "Concentrating");
if(!concentrating){
	let [target] = game.user.targets;
	DAE.setFlag(actor, "Fizban PS Tracker", target.id);
    dnd5e.documents.macro.rollItem("Fizban's Platinum Shield");
} else {
	let [target] = game.user.targets;
	let prevTargetID = DAE.getFlag(actor, "Fizban PS Tracker");
	let prevTarget = canvas.tokens.get(prevTargetID);
	let effect = prevTarget.actor.effects.find(e => e.name.includes("Fizban's Platinum Shield"));
	if (effect != undefined) effect.delete();

	let flag = await actor.getFlag("midi-qol", "concentration-data");
	flag.targets.push({actorUuid: target.actor.uuid, tokenUuid: target.uuid});
	await actor.setFlag("midi-qol", "concentration-data", flag);

	DAE.setFlag(actor, "Fizban PS Tracker", target.id);

    const item = actor.items.getName("Fizban's Platinum Shield");
    const workflowItemData = duplicate(item);
    workflowItemData.system.components.concentration = false;
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.uses = {max: null, per: "", value: null};

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemRoll(spellItem, options);  
}