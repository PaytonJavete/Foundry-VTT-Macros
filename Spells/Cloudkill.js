const lastArg = args[args.length - 1];

async function rollItemDamage(targetToken, item, itemLevel) {
  const caster = item.parent;

  const workflowItemData = duplicate(item);
  workflowItemData.system.target = { value: 1, units: "", type: "creature" };
  workflowItemData.system.save.ability = "con";
  workflowItemData.system.components.concentration = false;
  workflowItemData.system.level = itemLevel;
  workflowItemData.system.preparation.mode = "atwill";
  workflowItemData.system.uses = {max: null, per: "", value: null};
  workflowItemData.system.damage.parts[0] = [`${itemLevel}d8[poison]`, "poison"];
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

async function attachSequencerFileToTemplate(template, originUuid) {
  new Sequence()
    .effect()
      .file("jb2a.fog_cloud.02.green02")
      .size({
        width: canvas.grid.size * ((template.data.distance*2.5) / canvas.dimensions.distance),
        height: canvas.grid.size * ((template.data.distance*2.5) / canvas.dimensions.distance),
      })
      .persist(true)
      .aboveLighting()
      .origin(originUuid)
      .atLocation({x: template.data.x, y: template.data.y})
      .attachTo(template)
    .play();
}

if (args[0].tag === "OnUse" && args[0].macroPass === "preActiveEffects") {
  const template = await fromUuid(lastArg.templateUuid);
  attachSequencerFileToTemplate(template, lastArg.itemUuid);
  let templateD = canvas.templates.placeables.find((w) => w.document.flags.dnd5e.origin == lastArg.itemUuid);
  let HO_flags = {
        limits: {
          sight: {
            basicSight: { enabled: true, range: 0 }, // Darkvision
            lightPerception: { enabled: true, range: 0 }, // Light Perception
          },
          light: { enabled: true, range: 0 },
        },
      };

  templateD.document.update({flags: HO_flags});
  
  return await AAhelpers.applyTemplate(args);

} else if (args[0] == "on") {
  const item = await fromUuid(lastArg.efData.origin);
  const target = canvas.tokens.get(lastArg.tokenId);
  await rollItemDamage(target, item, args[1]);
}