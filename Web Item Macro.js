const lastArg = args[args.length - 1];

async function attachSequencerFileToTemplate(templateUuid, originUuid) {
  if (game.modules.get("sequencer")?.active) {
    const template = await fromUuid(templateUuid);
    theta = Math.toRadians(template.direction);
    gridLine = canvas.grid.size * (template.distance / 2 / canvas.grid.grid.options.dimensions.distance);
    midpointX = Math.floor(template.x + (Math.cos(theta) * gridLine))
    midpointY = Math.floor(template.y + (Math.sin(theta) * gridLine));
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
      .atLocation({x: midpointX, y: midpointY})
      .rotate(360 - (template.direction - 45))
    .play();
  }
}

if (args[0].tag === "OnUse" && args[0].macroPass === "preActiveEffects") {
  attachSequencerFileToTemplate(lastArg.templateUuid, lastArg.itemUuid);

  return await AAhelpers.applyTemplate(args);
}