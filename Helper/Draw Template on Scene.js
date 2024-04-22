const measureTemplateData = {
  t: "cone",
  user: game.userId,
  distance: 30,
  direction: 270,
  x: 3200,
  y: 3300,
  hidden: true,
  fillColor: game.user.color,
  flags: {
    spellEffects: {
      WoF: {
        ActorId: actor.id,
      },
    },
  },
};

const doc = new CONFIG.MeasuredTemplate.documentClass(measureTemplateData, { parent: canvas.scene });
canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [doc]);