const lastArg = args[args.length - 1];
const actor = canvas.tokens.get(lastArg.tokenId).actor;

if (args[0].tag === "OnUse"){
	await DAE.setFlag(actor, "ArmorOfAgathys", lastArg.damageTotal);
}

if (args[0] === "off" && lastArg["expiry-reason"] === "midi-qol:isHit"){
	if (actor.system.attributes.hp.temp == 0 || actor.system.attributes.hp.temp == null) return;

	messages = Array.from(game.messages);
	let workflowId = null;
	for (var i = messages.length - 1; i >= 0; i--) {
		content = messages[i].data.content;
	    if (content.includes(`<div class="midi-qol-attack-roll">`) && content.includes(`${lastArg.tokenId}`)){
	    	workflowId = messages[i].data.flags["midi-qol"].workflowId;
	    	break;
	    }
	}
	let workflow = MidiQOL.Workflow.getWorkflow(workflowId);

	//if hit by melee attack
	if(["mwak", "msak"].includes(workflow.item.system.actionType)){
		const damage = await DAE.getFlag(actor, "ArmorOfAgathys");
		const item = await fromUuid(lastArg.origin);
		const workflowItemData = duplicate(item);
		workflowItemData.system.target = { value: 1, units: "", type: "creature" };
		workflowItemData.system.damage.parts[0] = [`${damage}[cold]`, "cold"];
		workflowItemData.system.duration = { value: null, units: "inst" };
		workflowItemData.system.preparation.mode = "atwill";
    	workflowItemData.system.uses = {max: null, per: "", value: null};

		setProperty(workflowItemData, "flags.itemacro", {});
		setProperty(workflowItemData, "flags.midi-qol", {});
		setProperty(workflowItemData, "flags.dae", {});
		setProperty(workflowItemData, "effects", []);
		delete workflowItemData._id;
		workflowItemData.name = `${workflowItemData.name}: Retaliation Damage`;

		game.user.updateTokenTargets([workflow.tokenId]);
		const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor })
		const options = { showFullCard: true, createWorkflow: true, versatile: false, configureDialog: false };
		await MidiQOL.completeItemRoll(spellItem, options);
	}

	//look to see if out of tempHP
	for (target of workflow.damageList){
		if (target.actorId == lastArg.actorId && target.newTempHP == 0) return;
	}

	const effectData = lastArg.efData;
	await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
}