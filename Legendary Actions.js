lastArg = args[args.length-1];
const actorToken = await fromUuid(lastArg.tokenUuid);
const actor = actorToken.actor;
const maxLegact = actor.system.resources.legact.max;

await actor.update({"system.resources.legact.value": maxLegact});