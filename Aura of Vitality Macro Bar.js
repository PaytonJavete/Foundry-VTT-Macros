let concentrating = actor.effects.find(effect => effect.sourceName == "Aura of Vitality" && effect.label == "Concentrating");
if(concentrating == undefined){
    game.dnd5e.macros.rollItem("Aura of Vitality");
} else {
    const item = actor.items.getName("Aura of Vitality");
    const workflowItemData = duplicate(item);
    workflowItemData.system.components.concentration = false;
    workflowItemData.system.preparation.mode = "atwill";
    workflowItemData.system.uses = {max: null, per: "", value: null};
    workflowItemData.system.duration = { value: null, units: "inst" };
    workflowItemData.system.target.type = "creature";
    workflowItemData.system.activation.type = "bonus";
    workflowItemData.system.damage.parts[0] = ["2d6[healing]", "healing"];

    setProperty(workflowItemData, "flags.itemacro", {});
    setProperty(workflowItemData, "flags.midi-qol", {});
    setProperty(workflowItemData, "flags.dae", {});
    setProperty(workflowItemData, "effects", []);
    delete workflowItemData._id;
    workflowItemData.name = `${workflowItemData.name}: Bonus Action Heal`;

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemRoll(spellItem, options);
}