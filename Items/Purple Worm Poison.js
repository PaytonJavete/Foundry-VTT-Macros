const lastArg = args[args.length-1];

if (lastArg.hitTargets.length < 1) return {};

const tokenP = canvas.tokens.get(lastArg.tokenId);
const actorP = tokenP.actor;
let dice = args[0].isCritical ? 24: 12;

let targets = game.user.targets;
const [target] = targets;

let save_roll = await target.actor.rollAbilitySave("con", {chatMessage : true, async: true });
let DC = 19;
if (save_roll.total >= DC) dice = dice / 2;

return {damageRoll: `${dice}d6[poison]`, flavor: "Puple Worm Poison"};