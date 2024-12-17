const lastArg = args[args.length - 1];

let duration = 3600 * lastArg.damageRolls[0].total;

effectData = game.dfreds.effectInterface.findEffect({ effectName: 'Psychic Whispers' }).toObject();
effectData.duration.seconds = duration;

lastArg.targetUuids.forEach(uuid => game.dfreds.effectInterface.addEffect({ effectData, uuid }));