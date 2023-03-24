const lastArg = args[args.length-1];
token = canvas.tokens.get(lastArg.tokenId);
actor = token.actor;

if (lastArg.tokenId != game.combat?.current.tokenId) return {}; // cleric's turn
if (lastArg.hitTargets.length < 1) return {}; // attack hit
if (!["mwak","rwak"].includes(lastArg.itemData.data.actionType)) return {}; // is weapon attack

//Track if used already this turn
const safeName = lastArg.itemData.name.replace(/\s|'|\.|’/g, "_");
const tracker = DAE.getFlag(actor, `${safeName}Tracker`);
if (tracker){
	if (tracker.round == game.combat.round) return {};
	await DAE.unsetFlag(actor, `${safeName}Tracker`);	
}
await DAE.setFlag(actor, `${safeName}Tracker`, {round: game.combat.round});

//Define type based on Domain
let type = lastArg.damageDetail[0].type; //War Domain+

let die = 1;
if (lastArg.actor.data.details.level >= 14){
	die = 2;
}

const dice = lastArg.isCritical ? die*2: die;

return {damageRoll: `${dice}d8[${type}]`, flavor: "Divine Strike"};