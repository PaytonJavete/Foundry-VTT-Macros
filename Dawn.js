if (!game.modules.get("advanced-macros")?.active) {
  ui.notifications.error("Advanced Macros is not enabled");
  return;
} else if(!game.modules.get("ActiveAuras")?.active) {
  ui.notifications.error("ActiveAuras is not enabled");
  return;
}

if (args[0].tag === "OnUse" && args[0].macroPass === "preActiveEffects") {
  const lastArg = args[args.length - 1];
  const template = await fromUuid(lastArg.templateUuid);
  new Sequence()
    .effect()
      .file("jb2a.portals.horizontal.vortex_masked.yellow")
      .size({
        width: canvas.grid.size * ((template.data.distance*3.5) / canvas.dimensions.distance),
        height: canvas.grid.size * ((template.data.distance*3.5) / canvas.dimensions.distance),
      })
      .persist(true)
      .belowTokens()
      .origin(lastArg.itemUuid)
      .atLocation({x: template.data.x, y: template.data.y})
      .attachTo(template)
    .play();

  let params = {template: {x: template.data.x, y: template.data.y, uuid: template.uuid}, light: {dim: 0, bright: 30, color: null}};
  const gmMacro = game.macros.find(m => m.name === "Attach Light to Template");
  gmMacro.execute(params);

  return await AAhelpers.applyTemplate(args);
}