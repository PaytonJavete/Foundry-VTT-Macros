const dlParams = args[args.length - 1];
const actorId = dlParams.targetActorId

function dancingLight(cx, cy, color) {
  const lightTemplate = {
    x: cx,
    y: cy,
    rotation: 0,
    walls: false,
    vision: false,
    config: {
      alpha: 0.2,
      angle: 0,
      bright: 0,
      coloration: 1,
      dim: 10,
      gradual: false,
      luminosity: 0.5,
      saturation: 0,
      contrast: 0,
      shadows: 0,
      animation: {
        speed: 5,
        intensity: 5,
        reverse: false,
      },
      color: color,
    },
    hidden: false,
    flags: {
      spellEffects: {
        DancingLights: {
          ActorId: actorId,
        },
      },
    },
  };
  canvas.scene.createEmbeddedDocuments("AmbientLight", [lightTemplate]);
}

if (args[0] === "on") {
  dancingLight(dlParams.x, dlParams.y, dlParams.lightColor)
}

if (args[0] === "off") {
  const dancingLights = canvas.lighting.placeables.filter((w) => w.data.flags?.spellEffects?.DancingLights?.ActorId === actorId);
  const lightArray = dancingLights.map((w) => w.id);
  await canvas.scene.deleteEmbeddedDocuments("AmbientLight", lightArray);
}