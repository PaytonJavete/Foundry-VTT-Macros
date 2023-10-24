if (!game.modules.get("advanced-macros")?.active) ui.notifications.error("Please enable the Advanced Macros module");

const lastArg = args[args.length - 1];
const tokenOrActor = await fromUuid(lastArg.actorUuid);
const targetActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;

const gmMacroName = "Darkness (GM)";

if (args[0] === "on") {
  Hooks.once("createMeasuredTemplate", async (template) => {
    const darknessSpellParams = {
      x: template.data.x,
      y: template.data.y,
      targetActorId: targetActor.id,
    };
    await DAE.setFlag(targetActor, "darknessSpell", darknessSpellParams);
    const gmMacro = game.macros.find(m => m.name === gmMacroName);
    gmMacro.execute({state: "on", darknessSpellParams});
  });

  const measureTemplateData = {
    t: "circle",
    user: game.userId,
    distance: 15,
    direction: 0,
    x: 0,
    y: 0,
    fillColor: game.user.color,
    flags: {
      spellEffects: {
        Darkness: {
          ActorId: targetActor.id,
        },
      },
      limits: {
        sight: {
          basicSight: { enabled: true, range: 0 }, // Darkvision
          ghostlyGaze: { enabled: true, range: 0 }, // Ghostly Gaze
          lightPerception: { enabled: true, range: 0 }, // Light Perception
        },
        light: { enabled: true, range: 0 },
      },
    },
  };

  const doc = new CONFIG.MeasuredTemplate.documentClass(measureTemplateData, { parent: canvas.scene });
  const measureTemplate = new game.dnd5e.canvas.AbilityTemplate(doc);
  measureTemplate.actorSheet = targetActor.sheet;
  measureTemplate.drawPreview();
}

if (args[0] === "off") {
  const darknessSpellParams = await DAE.getFlag(targetActor, "darknessSpell");
  const gmMacro = game.macros.find(m => m.name === gmMacroName);
  gmMacro.execute({state: "off", darknessSpellParams});
  await DAE.unsetFlag(targetActor, "darknessSpell");
}