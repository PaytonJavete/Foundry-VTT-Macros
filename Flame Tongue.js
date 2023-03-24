let weapon = "Longsword"
if (game.user.targets.size == 0){
	let toggle = false;
	let dialog = new Promise((resolve, reject) => { 
	    new Dialog({
	    title: "Toggle Flame Tongue",
	    content: `<p>Would you like to toggle your Flame Tongue ${weapon} as a bonus action?</p>`,
	    buttons: {
	        one: {
	            icon: '<i class="fas fa-check"></i>',
	            label: "Toggle",
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
	toggle = await dialog;

	if (toggle) {
		const actor = canvas.tokens.controlled[0].actor;
	    const item = actor.items.getName(`Flame Tongue ${weapon}`);
	    const uuid = actor.uuid;
	    let objUpdate = new Object();
	    damageArr = item.system.damage.parts;
	    if (damageArr.length == 1){
	    	damageArr.push(["2d6[fire]", "fire"]);	
	    } else if (damageArr.length == 2){
	    	damageArr.pop();
	    } else {
	    	return ui.notifications.error("Unexpected damage array length in Flame Tongue macro");
	    }
	    objUpdate["data.damage.parts"] = damageArr;
	    await item.update(objUpdate);

	    game.dfreds.effectInterface.toggleEffect('Flame Tongue Light');
	}
} else {
	game.dnd5e.macros.rollItem(`Flame Tongue ${weapon}`);	
}