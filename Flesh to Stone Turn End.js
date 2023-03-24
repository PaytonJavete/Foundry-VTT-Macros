async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
lastArg = args[args.length-1];
const token = canvas.tokens.get(lastArg.targets[0].id);
const actor = token.actor;

let tracker = DAE.getFlag(actor, "FleshToStone");
if (lastArg.failedSaves.length == 1) tracker.fails += 1;
else tracker.saves += 1;

let effect = actor.effects.find(i => i.sourceName === "Flesh to Stone");

console.log(tracker);

if (tracker.fails == 3){
	let duration = effect.duration.remaining;
	effect.delete();
	const uuid = actor.uuid;
	await wait(500);
	const effectData = await game.dfreds.effectInterface.findEffectByName('Petrified').convertToObject();
	effectData.seconds = duration;
	await game.dfreds.effectInterface.addEffectWith({ effectData, uuid });
} else if (tracker.saves == 3){
	effect.delete();
} else {
	DAE.setFlag(actor, "FleshToStone", tracker);	
}