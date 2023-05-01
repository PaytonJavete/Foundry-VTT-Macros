const lastArg = args[args.length-1];
const tokenC = canvas.tokens.get(lastArg.tokenId);
const actorC = tokenC.actor;

if (lastArg.hitTargets.length < 1) return {}; // attack hit
if (!["mwak","rwak"].includes(lastArg.itemData.system.actionType)) return {}; // is weapon attack

//Track if used already this turn
if (game.combat) {
	if (lastArg.tokenId != game.combat?.current.tokenId) return {}; // cleric's turn
	const safeName = lastArg.itemData.name.replace(/\s|'|\.|’/g, "_");
	const tracker = DAE.getFlag(actorC, `${safeName}Tracker`);
	if (tracker){
		if (tracker.round == game.combat.round) return {};
		await DAE.unsetFlag(actorC, `${safeName}Tracker`);	
	}
	await DAE.setFlag(actorC, `${safeName}Tracker`, {round: game.combat.round});
}

//Define type based on Domain
let type = lastArg.damageDetail[0].type; //War Domain+

let die = 1;
if (actorC.system.details.level >= 14){
	die = 2;
}

const dice = lastArg.isCritical ? die*2: die;

return {damageRoll: `${dice}d8[${type}]`, flavor: "Divine Strike"};