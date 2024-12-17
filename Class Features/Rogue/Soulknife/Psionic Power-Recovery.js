actor = args[0].actor;
const value = actor.system.resources.primary.value + 1;
if (value > actor.system.resources.primary.max){
	ui.notifications.warn("You already have max psionic dice.")
	const item = actor.items.getName("Psionic Power: Recovery");
	await item.update({"system.uses.value": 1});
	return; 
}
const item = actor.items.getName("Psionic Power: Psionic Energy");
await item.update({"system.uses.value": value});