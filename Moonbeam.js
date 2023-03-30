const lastArg = args[args.length - 1];

async function rollItemDamage(targetToken, item, itemLevel) {
  const caster = item.parent;
  //let shapechanger = targetActor.system.details.type.subtype == "shapechanger";

  const workflowItemData = duplicate(item);
  workflowItemData.system.target = { value: 1, units: "", type: "creature" };
  workflowItemData.system.save.ability = "con";
  workflowItemData.system.components.concentration = false;
  workflowItemData.system.level = itemLevel;
  workflowItemData.system.preparation.mode = "atwill";
  workflowItemData.system.uses = {max: null, per: "", value: null};
  workflowItemData.system.damage.parts[0] = [`${itemLevel}d10[radiant]`, "radiant"];
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
  if (game.modules.get("sequencer")?.active) {
    const template = await fromUuid(templateUuid);
    new Sequence()
      .effect()
        .file("modules/JB2A_DnD5e/Library/2nd_Level/Moonbeam/MoonbeamIntro_01_Regular_Blue_400x400.webm")
        .size({
          width: canvas.grid.size * ((template.data.distance*2.5) / canvas.dimensions.distance),
          height: canvas.grid.size * ((template.data.distance*2.5) / canvas.dimensions.distance),
        })
        .origin(originUuid)
        .atLocation({x: template.data.x, y: template.data.y})
      .waitUntilFinished(-1000)
      .effect()
        .file("modules/JB2A_DnD5e/Library/2nd_Level/Moonbeam/MoonbeamNoPulse_01_Regular_Blue_400x400.webm")
        .size({
          width: canvas.grid.size * ((template.data.distance*2.5) / canvas.dimensions.distance),
          height: canvas.grid.size * ((template.data.distance*2.5) / canvas.dimensions.distance),
        })
        .persist(true)
        .origin(originUuid)
        .atLocation({x: template.data.x, y: template.data.y})
        .attachTo(template)
      .play();
  }
}

if (args[0].tag === "OnUse" && args[0].macroPass === "preActiveEffects") {
  attachSequencerFileToTemplate(lastArg.templateUuid, lastArg.itemUuid);

  const template = await fromUuid(lastArg.templateUuid);
  let params = {template: {x: template.data.x, y: template.data.y, uuid: template.uuid}, light: {dim: 5, bright: 0, color: null}};
  const gmMacro = game.macros.find(m => m.name === "Attach Light to Template");
  gmMacro.execute(params);

  return await AAhelpers.applyTemplate(args);
  
} else if (args[0] == "on") {
  const item = await fromUuid(lastArg.efData.origin);
  const target = canvas.tokens.get(lastArg.tokenId);
  await rollItemDamage(target, item, args[1]);
}