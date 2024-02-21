// Midi-qol "on use"
const lastArg = args[args.length - 1];
const tokenOrActor = await fromUuid(lastArg.actorUuid);
const casterActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;
const casterToken = await fromUuid(lastArg.tokenUuid);

if (lastArg.targets.length > 0) {
  let areaSpellData = duplicate(lastArg.item);
  const damageDice = 1 + lastArg.spellLevel;
  areaSpellData.name = "Ice Knife: Explosion";
  areaSpellData.system.damage.parts = [[`${damageDice}d6[cold]`, "cold"]];
  areaSpellData.system.actionType = "save";
  areaSpellData.system.save.ability = "dex";
  areaSpellData.system.scaling = { mode: "level", formula: "1d6" };
  areaSpellData.system.preparation.mode ="atwill";

  setProperty(areaSpellData, "flags.itemacro", {});
  setProperty(areaSpellData, "flags.midi-qol", {});
  setProperty(areaSpellData, "flags.dae", {});
  setProperty(areaSpellData, "effects", []);
  delete areaSpellData._id;

  const areaSpell = new CONFIG.Item.documentClass(areaSpellData, { parent: casterActor })
  const [set] = lastArg.targets;
  const target = canvas.tokens.get(set.id);
  const aoeTargets = await canvas.tokens.placeables.filter((placeable) =>
    canvas.grid.measureDistance(target, placeable) <= 9.5 &&
    (canvas.walls.checkCollision(new Ray(target.center, placeable.center), {"type": "move"}).length == 0)
    ).map((placeable) => placeable.document.uuid);

  const options = {
    showFullCard: false,
    createWorkflow: true,
    targetUuids: aoeTargets,
    configureDialog: false,
    versatile: false,
    consumeResource: false,
    consumeSlot: false,
  };

  await MidiQOL.completeItemUse(areaSpell, {}, options);
} else {
  ui.notifications.error("Ice Knife: No target selected: unable to automate burst effect.");
}