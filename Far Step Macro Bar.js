let concentrating = actor.effects.find(effect => effect.sourceName == "Far Step" && effect.label == "Concentrating");
if(concentrating == undefined){
    game.dnd5e.macros.rollItem("Far Step")    
} else {
    const item = actor.items.getName("Far Step");
    const workflowItemData = duplicate(item);
    workflowItemData.system.components.concentration = false;
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.uses = {max: null, per: "", value: null};

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: canvas.tokens.controlled[0].actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemRoll(spellItem, options);  
}