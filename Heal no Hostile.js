// Put in a spell/item onUse macro After Targeting Complete

const lastArg = args[args.length-1];
let friendlyTargets = lastArg.targets.filter(target => target.disposition != -1);
friendlyIds = friendlyTargets.map((u) => u.id);
game.user.updateTokenTargets(friendlyIds);