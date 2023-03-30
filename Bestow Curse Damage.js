if (actor.flags?.dae?.onUpdateTarget && args[0].hitTargets.length > 0) {
	const isCursed = actor.flags.dae.onUpdateTarget.find(flag => 
			flag.flagName === "Bestow Curse" && flag.sourceTokenUuid === args[0].hitTargetUuids[0]);
	if(isCursed){
		const diceMult = args[0].isCritical ? 2: 1;
		return {damageRoll: `${diceMult}d8[necrotic]`, flavor: "Bestow Curse Damage"};
	}	
}
return {};