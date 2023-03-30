const lastArg = args[args.length-1];

// Check to see if there is a target
if (lastArg.hitTargets.length != 1) return ui.notifications.error("Homing Blades targets one creature");

// Get relevant info
actor = lastArg.actor;
target = lastArg.hitTargets[0];
attackTotal = lastArg.attackTotal;
attackRoll = lastArg.attackRoll;
AC = target.actor.system.attributes.ac.value;

// Check for critical miss
if (lastArg.diceRoll == 1) return;

// Check to see if there is at least one pisonic die to spend
if (actor.system.resources.primary.value <= 0){ 
	ui.notifications.warn("No psionic dice remaining.")
	return; 
}

// Check to see if attack will miss
if (attackTotal < AC){
	console.log(`Misses with attack roll ${attackTotal} against AC ${AC}`);
	let confirmed = false;

    // Create a dialogue box to confrim usage.
    let dialog = new Promise((resolve, reject) => { 
        new Dialog({
        title: "Homing Strike: Usage Configuration",
        content: `Your roll of ${attackTotal} missed your quarry. Use Homing Strike?`,
        buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "Home in on the Target!",
                callback: () => resolve(true)
            },
            two: {
                icon: '<i class="fas fa-times"></i>',
                label: "Cancel",
                callback: () => {resolve(false)}
            }
        },
        default: "Cancel"
      }).render(true);
    });
    confirmed = await dialog;

	if(!confirmed) return;

	console.log("Confirmed usage of homing strike");

	die = actor.system.scale.soulknife['psionic-power'];

	const workflow = MidiQOL.Workflow.getWorkflow(lastArg.uuid);
	workflow.attackRoll = await new Roll(`${attackTotal} + ${die}`).roll();
	workflow.attackTotal = workflow.attackRoll.total;
	workflow.attackRollHTML = await workflow.attackRoll.render();

	if (workflow.attackTotal < AC){
		console.log("Still misses, no psionic die consumed.");
	}
	else{
		const item = actor.items.getName("Psionic Power: Psionic Energy");
		value = actor.system.resources.primary.value - 1;
		await item.update({"system.uses.value": value});
	}

	console.log(workflow);
} 
else {
	console.log(`Hits with attack roll ${attackTotal} against AC ${AC}`);
	return;
}