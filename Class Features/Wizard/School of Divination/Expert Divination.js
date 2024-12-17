let expertDivination = Hooks.on("midi-qol.RollComplete", async (workflow) => {
	if (!workflow.actor.items.getName("Expert Divination")) return;
	console.log("called");
});

const lastArg = args[args.length - 1];

if (args[0] == "off" && lastArg["expiry-reason"].includes('1Spell')) {
	const effectData = lastArg.efData;
	const actor = canvas.tokens.get(lastArg.tokenId).actor;

	let workflowId = null;
	let messageId = 0;
	for (let message of Array.from(game.messages).reverse()) {
		content = message.content;
	    if (content.includes("data-spell-level") && content.includes(`${lastArg.tokenId}`)){
	    	workflowId = message.flags["midi-qol"].workflowId;
	    	messageId = message.uuid;
	    	break;
	    }
	}

	const workflow = await MidiQOL.Workflow.getWorkflow(workflowId);

	//use a flag to ignore duplicate instances of proccing the mirror image
	if(messageId == DAE.getFlag(actor, "ExpertDivination")){
		await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
		return;
	} else {
		DAE.setFlag(actor, "ExpertDivination", messageId);
	}

	if (workflow.item.system.level >= 2 && workflow.item.system.school == "div"){
		let objUpdate = new Object();
		let value = 0;
		let spellLevel = 0;
		let level = workflow.item.system.level-1;
		for (i = 5 > level ? level : 5; i >= 1; i--){
		    chosenSpellSlots = getSpellSlots(actor, i);
		    value = chosenSpellSlots.value + 1;
		    if (value <= chosenSpellSlots.max){
		    	spellLevel = i;
		    	break;
		   	}
		    if (i == 2) value = 0;
		}

		if (value == 0 || spellLevel == 0){
			await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
			return;
		}
		objUpdate['system.spells.spell' + spellLevel + '.value'] = value;
		actor.update(objUpdate);
		await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
		return;

	} else {
		await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
		return;
	}
}

function getSpellSlots(actor, level) {
    return actor.system.spells[`spell${level}`];
}