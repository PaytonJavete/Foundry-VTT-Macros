// Put in a spell/item onUse macro After Targeting Complete

const lastArg = args[args.length-1];
const tokenS = canvas.tokens.get(lastArg.tokenId);
const noHeal = tokenS.document.disposition >= 0 ? -1 : 1;
let friendlyTargets = lastArg.targets.filter(target => target.disposition != noHeal);
friendlyIds = friendlyTargets.map((u) => u.id);
game.user.updateTokenTargets(friendlyIds);