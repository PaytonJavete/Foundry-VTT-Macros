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

async function attachSequencerFileToTemplate(templateUuid, originUuid, circle) {
  const template = await fromUuid(templateUuid);
  if (circle){
    new Sequence()
      .effect()
        .file("jb2a.energy_wall.01.circle.900x900.01.loop.orange")
        .size({
          width: canvas.grid.size * ((template.data.distance*2.25) / canvas.dimensions.distance),
          height: canvas.grid.size * ((template.data.distance*2.25) / canvas.dimensions.distance),
        })
        .persist(true)
        .origin(originUuid)
        .aboveLighting()
        .attachTo(template)
      .play();
  } else {
    const gridLine = canvas.grid.size * (template.distance / canvas.grid.grid.options.dimensions.distance);
    const x = template.x;
    const y = template.y;
    const theta = Math.toRadians(template.direction);
    const offset = 200;
    const destinationX = Math.floor(x + (Math.cos(theta) * (gridLine+offset)));
    const destinationY = Math.floor(y + (Math.sin(theta) * (gridLine+offset)));
    const reverseX = Math.floor(x - (Math.cos(theta) * offset));
    const reverseY = Math.floor(y - (Math.sin(theta) * offset));
    new Sequence()
      .effect()
        .file("jb2a.energy_wall.01.25x05ft.01.loop.orange")
        .persist(true)
        .origin(originUuid)
        .aboveLighting()
        .atLocation({x: reverseX, y: reverseY})
        .stretchTo({ x: destinationX, y: destinationY })
      .play();
  }
}

if (args[0].tag === "OnUse" && args[0].macroPass === "preActiveEffects") {
  const circle = DAE.getFlag(lastArg.actor, "Blade Barrier");
  attachSequencerFileToTemplate(lastArg.templateUuid, lastArg.itemUuid, circle);
  let flag = {bool: circle, id: lastArg.templateUuid};
  DAE.setFlag(lastArg.actor, "Blade Barrier", flag);

  return await AAhelpers.applyTemplate(args);
  
} else if (args[0] == "on") {
  const item = await fromUuid(lastArg.origin);
  const caster = item.parent;
  const target = canvas.tokens.get(lastArg.tokenId);
  const circle = DAE.getFlag(caster, "Blade Barrier");
  const template = await fromUuid(circle.id);

  const tracker = DAE.getFlag(target, "BB Tracker");
  let damaged = false;
  if (tracker != undefined){
    if(game.combat.turn == tracker.turn && game.combat.round == tracker.round){
      damaged = true;
    }
  }
  
  if (circle.bool && !damaged){
    let distance = canvas.grid.measureDistance({ x: template.x, y: template.y}, { x: target.center.x, y: target.center.y });
    if(distance >= 23){
      await rollItemDamage(target, item);
      DAE.setFlag(target, "BB Tracker", {turn: game.combat.turn, round: game.combat.round});
    }
  } else if (!damaged) {
    await rollItemDamage(target, item);
    DAE.setFlag(target, "BB Tracker", {turn: game.combat.turn, round: game.combat.round});
  }

  target.actor.effects.filter(effect => effect.label.includes("Blade Barrier"))[0].delete();
}