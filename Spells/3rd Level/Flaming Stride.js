if (args[0] === "on"){
	const lastArg = args[args.length - 1];
	const level = args[1];
	const dice = level - 2;
	const target = canvas.tokens.get(lastArg.tokenId);
	const item = await fromUuid(lastArg.origin);
	const caster = item.parent;
	const casterToken = canvas.tokens.placeables.find((t) => t.actor?.uuid === caster.uuid);
	const damageType = 'fire';

	const damageRoll = await new Roll(`${dice}d6[${damageType}]`).evaluate();
	if (game.dice3d) game.dice3d.showForRoll(damageRoll);
	const workflowItemData = duplicate(item);
	console.log(workflowItemData);
	workflowItemData.system.target = { value: 1, units: "", type: "creature" };
	workflowItemData.system.properties = [];
	workflowItemData.system.level = `${level}`;
	workflowItemData.system.duration = { value: null, units: "inst" };

	setProperty(workflowItemData, "flags.itemacro", {});
	setProperty(workflowItemData, "flags.midi-qol", {});
	setProperty(workflowItemData, "flags.dae", {});
	setProperty(workflowItemData, "effects", []);
	delete workflowItemData._id;
	workflowItemData.name = `${workflowItemData.name}: Flames Damage`;

	await new MidiQOL.DamageOnlyWorkflow(
	    caster,
	    casterToken,
	    damageRoll.total,
	    damageType,
	    [target],
	    damageRoll,
	    {
	      flavor: `(${CONFIG.DND5E.damageTypes[damageType]})`,
	      itemCardId: 'new',
	      itemData: workflowItemData,
	      isCritical: false,
	    }
	 );
}