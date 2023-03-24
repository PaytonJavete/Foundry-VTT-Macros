for (let i = 0; i < 9; i++){
    const token = canvas.tokens.get(args[0].tokenId);
    const actor = token.actor;
    const item = actor.items.getName("Fire Storm");
    const workflowItemData = duplicate(item.data);
    workflowItemData.data.preparation.mode = "atwill";
    workflowItemData.data.uses = {max: null, per: "", value: null};
    setProperty(workflowItemData, "flags.itemacro", {});

    const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemRoll(spellItem, options);  
}