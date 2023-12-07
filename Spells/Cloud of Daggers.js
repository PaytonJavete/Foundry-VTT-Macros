const lastArg = args[args.length - 1];

async function rollItemDamage(targetToken, item, itemLevel) {
  const caster = item.parent;
  const damageDie = 4 + (Number(itemLevel)-2)*2;
  totalDamage = await new Roll(`${damageDie}d4[slashing]`).evaluate({ async: false });
  game.dice3d?.showForRoll(totalDamage);
  await MidiQOL.applyTokenDamage([{ damage: totalDamage.total, type: 'slashing' }], totalDamage.total, new Set([caster]), item, new Set());
}

async function attachSequencerFileToTemplate(templateUuid, originUuid) {
  if (game.modules.get("sequencer")?.active) {
    const templateM = await fromUuid(templateUuid);
    new Sequence()
      .effect()
        .file("jb2a.cloud_of_daggers.daggers.dark_red")
        .size({
          width: canvas.grid.size * ((templateM.data.distance*2) / canvas.dimensions.distance),
          height: canvas.grid.size * ((templateM.data.distance*2) / canvas.dimensions.distance),
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
} 
else if (args[0] == "on") {
  const item = await fromUuid(lastArg.efData.origin);
  const target = canvas.tokens.get(lastArg.tokenId);
  await rollItemDamage(target, item, args[1]);
}