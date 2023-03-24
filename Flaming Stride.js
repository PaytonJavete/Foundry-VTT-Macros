const lastArg = args[args.length - 1];
console.log(args);

if (args[0] == "on"){
	const target = canvas.tokens.get(lastArg.tokenId);
	const item = await fromUuid(lastArg.efData.origin);
	const caster = item.parent;
	const casterToken = canvas.tokens.placeables.find((t) => t.actor?.uuid === caster.uuid);
	const damageType = 'fire';

	const damageRoll = await new Roll('1d6').evaluate({ async: true });
	if (game.dice3d) game.dice3d.showForRoll(damageRoll);
	const workflowItemData = duplicate(item);
	workflowItemData.system.target = { value: 1, units: "", type: "creature" };
	workflowItemData.system.components.concentration = false;
	workflowItemData.system.level = "3";
	workflowItemData.system.duration = { value: null, units: "inst" };
	workflowItemData.system.target = { value: null, width: null, units: "", type: "creature" };

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