const lastArg = args[args.length - 1];
casterTokenUuid = lastArg.tokenUuid;

//Check if a spell
if (!["spell"].includes(lastArg.itemData.type)) return {};

//Check if a healing spell
if (!["heal"].includes(lastArg.itemData.system.actionType)) return {};

//Check if not self-targeted
if (lastArg.targetUuids.includes(casterTokenUuid)) return {};

healAmount = 2 + lastArg.itemData.system.level;

const healingRoll = await new Roll(`${healAmount}d1[healing]`).roll();
await game.dice3d.showForRoll(healingRoll);

workflowItemData = lastArg.actor.items.getName("Blessed Healer");

new MidiQOL.DamageOnlyWorkflow(
	actor,
	token,
	healingRoll.total,
	"healing",
	[canvas.tokens.get(lastArg.tokenId)],
	healingRoll,
	{
      flavor: "(Healing)",
      itemCardId: "new",
      itemData: workflowItemData,
	}
);