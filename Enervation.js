lastArg = args[args.length-1];

if (lastArg.tag == "OnUse"){
	if (game.user.targets.size != 1) return ui.notifications.error("Enervation can only have one target.");

	const token = canvas.tokens.get(lastArg.tokenId);
	const actor = token.actor;
	const item = await fromUuid(lastArg.uuid);

	let damage = lastArg.damageList[0].appliedDamage;
	let totalHeal = Math.floor(damage / 2);
	await MidiQOL.applyTokenDamage([{ damage: totalHeal, type: "healing" }], totalHeal, new Set([token]), item, new Set());

	// save damage data, play effect, end conc if saved
	if (item.system.components.concentration != false){
		//Remove concentration if they succeeded on save
		let effect = actor.effects.find(effect => effect.label.includes("Concentrating"));
	    if (effect == undefined){
	        return;
	    } else if (lastArg.failedSaves.length != 1){
	    	effect.delete();
	    	return;
	    }

	    const target = game.user.targets.first();
		new Sequence()
		    .effect()
		        .file("jb2a.energy_beam.normal.dark_purplered.03")
		        .attachTo(token)
		        .stretchTo(target, { attachTo: true })
		        .persist()
		        .origin(lastArg.itemUuid)
		    .play()

		let formula = "";
		// for checking if potent blood used
		if (lastArg.item.system.preparation.mode == "atwill"){
			formula = lastArg.item.system.damage.parts[0][0];
		} else {
			dice = lastArg.spellLevel - 1;
			formula = `${dice}d8[necrotic]`;
		}
		DAE.setFlag(actor, "EnervationDamage", formula);
	}
} else if (args[0] == "off"){
	Sequencer.EffectManager.endEffects({origin: lastArg.origin})
}