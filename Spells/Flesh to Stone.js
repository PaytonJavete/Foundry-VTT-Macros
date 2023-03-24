lastArg = args[args.length-1];
if (lastArg.failedSaves.length > 0){
	let tracker = {"fails": 1, "saves": 0};
	for (token of lastArg.failedSaves){
		let c_token = canvas.tokens.get(token.id);
		let actor = c_token.actor;
		DAE.setFlag(actor, "FleshToStone", tracker);
	}
}