if (!game.modules.get("advanced-macros")?.active) {
  ui.notifications.error("Advanced Macros is not enabled");
  return;
} else if(!game.modules.get("ActiveAuras")?.active) {
  ui.notifications.error("ActiveAuras is not enabled");
  return;
}

const lastArg = args[args.length - 1];
console.log(args);

async function rollItemDamage(targetToken, itemUuid, itemLevel) {
  const item = await fromUuid(itemUuid);  
  const caster = item.parent;
  let damageDice = `${itemLevel}d10`;
  const damageType = "radiant";
  const saveAbility = "con";
  const casterToken = canvas.tokens.placeables.find((t) => t.actor?.uuid === caster.uuid);

  targetActor = targetToken.actor;
  let shapechanger = targetActor.labels.creatureType.includes("shapechanger");
  let save_roll = undefined;
  if (shapechanger){
    save_roll = await targetActor.rollAbilitySave(saveAbility, {chatMessage : true, async: true, disadvantage:true });
  } else {
    save_roll = await targetActor.rollAbilitySave(saveAbility, {chatMessage : true, async: true });
  } 
  if (save_roll.total >= caster.data.data.attributes.spelldc){
    let save_result = `${targetToken.name} successfully made their saving throw`;
    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({token: targetToken}),
        content: save_result
    }); 
    damageDice = `floor(${damageDice} / 2)`;
  } else {
    let save_result = `${targetToken.name} failed their saving throw`;
    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({token: targetToken}),
        content: save_result
    }); 
  }

  const damageRoll = await new Roll(damageDice).evaluate({ async: true });
  if (game.dice3d) game.dice3d.showForRoll(damageRoll);
  const workflowItemData = duplicate(item.data);
  console.log(workflowItemData);
  workflowItemData.data.target = { value: 1, units: "", type: "creature" };
  workflowItemData.data.save.ability = saveAbility;
  workflowItemData.data.components.concentration = false;
  workflowItemData.data.level = itemLevel;
  workflowItemData.data.duration = { value: null, units: "inst" };
  workflowItemData.data.target = { value: null, width: null, units: "", type: "creature" };

  setProperty(workflowItemData, "flags.itemacro", {});
  setProperty(workflowItemData, "flags.midi-qol", {});
  setProperty(workflowItemData, "flags.dae", {});
  setProperty(workflowItemData, "effects", []);
  delete workflowItemData._id;
  workflowItemData.name = `${workflowItemData.name}: Turn Entry Damage`;
  // console.warn("workflowItemData", workflowItemData);

  await new MidiQOL.DamageOnlyWorkflow(
    caster,
    casterToken.data,
    damageRoll.total,
    damageType,
    [targetToken],
    damageRoll,
    {
      flavor: `(${CONFIG.DND5E.damageTypes[damageType]})`,
      itemCardId: "new",
      itemData: workflowItemData,
      isCritical: false,
    }
  );

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

  attachSequencerFileToTemplate(lastArg.templateUuid, lastArg.itemUuid);

  const newArgs = duplicate(args);

  const template = await fromUuid(lastArg.templateUuid);
  circleLight(template.data.x, template.data.y, 5);

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

function circleLight(cx, cy, radius) {
  const lightTemplate = {
    x: cx,
    y: cy,
    rotation: 0,
    walls: false,
    vision: false,
    config: {
      alpha: 0.5,
      angle: 0,
      bright: 0,
      coloration: 0,
      dim: radius,
      gradual: false,
      luminosity: 0.5,
      saturation: 0,
      contrast: 0,
      shadows: 0,
      animation: {
        speed: 5,
        intensity: 5,
        reverse: false,
      },
      darkness: {
        min: 0,
        max: 1,
      },
      color: null,
    },
    hidden: false,
  };
  canvas.scene.createEmbeddedDocuments("AmbientLight", [lightTemplate]);
}