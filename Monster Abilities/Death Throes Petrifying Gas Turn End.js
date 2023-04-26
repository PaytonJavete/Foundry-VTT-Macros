async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
lastArg = args[args.length-1];
console.log(args);

if (lastArg.failedSaves.length == 1){
	const actor = canvas.tokens.get(lastArg.targets[0].id).actor;
	effect = actor.effects.find(e => e.label == "Gas" && e.sourceName == "Death Throes");
	if(effect) effect.delete();
	const uuid = actor.uuid;
	await wait(1000);

	effectData = game.dfreds.effectInterface.findEffectByName('Petrified').data;
	effectData.duration.seconds = 60;
	game.dfreds.effectInterface.addEffectWith({ effectData, uuid });
}