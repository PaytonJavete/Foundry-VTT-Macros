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
  template.update({"flags":{"Storm Sphere":{"id":lastArg.actor._id, "spellLevel": lastArg.spellLevel}}});
  new Sequence()
    .effect()
      .file("modules/JB2A_DnD5e/Library/3rd_Level/Call_Lightning/CallLightning_01_Purple_1000x1000.webm")
      .size({
        width: canvas.grid.size * ((template.distance*2) / canvas.dimensions.distance),
        height: canvas.grid.size * ((template.distance*2) / canvas.dimensions.distance),
      })
      .persist(true)
      .opacity(0.5)
      .origin(lastArg.itemUuid)
      .atLocation({x: template.x, y: template.y})
      .attachTo(template)
    .play();

  return await AAhelpers.applyTemplate(args);
}