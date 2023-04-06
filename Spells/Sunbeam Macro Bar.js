let concentrating = actor.effects.some(effect => effect.sourceName == "Sunbeam" && effect.label == "Concentrating");
if(!concentrating){
    game.dnd5e.macros.rollItem("Sunbeam");
} else {
    const item = actor.items.getName("Sunbeam");
    const workflowItemData = duplicate(item);
    workflowItemData.system.components.concentration = false;
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.uses = {max: null, per: "", value: null};
    workflowItemData.system.duration = { value: null, units: "inst" };
    blindEffect = workflowItemData.effects.find(effect => effect.label == "Sunbeam Blind");
    setProperty(workflowItemData, "effects", [blindEffect]);

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemRoll(spellItem, options);  
}