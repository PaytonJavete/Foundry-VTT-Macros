async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const lastArg = args[args.length - 1];

if (args[0] == "off" && lastArg["expiry-reason"] == 'midi-qol:zeroHP') {
	await wait(1000); // needed cause sometiems updates too fast

	let actor = canvas.tokens.get(lastArg.tokenId).actor;
	const effectData = lastArg.efData;

	messages = Array.from(game.messages);
	let workflowId = null;
	for (var i = messages.length - 1; i >= 0; i--) {
		content = messages[i].data.content;
	    if (messages[i].data?.flags["midi-qol"]?.workflowId && content.includes(`${lastArg.tokenId}`)){
	    	workflowId = messages[i].data.flags["midi-qol"].workflowId;
	    	break;
	    }
	}
	let workflow = MidiQOL.Workflow.getWorkflow(workflowId);
	console.log(workflow);

	//check if damage is radiant, or crit (or fire for frost giant zombie)
	damageTypes = ["radiant"];
	if (actor.name == "Frost Giant Zombie"){
		damageTypes.push("fire")
	}
	let procs = true;
	for (damageObj of workflow.damageDetail){
		if (damageTypes.includes(damageObj.type)) procs = false;
		if (workflow.isCritical) procs = false;
	}
	
	if(procs){
		let DC = 5 + workflow.damageList[0].appliedDamage;
		save_roll = await actor.rollAbilitySave('con', {chatMessage : true, async: true });
		if (save_roll.total >= DC){
			await actor.update({"system.attributes.hp.value": 1});
		}
	} 
	await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);	
}