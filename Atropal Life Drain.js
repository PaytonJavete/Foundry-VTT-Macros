lastArg = args[args.length-1];

if (lastArg.hitTargets.length != 1) return;

let damage = lastArg.damageList[0].appliedDamage;

const actor = canvas.tokens.get(lastArg.tokenId).actor;
await actor.applyDamage(0-damage);