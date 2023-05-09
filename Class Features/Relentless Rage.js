async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const lastArg = args[args.length - 1];
const actor = canvas.tokens.get(lastArg.tokenId).actor;
const DC = DAE.getFlag(actor, "RelentlessRage");
const hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Rage', actor.uuid);
let effectData = lastArg.efData;
console.log(args);

if (args[0] == "off" && lastArg["expiry-reason"] == 'midi-qol:rest') {	
	DAE.setFlag(actor, "RelentlessRage", 10);
	await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
}

if (args[0] == "off" && lastArg["expiry-reason"] == 'midi-qol:zeroHP' && hasEffectApplied) {
	await wait(1000); // needed cause sometiems updates too fast

	const item = await actor.items.getName("Relentless Rage");
	const workflowItemData = duplicate(item);
	workflowItemData.system.save.dc = DC;

	setProperty(workflowItemData, "flags.itemacro", {});
    setProperty(workflowItemData, "flags.midi-qol", {});
    setProperty(workflowItemData, "flags.dae", {});
    setProperty(workflowItemData, "effects", []);

	const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: false };
    const result = await MidiQOL.completeItemRoll(spellItem, options);

	if (result.failedSaves.size == 0){
		await actor.update({"system.attributes.hp.value": 1});
		newDC = DC + 5;
		DAE.setFlag(actor, "RelentlessRage", newDC);
		let prone = actor.effects.find(e => e.label == "Prone");
		prone.delete();
	}
	await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
}

if (args[0] == "off" && lastArg["expiry-reason"] == 'midi-qol:zeroHP' && !hasEffectApplied) {
	await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
}