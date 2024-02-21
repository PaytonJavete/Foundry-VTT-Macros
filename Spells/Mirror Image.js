const lastArg = args[args.length - 1];

if (args[0] == "off" && lastArg["expiry-reason"] == "midi-qol:isAttacked") {
	const effectData = lastArg.efData;
	const actor = canvas.tokens.get(lastArg.tokenId).actor;
	const uuid = actor.uuid;
	let results_html = "<h2>Mirror Image Result</h2>";
	let last = false;
	let getDuration = actor.effects.find(effect => effect.label == "Mirror Images").duration;

	messages = Array.from(game.messages);
	let workflowId = null;
	let messageId = 0;
	for (var i = messages.length - 1; i >= 0; i--) {
		content = messages[i].data.content;
	    if (content.includes(`<div class="midi-qol-attack-roll">`) && content.includes(`${lastArg.tokenId}`)){
	    	workflowId = messages[i].data.flags["midi-qol"].workflowId;
	    	messageId = messages[i].uuid;
	    	break;
	    }
	}

	const workflow = await MidiQOL.Workflow.getWorkflow(workflowId);
	//use a flag to ignore duplicate instances of proccing the mirror image
	if(messageId == DAE.getFlag(actor, "MirrorImage")){
		await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
		actor.effects.find(effect => effect.label.includes("Mirror Image Tracker")).update({duration: getDuration});
		return;
	} else {
		DAE.setFlag(actor, "MirrorImage", messageId);
	}

	//check to see if it has blinsight, tremorsense, or truesight
	//TODO: Check if token can see??
	const token = canvas.tokens.get(workflow.tokenId);
	const seeModes = ["feelTremor", "senseAll", "seeAll"];
	let ignore = false;
	for (mode of token.document.detectionModes){
		if (seeModes.includes(mode.id)){
			results_html += "Attacking creature ignores images";
			ignore = true;
			break;
		}
	}

	if (!ignore){
		imageRoll = await new Roll("1d20").evaluate({async: true});
		await game.dice3d.showForRoll(imageRoll);
		rollTotal = imageRoll.total;
		numImages = args[1];
		console.log(`Rolled a ${rollTotal} with ${numImages} image(s) remaining`);
		if ((numImages == 3 && rollTotal < 6) ||
		(numImages == 2 && rollTotal < 8) ||
		(numImages == 1 && rollTotal < 11)){
			results_html += `Rolled a ${rollTotal} with ${numImages} image(s) remaining, attack targets caster.`;
		} else {
			attack = workflow.attackTotal;
			if (attack >= (10 + actor.system.abilities.dex.mod) && !workflow.isFumble){
				if (numImages == 1){
					results_html += "Last image destroyed.";
					last = true;
				} else {
					results_html += "An image has been destroyed.";
					numImages -= 1;
					effectData.changes[0].value = `${numImages}`;
					effectData.name = `Mirror Image Tracker (${numImages})`;
				}
			} else {
				results_html += "An image was the target, but dodged the attack.";
			}
		}
	}

	ChatMessage.create({
	user: game.user._id,
	speaker: ChatMessage.getSpeaker({token: actor}),
	content: results_html
	});

	if (!last){
		await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
    	actor.effects.find(effect => effect.label.includes("Mirror Image Tracker")).update({duration: getDuration});
	} else {
		effects = actor.effects.filter(effect => effect.label.includes("Mirror Image"));
		const effectArray = effects.map((e) => e.id);
		await actor.deleteEmbeddedDocuments('ActiveEffect', effectArray);
	}
}