let concentrating = actor.effects.some(effect => effect.sourceName == "Telekinesis (Ring)" && effect.label == "Concentrating");
if(!concentrating){
    dnd5e.documents.macro.rollItem("Telekinesis (Ring)");
} 
else {
	const item = actor.items.getName("Telekinesis (Ring)");
    const workflowItemData = duplicate(item);
    workflowItemData.system.components.concentration = false;
    workflowItemData.system.duration = { value: null, units: "inst" };

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemRoll(spellItem, options);
}