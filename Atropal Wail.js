lastArg = args[args.length-1];

if (args[0].macroPass === "preambleComplete"){
	let validTargets = lastArg.targets.filter(target => !Array.from(target.actor.system.traits.ci.value).includes("exhaustion"))
	validIds = validTargets.map((u) => u.id);
	game.user.updateTokenTargets(validIds);
} else if (args[0].macroPass === "postSave") {
	for (target of lastArg.failedSaves){
		const actor = canvas.tokens.get(target.id).actor;
		if (actor.type == "npc")currentLevel = actor.flags["tidy5e-sheet"].exhaustion;
		else currentLevel = actor.system.attributes.exhaustion;
		if (currentLevel == 6){
			continue;
		}
		const newLevel = currentLevel + 1;
		
		const uuid = actor.uuid;
		if (currentLevel != 0){
			await game.dfreds.effectInterface.removeEffect({ effectName: `Exhaustion ${currentLevel}`, uuid });		
		}
		await game.dfreds.effectInterface.addEffect({ effectName: `Exhaustion ${newLevel}`, uuid });

		if (actor.type == "npc") actor.setFlag("tidy5e-sheet", "exhaustion", newLevel);
		else actor.update({"system.attributes.exhaustion": newLevel});
	}
}