async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const lastArg = args[args.length - 1];
const actorM = canvas.tokens.get(lastArg.tokenId).actor;
const rageOn = await game.dfreds.effectInterface.hasEffectApplied('Rage', actorM.uuid);
let effectData = lastArg.efData;

if (args[0] == "off" && lastArg["expiry-reason"] == 'midi-qol:rest') {	
	DAE.setFlag(actorM, "RelentlessRage", 10);
	await actorM.createEmbeddedDocuments('ActiveEffect', [effectData]);
}

if (args[0] == "off" && lastArg["expiry-reason"] == 'midi-qol:zeroHP' && rageOn) {
	await wait(1000); // needed cause sometimes updates too fast

	const itemM = await actorM.items.getName("Relentless Rage");
	const workflowItemData = duplicate(itemM);
	const DC = DAE.getFlag(actorM, "RelentlessRage");
	workflowItemData.system.save.dc = DC;

	setProperty(workflowItemData, "flags.itemacro", {});
    setProperty(workflowItemData, "flags.midi-qol", {});
    setProperty(workflowItemData, "flags.dae", {});
    setProperty(workflowItemData, "effects", []);

	const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actorM });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: false };
    const result = await MidiQOL.completeItemRoll(spellItem, options);

	if (result.failedSaves.size == 0){
		await actorM.update({"system.attributes.hp.value": 1});
		newDC = DC + 5;
		DAE.setFlag(actorM, "RelentlessRage", newDC);
		let prone = actorM.effects.find(e => e.label == "Prone");
		if (prone) prone.delete();
	}
	await actorM.createEmbeddedDocuments('ActiveEffect', [effectData]);
}

if (args[0] == "off" && lastArg["expiry-reason"] == 'midi-qol:zeroHP' && !rageOn) {
	await actorM.createEmbeddedDocuments('ActiveEffect', [effectData]);
}