if (args[0] == "off"){
	lastArg = args[args.length-1];
	let uuid = lastArg.actorUuid;
	game.dfreds.effectInterface.addEffect({ effectName: 'Lethargy', uuid });
}