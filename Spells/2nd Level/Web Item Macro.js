const lastArg = args[args.length - 1];

async function attachSequencerFileToTemplate(templateUuid, originUuid) {
  if (game.modules.get("sequencer")?.active) {
    const template = await fromUuid(templateUuid);
    new Sequence()
    .effect()
      .file("modules/JB2A_DnD5e/Library/2nd_Level/Web/Web_01_White_01_400x400.webm")
      .size({
        width: canvas.grid.size * ((template.distance*0.8) / canvas.dimensions.distance),
        height: canvas.grid.size * ((template.distance*0.8) / canvas.dimensions.distance),
      })
      .persist(true)
      .belowTokens()
      .origin(originUuid)
      .attachTo(template)
    .play();
  }
}

if (args[0].tag === "OnUse" && args[0].macroPass === "preActiveEffects") {
  attachSequencerFileToTemplate(lastArg.templateUuid, lastArg.itemUuid);

  return await AAhelpers.applyTemplate(args);
}