if (!game.modules.get("advanced-macros")?.active) {
  ui.notifications.error("Advanced Macros is not enabled");
  return;
} else if(!game.modules.get("ActiveAuras")?.active) {
  ui.notifications.error("ActiveAuras is not enabled");
  return;
}

const lastArg = args[args.length - 1];
console.log(args);

function getCantripDice(actor) {
  const level = actor.type === "character" ? actor.data.details.level : actor.data.details.cr;
  return 1 + Math.floor((level + 1) / 6);
}

async function rollItemDamage(targetToken, itemUuid, itemLevel) {
  const item = await fromUuid(itemUuid);
  const caster = item.parent;
  const workflowItemData = duplicate(item.data);
  workflowItemData.data.target = { value: 1, units: "", type: "creature" };
  workflowItemData.data.save.ability = item.data.flags.ddbimporter.effect.save;
  workflowItemData.data.components.concentration = false;
  workflowItemData.data.level = itemLevel;
  workflowItemData.data.duration = { value: null, units: "inst" };
  workflowItemData.data.target = { value: null, width: null, units: "", type: "creature" };
  workflowItemData.data.preparation.mode = "atwill";
  workflowItemData.data.uses = {max: null, per: "", value: null};
  setProperty(workflowItemData, "flags.itemacro", {});
  setProperty(workflowItemData, "flags.midi-qol", {});
  setProperty(workflowItemData, "flags.dae", {});
  setProperty(workflowItemData, "effects", []);
  delete workflowItemData._id;
  workflowItemData.name = `${workflowItemData.name}: Turn Entry Damage`;
  // console.warn("workflowItemData", workflowItemData);

  game.user.updateTokenTargets([targetToken.id]);
  const saveItem = new CONFIG.Item.documentClass(workflowItemData, { parent: caster });
  const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
  const result = await MidiQOL.completeItemRoll(saveItem, options);
}

async function attachSequencerFileToTemplate(templateUuid, originUuid) {
  if (game.modules.get("sequencer")?.active) {
    const template = await fromUuid(templateUuid);
    new Sequence()
    .effect()
      .file("modules/JB2A_DnD5e/Library/Generic/Fireflies/Fireflies_01_Green_Many01_400x400.webm")
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
}

if (args[0].tag === "OnUse" && args[0].macroPass === "preActiveEffects") {
  const safeName = lastArg.itemData.name.replace(/\s|'|\.|’/g, "_");
  const dataTracker = {
    randomId: randomID(),
    targetUuids: lastArg.targetUuids,
    startRound: game.combat.round,
    startTurn: game.combat.turn,
    spellLevel: lastArg.spellLevel,
  };

  const item = await fromUuid(lastArg.itemUuid);
  // await item.update(dataTracker);
  await DAE.unsetFlag(item, `${safeName}Tracker`);
  await DAE.setFlag(item, `${safeName}Tracker`, dataTracker);

  const ddbEffectFlags = lastArg.item.flags.ddbimporter?.effect;
  const newArgs = duplicate(args);
  if (ddbEffectFlags) {
    if (ddbEffectFlags.isCantrip) {
      const cantripDice = getCantripDice(lastArg.actor);
      newArgs[0].spellLevel = cantripDice;
      ddbEffectFlags.cantripDice = cantripDice;
      let newEffects = newArgs[0].item.effects.map((effect) => {
        effect.changes = effect.changes.map((change) => {
          change.value = change.value.replace("@cantripDice", cantripDice)
          return change;
        });
        return effect;
      });
      newArgs[0].item.effects = duplicate(newEffects);
      newArgs[0].itemData.effects = duplicate(newEffects);
    }
    const template = await fromUuid(lastArg.templateUuid);
    await template.update({"flags.effect": ddbEffectFlags});
  }


  attachSequencerFileToTemplate(lastArg.templateUuid, lastArg.itemUuid);

  return await AAhelpers.applyTemplate(newArgs);

} else if (args[0] == "on") {
  const safeName = lastArg.efData.label.replace(/\s|'|\.|’/g, "_");
  const item = await fromUuid(lastArg.efData.origin);
  const targetItemTracker = DAE.getFlag(item.parent, `${safeName}Tracker`);
  const originalTarget = targetItemTracker.targetUuids.includes(lastArg.tokenUuid);
  const target = canvas.tokens.get(lastArg.tokenId);
  const targetTokenTrackerFlag = DAE.getFlag(target, `${safeName}Tracker`);
  const targetedThisCombat = targetTokenTrackerFlag && targetItemTracker.randomId === targetTokenTrackerFlag.randomId;
  const targetTokenTracker = targetedThisCombat
    ? targetTokenTrackerFlag
    : {
      randomId: targetItemTracker.randomId,
      round: game.combat.round,
      turn: game.combat.turn,
      hasLeft: false,
    };

  const castTurn = targetItemTracker.startRound === game.combat.round && targetItemTracker.startTurn === game.combat.turn;
  const isLaterTurn = game.combat.round > targetTokenTracker.round || game.combat.turn > targetTokenTracker.turn;

  // if:
  // not cast turn, and not part of the original target
  // AND one of the following
  // not original template and have not yet had this effect applied this combat OR
  // has been targeted this combat, left and re-entered effect, and is a later turn
  if (castTurn && originalTarget) {
    console.debug(`Token ${target.name} is part of the original target for ${item.name}`);
  } else if (!targetedThisCombat || (targetedThisCombat && targetTokenTracker.hasLeft && isLaterTurn)){
    console.debug(`Token ${target.name} is targeted for immediate damage with ${item.name}, using the following factors`, { originalTarget, castTurn, targetedThisCombat, targetTokenTracker, isLaterTurn });
    targetTokenTracker.hasLeft = false;
    await rollItemDamage(target, lastArg.efData.origin, targetItemTracker.spellLevel);
  }
  await DAE.setFlag(target, `${safeName}Tracker`, targetTokenTracker);
} else if (args[0] == "off") {
  const safeName = lastArg.efData.label.replace(/\s|'|\.|’/g, "_");
  const target = canvas.tokens.get(lastArg.tokenId);
  const targetTokenTracker = DAE.getFlag(target, `${safeName}Tracker`);

  if (targetTokenTracker) {
    targetTokenTracker.hasLeft = true;
    targetTokenTracker.turn = game.combat.turn;
    targetTokenTracker.round = game.combat.round;
    await DAE.setFlag(target, `${safeName}Tracker`, targetTokenTracker);
  }
}