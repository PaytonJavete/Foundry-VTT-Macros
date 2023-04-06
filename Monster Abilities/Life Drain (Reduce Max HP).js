lastArg = args[args.length-1];

if (lastArg.hitTargets.length != 1 || lastArg.failedSaves.length != 1) return;

let damage = lastArg.damageList[0].appliedDamage;
if (damage <= 0) return;

let targetActor = canvas.tokens.get(lastArg.hitTargets[0].id).actor;

if(DAE.getFlag(targetActor, "ImmuneMaxHpReduced")) return;

const uuid = targetActor.uuid;
const efName = "Life Drain";

let effect = targetActor.effects.find(effect => effect.label == efName)
let currentDrain = 0;
if (effect){
	currentDrain = parseInt(effect.changes[0].value);
	await game.dfreds.effectInterface.removeEffect({ effectName: efName, uuid });
}
newDrain = currentDrain - damage;

const effectData = await game.dfreds.effectInterface.findEffectByName(efName);
effectData.changes[0].value = newDrain;

await game.dfreds.effectInterface.addEffectWith({ effectData, uuid });