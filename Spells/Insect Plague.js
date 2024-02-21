const lastArg = args[args.length - 1];

async function rollItemDamage(targetToken, item, itemLevel) {
  const caster = item.parent;
  const workflowItemData = duplicate(item);
  workflowItemData.system.target = { value: 1, units: "", type: "creature" };
  workflowItemData.system.components.concentration = false;
  workflowItemData.system.level = itemLevel;
  workflowItemData.system.preparation.mode = "atwill";
  workflowItemData.system.uses = {max: null, per: "", value: null};
  workflowItemData.system.duration = { value: null, units: "inst" };

  setProperty(workflowItemData, "flags.itemacro", {});
  setProperty(workflowItemData, "flags.midi-qol", {});
  setProperty(workflowItemData, "flags.dae", {});
  setProperty(workflowItemData, "effects", []);
  delete workflowItemData._id;
  workflowItemData.name = `${workflowItemData.name}: Turn Entry Damage`;

  game.user.updateTokenTargets([targetToken.id]);
  const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: caster })
  const options = { showFullCard: true, createWorkflow: true, versatile: false, configureDialog: false };
  await MidiQOL.completeItemRoll(spellItem, options);
}

async function attachSequencerFileToTemplate(templateUuid, originUuid) {
  const templateM = await fromUuid(templateUuid);
  new Sequence()
  .effect()
    .file("jb2a.spirit_guardians.greenorange.no_ring")
    .size({
      width: canvas.grid.size * ((templateM.data.distance*2) / canvas.dimensions.distance),
      height: canvas.grid.size * ((templateM.data.distance*2) / canvas.dimensions.distance),
    })
    .persist(true)
    .aboveLighting()
    .origin(originUuid)
    .attachTo(templateM)
  .play();
}

if (args[0].tag === "OnUse") {
  AAhelpers.applyTemplate(args);

  attachSequencerFileToTemplate(lastArg.templateUuid, lastArg.itemUuid);
} 
else if (args[0] === "on") {
  const item = await fromUuid(lastArg.efData.origin);
  const target = canvas.tokens.get(lastArg.tokenId);
  if (game.combat){
    if (lastArg.tokenId != game.combat?.current.tokenId) return;
  }
  await rollItemDamage(target, item, args[1]);
}