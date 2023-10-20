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
    const templateM = await fromUuid(templateUuid);
    new Sequence()
      .effect()
        .file("modules/JB2A_DnD5e/Library/2nd_Level/Moonbeam/MoonbeamIntro_01_Regular_Blue_400x400.webm")
        .size({
          width: canvas.grid.size * ((templateM.data.distance*2.5) / canvas.dimensions.distance),
          height: canvas.grid.size * ((templateM.data.distance*2.5) / canvas.dimensions.distance),
        })
        .origin(originUuid)
        .aboveLighting()
        .atLocation({x: templateM.data.x, y: templateM.data.y})
      .waitUntilFinished(-1000)
      .effect()
        .file("modules/JB2A_DnD5e/Library/2nd_Level/Moonbeam/MoonbeamNoPulse_01_Regular_Blue_400x400.webm")
        .size({
          width: canvas.grid.size * ((templateM.data.distance*2.5) / canvas.dimensions.distance),
          height: canvas.grid.size * ((templateM.data.distance*2.5) / canvas.dimensions.distance),
        })
        .persist(true)
        .origin(originUuid)
        .aboveLighting()
        .atLocation({x: templateM.data.x, y: templateM.data.y})
        .attachTo(templateM)
      .play();
  }
}

if (args[0].tag === "OnUse" && args[0].macroPass === "preActiveEffects") {
  AAhelpers.applyTemplate(args);

  attachSequencerFileToTemplate(lastArg.templateUuid, lastArg.itemUuid);

  const templateM = await fromUuid(lastArg.templateUuid);
  let params = {template: {x: templateM.data.x, y: templateM.data.y, uuid: templateM.uuid}, light_P: {dim: 5, bright: 0, color: null}};
  const gmMacro = game.macros.find(m => m.name === "Attach Light to Template");
  gmMacro.execute(params);
} 
else if (args[0] == "on") {
  if (lastArg.efData.flags.ActiveAuras?.isAura){
    let actor_M = await fromUuid(lastArg.actorUuid);
    let effect_M = actor_M.effects.find(e => e.label == lastArg.efData.name);
    effect_M.delete();
  } else {
    const item = await fromUuid(lastArg.efData.origin);
    const target = canvas.tokens.get(lastArg.tokenId);
    await rollItemDamage(target, item, args[1]);
  }
}