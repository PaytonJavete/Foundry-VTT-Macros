const lastArg = args[args.length - 1];

async function rollItemDamage(targetToken, item) {
  const caster = item.parent;

  const workflowItemData = duplicate(item);
  workflowItemData.system.target = { value: 1, units: "", type: "creature" };
  workflowItemData.system.save.ability = "dex";
  workflowItemData.system.components.concentration = false;
  workflowItemData.system.preparation.mode = "atwill";
  workflowItemData.system.uses = {max: null, per: "", value: null};
  workflowItemData.system.damage.parts[0] = ["6d10[slashing]", "slashing"];
  workflowItemData.system.duration = { value: null, units: "inst" };
  workflowItemData.system.target = { value: null, width: null, units: "", type: "creature" };

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
  const template = await fromUuid(templateUuid);
  const gridLine = canvas.grid.size * (template.distance / canvas.grid.grid.options.dimensions.distance);
  const x = template.x;
  const y = template.y;
  const theta = Math.toRadians(template.direction);
  const destinationX = Math.floor(x + (Math.cos(theta) * gridLine));
  const destinationY = Math.floor(y + (Math.sin(theta) * gridLine));
  new Sequence()
    .effect()
      .file("jb2a.energy_wall.01.25x05ft.01.loop.orange")
      .persist(true)
      .origin(originUuid)
      .aboveLighting()
      .atLocation({x: x, y: y})
      .stretchTo({ x: destinationX, y: destinationY })
      .attachTo(template)
    .play();
  }

if (args[0].tag === "OnUse" && args[0].macroPass === "preActiveEffects") {
  attachSequencerFileToTemplate(lastArg.templateUuid, lastArg.itemUuid);

  return await AAhelpers.applyTemplate(args);
  
} else if (args[0] == "on") {
  const item = await fromUuid(lastArg.efData.origin);
  const target = canvas.tokens.get(lastArg.tokenId);
  await rollItemDamage(target, item);
}