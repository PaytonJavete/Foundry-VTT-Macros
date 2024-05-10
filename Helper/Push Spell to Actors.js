const spellName = "Sanctuary";
const actors = game.actors.filter(a => a.items.some(i => i.name == spellName));

for (actor of actors){
	currentItem = actor.items.find(i => i.name == spellName);
	newItem = duplicate(game.items.find(i => i.name == spellName));
	newItem.system.uses = currentItem.system.uses;
	newItem.system.preparation = currentItem.system.preparation;
	newItem.system.consume = currentItem.system.consume;
	await actor.deleteEmbeddedDocuments("Item", [currentItem.id]);
	await actor.createEmbeddedDocuments("Item", [newItem]);	
}