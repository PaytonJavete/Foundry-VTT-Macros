const lastArg = args[args.length - 1];

duration = 3600 * lastArg.damageTotal;
const effectData = game.dfreds.effectInterface.findEffectByName('Psychic Whispers').convertToObject();
effectData.seconds = duration;

lastArg.targetUuids.forEach(uuid => game.dfreds.effectInterface.addEffectWith({ effectData, uuid }));	