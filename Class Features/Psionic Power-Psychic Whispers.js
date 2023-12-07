const lastArg = args[args.length - 1];

duration = 3600 * lastArg.damageTotal;

effectData = game.dfreds.effectInterface.findEffectByName('Psychic Whispers').data;
effectData.duration.seconds = duration;

lastArg.targetUuids.forEach(uuid => game.dfreds.effectInterface.addEffectWith({ effectData, uuid }));