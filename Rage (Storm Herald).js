const lastArg = args[args.length - 1];

if (args[0].tag === "OnUse"){
	const actor = lastArg.actor;
	const uuid = lastArg.actorUuid;

	arr = Object.values(actor.system.attributes.movement);
	arr.length = 5;
	speed = Math.max(...arr) / 2;

	ui.notifications.info(`You can move up to ${speed} ft. as part of your rage bonus action (Instinctive Pounce)`);

	hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Rage', uuid);
	if (!hasEffectApplied){
	    game.dfreds.effectInterface.addEffect({ effectName: 'Rage', uuid });
	}

	hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Raging Storm - Fire', uuid);
	if (hasEffectApplied){
		game.dfreds.effectInterface.addEffect({ effectName: 'Shielding Storm - Fire', uuid });
	    actor.items.getName('Herald Firestorm').roll();
	}

	hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Raging Storm - Snow', uuid);
	if (hasEffectApplied){
		game.dfreds.effectInterface.addEffect({ effectName: 'Shielding Storm - Cold', uuid });
	    actor.items.getName('Snowstorm').roll();
	}

	let hasEffectApplied1 = await game.dfreds.effectInterface.hasEffectApplied('Raging Storm - Thunder', uuid);
	let hasEffectApplied2 = await game.dfreds.effectInterface.hasEffectApplied('Raging Storm - Thunder(L)', uuid);
	if (hasEffectApplied1 || hasEffectApplied2){
	    actor.items.getName('Thunderstorm').roll();
	    if(hasEffectApplied1){
	    	game.dfreds.effectInterface.addEffect({ effectName: 'Shielding Storm - Thunder', uuid });
	    }else if(hasEffectApplied2){
	    	game.dfreds.effectInterface.addEffect({ effectName: 'Shielding Storm - Lightning', uuid });
	    }
	}	
}
if (args[0] == "off"){
	const uuid = lastArg.actorUuid;

	hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Shielding Storm - Fire', uuid);
	if (hasEffectApplied){
	    game.dfreds.effectInterface.removeEffect({ effectName: 'Shielding Storm - Fire', uuid });
	}

	hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Shielding Storm - Cold', uuid);
	if (hasEffectApplied){
	    game.dfreds.effectInterface.removeEffect({ effectName: 'Shielding Storm - Cold', uuid });
	}

	hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Shielding Storm - Thunder', uuid);
	if (hasEffectApplied){
	    game.dfreds.effectInterface.removeEffect({ effectName: 'Shielding Storm - Thunder', uuid });
	}

	hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Shielding Storm - Lightning', uuid);
	if (hasEffectApplied){
	    game.dfreds.effectInterface.removeEffect({ effectName: 'Shielding Storm - Lightning', uuid });
	}
}