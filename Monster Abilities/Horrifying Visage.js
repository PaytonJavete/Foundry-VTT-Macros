lastArg = args[args.length-1];

if (args[0].tag === "OnUse" && args[0].macroPass === "preambleComplete"){
	let casterToken = await fromUuid(lastArg.tokenUuid);
	new Sequence()
	  .effect()
	    .file("jb2a.impact_themed.skull.pinkpurple")
	    .size({width: 600, height: 600})
	    .atLocation(casterToken)
	  .play();

	let validTargetIds = [];
	for (target of lastArg.targets){
		if(target.actor.system.details?.type?.value == "undead") continue; 
		let ghosts = DAE.getFlag(target.actor, "HorrifyingVisage");
		if (ghosts == undefined){
			ghosts = [];
			DAE.setFlag(target.actor, "HorrifyingVisage", ghosts);
			validTargetIds.push(target.id);
		} else if (!ghosts.includes(lastArg.itemUuid)){
			validTargetIds.push(target.id);
		}
	}
	game.user.updateTokenTargets(validTargetIds);

} else if (args[0].tag === "OnUse" && args[0].macroPass === "postSave"){
	for (target of lastArg.saves){
		let ghosts = DAE.getFlag(target.actor, "HorrifyingVisage");
		if (ghosts == undefined) ghosts = [];
		ghosts.push(lastArg.itemUuid);
		DAE.setFlag(target.actor, "HorrifyingVisage", ghosts);
	}

} else if (args[0] === "off"){
	let actor = canvas.tokens.get(lastArg.tokenId).actor;
	let ghosts = DAE.getFlag(actor, "HorrifyingVisage");
	if (ghosts == undefined) ghosts = [];
	ghosts.push(lastArg.origin);
	DAE.setFlag(actor, "HorrifyingVisage", ghosts);
}
