lastArg = args[args.length-1];

if (game.user.targets.size != 1) return ui.notifications.error("Life Transference can only have one target.");

[target] = game.user.targets;
const token = canvas.tokens.get(lastArg.tokenId);
if (MidiQOL.getDistance(token, target, true) > 30) return ui.notifications.error("Life Transference has a range of 30 feet.");

let healing = lastArg.damageList[0].appliedDamage * 2;
const item = await fromUuid(lastArg.uuid);
await MidiQOL.applyTokenDamage([{ damage: healing, type: "healing" }], healing, new Set([target]), item, new Set());