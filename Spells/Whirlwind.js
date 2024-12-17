const lastArg = args[args.length - 1];
console.log(args);

async function rollItemDamage(targetToken, item, itemLevel) {
  const caster = item.parent;
  //let shapechanger = targetActor.system.details.type.subtype == "shapechanger";

  const workflowItemData = duplicate(item);
  workflowItemData.system.target = { value: 1, units: "", type: "creature" };
  workflowItemData.system.components.concentration = false;
  workflowItemData.system.level = itemLevel;
  workflowItemData.system.preparation.mode = "atwill";
  workflowItemData.system.uses = {max: null, per: "", value: null};
  workflowItemData.system.damage.parts[0] = ["10d6[bludgeoning]", "bludgeoning"];
  workflowItemData.system.actionType = "save";
  workflowItemData.system.save.ability = "dex";
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
        .file("jb2a.whirlwind.bluewhite")
        .size({
          width: canvas.grid.size * ((templateM.data.distance*2.5) / canvas.dimensions.distance),
          height: canvas.grid.size * ((templateM.data.distance*2.5) / canvas.dimensions.distance),
        })
        .persist(true)
        .origin(originUuid)
        .atLocation({x: templateM.data.x, y: templateM.data.y})
        .attachTo(templateM)
      .play();
  }
}

if (args[0].tag === "OnUse" && args[0].macroPass === "preActiveEffects") {
  await AAhelpers.applyTemplate(args);
  attachSequencerFileToTemplate(lastArg.templateUuid, lastArg.itemUuid);
} 
else if (args[0] == "on") {
  const item = await fromUuid(lastArg.efData.origin);
  const target = canvas.tokens.get(lastArg.tokenId);
  await rollItemDamage(target, item, args[1]);
}