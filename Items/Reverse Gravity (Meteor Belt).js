async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
lastArg = args[args.length-1];
let isCaster = lastArg.origin.includes(lastArg.actorUuid);
const item = await fromUuid(lastArg.efData.origin);
const caster = item.parent;
const [casterToken] = canvas.tokens.objects.children.filter(t => t.document.actorId == caster.id);

if(isCaster){
	let size = canvas.grid.size * ((50*2.1) / canvas.dimensions.distance);
	let token = canvas.tokens.get(lastArg.tokenId);
	if(args[0] === "on"){
		new Sequence()
		    .effect()
		    	.size({width: size, height: size})
		        .file("jb2a.magic_signs.circle.02.transmutation.intro.green")
		        .atLocation(token)
		    .waitUntilFinished(-1000)
		    .effect()
		    	.size({width: size, height: size})
		        .file("jb2a.magic_signs.circle.02.transmutation.loop.green")
		        .attachTo(token)
		        .persist()
		        .origin(lastArg.tokenUuid)
		        .name("Reverse Gravity")
		    .play()
	} else if (args[0] === "off"){		
		new Sequence()
		    .effect()
		    	.size({width: size, height: size})
		        .file("jb2a.magic_signs.circle.02.transmutation.outro.green")
		        .atLocation(token)
		    .play()
		await wait(1000);
		await Sequencer.EffectManager.endEffects({ name: "Reverse Gravity", origin: lastArg.tokenUuid });
	}
} else {
	let token = canvas.tokens.get(lastArg.tokenId);
	const cieling = canvas.scene.foregroundElevation;
	const casterElev = casterToken.document.elevation;
	const tokenElev = token.document.elevation;
	if(args[0] === "on"){	
		//check distance of target to cieling
		let distCieling = cieling - tokenElev;
		if (distCieling < 0) distCieling = 0;
		if (distCieling == 0) return;

		//check if cieling is above height of spell
		if (casterElev+50 < cieling) distCieling = null;

		//make dex save, on failure take damage (is cieling is at or below spell range) and change elevation
		let DC = caster.system.attributes.spelldc;
		let save = await token.actor.rollAbilitySave('dex', {flavor: `Reverse Gravity: Dexterity save vs DC${DC}`});
		if (save.total >= DC) return;

		if (distCieling != null){
			const damageRoll = await new Roll(`${Math.floor(distCieling / 10)}d6[bludgeoning]`);
			await damageRoll.toMessage({flavor: `Reverse Gravity: ${token.name} falls ${distCieling}ft. upward striking the cieling taking damage:`});
			await MidiQOL.applyTokenDamage([{ damage: damageRoll.total, type: "bludgeoning" }], damageRoll.total, new Set([token]), item, new Set());
		} else {
			ChatMessage.create({
				user: game.user._id,
				speaker: ChatMessage.getSpeaker({token: token.actor}),
				content: `Reverse Gravity: ${token.name} falls upward and is now oscillating at the top of the spell area.`
			});
		}
		
		const newElevation = distCieling == null ? casterElev+50 : tokenElev + distCieling;
		token.document.update({"elevation": newElevation});
		await DAE.setFlag(token.actor, "ReverseGravityHeight", tokenElev);
	} else if (args[0] === "off"){
		//simple check to see if target can climb on walls/cielings
		if (token.actor.effects.find(e => e.label.includes("Spider Climb")) && tokenElev == cieling) return;

		//check distance of target to floor
		const previousElevation = DAE.getFlag(token.actor, "ReverseGravityHeight");
		let distFloor = tokenElev - previousElevation;
		if (distFloor < 0) distFloor = 0;
		if (distFloor == 0) return;

		if (distFloor >= 10){
			const damageRoll = await new Roll(`${Math.floor(distFloor / 10)}d6[bludgeoning]`);
			await damageRoll.toMessage({flavor: `Reverse Gravity: ${token.name} falls ${distFloor}ft. down striking the floor taking damage:`});
			await MidiQOL.applyTokenDamage([{ damage: damageRoll.total, type: "bludgeoning" }], damageRoll.total, new Set([token]), item, new Set());
		}
		
		token.document.update({"elevation": previousElevation});
	}
}