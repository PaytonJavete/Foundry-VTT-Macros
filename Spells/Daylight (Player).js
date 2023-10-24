if (!game.modules.get("advanced-macros")?.active) ui.notifications.error("Please enable the Advanced Macros module");

const lastArg = args[args.length - 1];
const tokenOrActor = await fromUuid(lastArg.actorUuid);
const targetActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;

const gmMacroName = "Daylight (GM)";

if (args[0] === "on") {
  Hooks.once("createMeasuredTemplate", async (template) => {
    const daylightSpellParams = {
      x: template.x,
      y: template.y,
      targetActorId: targetActor.id,
    };
    await DAE.setFlag(targetActor, "daylightSpell", daylightSpellParams);
    canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [template.id]);
    const gmMacro = game.macros.find(m => m.name === gmMacroName);
    gmMacro.execute({state: "on", daylightSpellParams});
  });

  const measureTemplateData = {
    t: "circle",
    user: game.userId,
    distance: 60,
    direction: 0,
    x: 0,
    y: 0,
    fillColor: game.user.color,
    flags: {
      spellEffects: {
        Daylight: {
          ActorId: targetActor.id,
        },
      },
    },
  };

  const doc = new CONFIG.MeasuredTemplate.documentClass(measureTemplateData, { parent: canvas.scene });
  const measureTemplate = new game.dnd5e.canvas.AbilityTemplate(doc);
  measureTemplate.actorSheet = targetActor.sheet;
  measureTemplate.drawPreview();
}

if (args[0] === "off") {
  const daylightSpellParams = await DAE.getFlag(targetActor, "daylightSpell");
  const gmMacro = game.macros.find(m => m.name === gmMacroName);
  gmMacro.execute({state: "off", daylightSpellParams});
  await DAE.unsetFlag(targetActor, "daylightSpell");
}