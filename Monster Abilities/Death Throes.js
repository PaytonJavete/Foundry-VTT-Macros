const lastArg = args[args.length-1];

if (args[0] == "off" && lastArg["expiry-reason"] == 'midi-qol:zeroHP'){
	const item = await fromUuid(lastArg.origin);
	const actor = canvas.tokens.get(lastArg.tokenId).actor;

	const workflowItemData = duplicate(item);
    delete workflowItemData._id;
	
	const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: false };
    await MidiQOL.completeItemRoll(spellItem, options);
}