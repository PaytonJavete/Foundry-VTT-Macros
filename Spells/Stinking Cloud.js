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
  template.update({"flags.perfect-vision.visionLimitation": { "sight": 0, "enabled": true}});
  new Sequence()
    .effect()
      .file("modules/jb2a_patreon/Library/1st_Level/Fog_Cloud/FogCloud_02_Regular_Green02_800x800.webm")
      .size({
        width: canvas.grid.size * ((template.distance*2.5) / canvas.dimensions.distance),
        height: canvas.grid.size * ((template.distance*2.5) / canvas.dimensions.distance),
      })
      .persist(true)
      .aboveLighting()
      .origin(lastArg.itemUuid)
      .atLocation({x: template.x, y: template.y})
      .attachTo(template)
    .play();

  return await AAhelpers.applyTemplate(args);
}