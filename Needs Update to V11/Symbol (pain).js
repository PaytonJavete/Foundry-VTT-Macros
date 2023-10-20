const lastArg = args[args.length - 1];
const condition = 'Incapacitated';

async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }

async function applyCondition(condition, targetToken, item, itemLevel) {
  if (!game.dfreds.effectInterface.hasEffectApplied(condition, targetToken.document.uuid)) {
    const caster = item.parent;
    const workflowItemData = duplicate(item.data);
    workflowItemData.data.target = { value: 1, units: "", type: "creature" };
    workflowItemData.data.save.ability = 'con';
    workflowItemData.data.components.concentration = false;
    workflowItemData.data.level = itemLevel;
    workflowItemData.data.duration = { value: null, units: "inst" };
    workflowItemData.data.target = { value: null, width: null, units: "", type: "creature" };
    workflowItemData.data.preparation.mode = "atwill";
    setProperty(workflowItemData, "flags.itemacro", {});
    setProperty(workflowItemData, "flags.midi-qol", {});
    setProperty(workflowItemData, "flags.dae", {});
    setProperty(workflowItemData, "effects", []);
    delete workflowItemData._id;
    workflowItemData.name = `${workflowItemData.name}: ${item.name} Condition save`;
    // console.warn("workflowItemData", workflowItemData);

    const saveTargets = [...game.user?.targets].map((t )=> t.id);
    game.user.updateTokenTargets([targetToken.id]);
    const saveItem = new CONFIG.Item.documentClass(workflowItemData, { parent: caster });
    const options = { showFullCard: false, createWorkflow: true, configureDialog: true };
    const result = await MidiQOL.completeItemRoll(saveItem, options);

    game.user.updateTokenTargets(saveTargets);
    const failedSaves = [...result.failedSaves];
    if (failedSaves.length > 0) {
      await game.dfreds.effectInterface.addEffect({ effectName: condition, uuid: failedSaves[0].document.uuid });
    }

    return result;
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
      luminosity: 1,
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

async function attachSequencerFileToTemplate(template, originUuid) {
  if (game.modules.get("sequencer")?.active) {
    new Sequence()
      .effect()
        .file("modules/JB2A_DnD5e/Library/Generic/Magic_Signs/AbjurationCircleIntro_02_Dark_Blue_800x800.webm")
        .size({
          width: canvas.grid.size * ((template.data.distance*0.2) / canvas.dimensions.distance),
          height: canvas.grid.size * ((template.data.distance*0.2) / canvas.dimensions.distance),
        })
        .origin(originUuid)
        .atLocation({x: template.data.x, y: template.data.y})
      .waitUntilFinished(-1000)
      .effect()
        .file("modules/JB2A_DnD5e/Library/Generic/Magic_Signs/AbjurationCircleLoop_02_Dark_Blue_800x800.webm")
        .size({
          width: canvas.grid.size * ((template.data.distance*0.2) / canvas.dimensions.distance),
          height: canvas.grid.size * ((template.data.distance*0.2) / canvas.dimensions.distance),
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

	const template = await fromUuid(lastArg.templateUuid);
	circleLight(template.data.x, template.data.y, 60);
	attachSequencerFileToTemplate(template, lastArg.itemUuid);
	for (const token of lastArg.failedSaves) {
      if (!game.dfreds.effectInterface.hasEffectApplied(condition, token.actor.uuid)) {
        console.debug(`Applying ${condition} to ${token.name}`);
        await game.dfreds.effectInterface.addEffect({ effectName: condition, uuid: token.actor.uuid });
      }
    };
	return await AAhelpers.applyTemplate(args);

} else if (args[0] == "on" || args[0] == "each") {
  const safeName = lastArg.efData.label.replace(/\s|'|\.|’/g, "_");
  const item = await fromUuid(lastArg.efData.origin);
  // sometimes the round info has not updated, so we pause a bit
  if (args[0] == "each") await wait(500);
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
      condition: condition,
    };

  const castTurn = targetItemTracker.startRound === game.combat.round && targetItemTracker.startTurn === game.combat.turn;
  const isLaterTurn = game.combat.round > targetTokenTracker.round || game.combat.turn > targetTokenTracker.turn;
  const everyEntry = hasProperty(item.data, "flags.ddbimporter.effect.everyEntry")
    ? item.data.flags.ddbimporter.effect.everyEntry
    : false;

  // if:
  // not cast turn, and not part of the original target
  // AND one of the following
  // not original template and have not yet had this effect applied this combat OR
  // has been targeted this combat, left and re-entered effect, and is a later turn

  if (castTurn && originalTarget) {
    console.debug(`Token ${target.name} is part of the original target for ${item.name}`);
  } else if (everyEntry || !targetedThisCombat || (targetedThisCombat && isLaterTurn)) {
    console.debug(`Token ${target.name} is targeted for immediate save vs condition with ${item.name}, using the following factors`, { originalTarget, castTurn, targetedThisCombat, targetTokenTracker, isLaterTurn });
    targetTokenTracker.hasLeft = false;
    await applyCondition(targetTokenTracker.condition, target, item, targetItemTracker.spellLevel);
  }
  await DAE.setFlag(target, `${safeName}Tracker`, targetTokenTracker);

} else if (args[0] == "off") {
  const safeName = lastArg.efData.label.replace(/\s|'|\.|’/g, "_");
  const targetToken = await fromUuid(lastArg.tokenUuid);
  const targetTokenTracker = await DAE.getFlag(targetToken, `${safeName}Tracker`);
  const removeOnOff = hasProperty(lastArg, "efData.flags.ddbimporter.effect.removeOnOff")
    ? lastArg.efData.flags.ddbimporter.effect.removeOnOff
    : true;

  if (targetTokenTracker?.condition && removeOnOff && game.dfreds.effectInterface.hasEffectApplied(targetTokenTracker.condition, lastArg.tokenUuid)) {
    console.debug(`Removing ${targetTokenTracker.condition} from ${targetToken.name}`);
    game.dfreds.effectInterface.removeEffect({ effectName: targetTokenTracker.condition, uuid: lastArg.tokenUuid });
  }

  if (targetTokenTracker) {
    targetTokenTracker.hasLeft = true;
    targetTokenTracker.turn = game.combat.turn;
    targetTokenTracker.round = game.combat.round;
    await DAE.setFlag(targetToken, `${safeName}Tracker`, targetTokenTracker);
  }
}