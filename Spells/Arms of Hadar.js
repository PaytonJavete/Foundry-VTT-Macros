const lastArg = args[args.length-1];
let updatedTargets = lastArg.targets.filter(target => target.id != lastArg.tokenId);
updatedIds = updatedTargets.map((u) => u.id);
game.user.updateTokenTargets(updatedIds);