async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
lastArg = args[args.length-1];

if (args[0].macroPass === "preambleComplete"){
	let undeadTargets = lastArg.targets.filter(target => target.actor.system.details.type.value == "undead" &&  !target.actor.effects.find(effect => effect.label.includes("Turn Immunity")));
	for (target of undeadTargets){
		actor = target.actor;
		if (actor.effects.find(effect => effect.label.includes("Turn Resistance") || effect.label.includes("Marshal Undead"))){
			uuid = actor.uuid;
			await game.dfreds.effectInterface.addEffect({ effectName: 'TR Helper', uuid });
		}
	}
	undeadIds = undeadTargets.map((u) => u.id);
	game.user.updateTokenTargets(undeadIds);
	let casterToken = await fromUuid(lastArg.tokenUuid);
	sequencerTurnUndead(casterToken);
} else if (args[0].macroPass === "postSave") {
	await wait(2000);
	const actor = lastArg.actor;

	destroyLevel = actor.system.scale.cleric["destroy-undead"].value;
	if (actor.classes.cleric.system.levels < 8) destroyLevel = 0.5;
	else destroyLevel = parseInt(destroyLevel.match(/\d+/)[0]);

	if (destroyLevel == undefined){
		return console.log("Cleric does not Destroy Undead... yet");
	}
	let destroyedUndead = [];
	for (target of lastArg.failedSaves){
		if (target.actor.system.details.cr <= destroyLevel){
			destroyedUndead.push(target);
			sequncerDestroyUndead(target);
		}
	}
	if (destroyedUndead.length > 0){
		let roll = await new Roll("100d8[radiant]").roll();
		await game.dice3d.showForRoll(roll);
		actorToken = canvas.tokens.placeables.find((t) => t.actor?.uuid === actor.uuid);

		await new MidiQOL.DamageOnlyWorkflow(
			actor,
			actorToken,
			roll.total,
			"radiant",
			destroyedUndead,
			roll,
			{
			  flavor: "Destroy Undead",
			  itemCardId: lastArg.itemCardId,
			}
		);
	}
}

function sequncerDestroyUndead(target){
	new Sequence()
	  .effect()
	    .file("jb2a.explosion.07.greenorange")
	    .size({width: 200, height: 200})
	    .atLocation(target)
	  .play();
}

function sequencerTurnUndead(caster){
	new Sequence()
	  .effect()
	    .file("jb2a.divine_smite.caster.orange")
	    .size({width: 200, height: 200})
	    .atLocation(caster)
	  .waitUntilFinished(-1000)
	  .effect()
	    .file("jb2a.template_circle.out_pulse.02.burst.greenorange")
	    .size({
          width: canvas.grid.size * ((30*2.5) / canvas.dimensions.distance),
          height: canvas.grid.size * ((30*2.5) / canvas.dimensions.distance),
        })
	    .atLocation(caster)
	  .play();
}