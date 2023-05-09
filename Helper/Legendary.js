lastArg = args[args.length-1];
const actorToken = await fromUuid(lastArg.tokenUuid);
const actorSheet = actorToken.actor;
const maxLegact = actorSheet.system.resources.tertiary.max;

await actorSheet.update({"system.resources.tertiary.value": maxLegact});