const lastArg = args[args.length - 1];

async function attachSequencerFileToTemplate(templateUuid, originUuid) {
  if (game.modules.get("sequencer")?.active) {
    const template = await fromUuid(templateUuid);
    new Sequence()
    .effect()
      .file("modules/JB2A_DnD5e/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Purple_600x600.webm")
      .size({
        width: canvas.grid.size * ((template.distance) / canvas.dimensions.distance),
        height: canvas.grid.size * ((template.distance) / canvas.dimensions.distance),
      })
      .persist(true)
      .origin(originUuid)
      .atLocation({x: template.x, y: template.y})
      .attachTo(template)
    .play();
  }
}

if (args[0].tag === "OnUse" && args[0].macroPass === "preActiveEffects") {
  attachSequencerFileToTemplate(lastArg.templateUuid, lastArg.itemUuid);

  return await AAhelpers.applyTemplate(args);
}