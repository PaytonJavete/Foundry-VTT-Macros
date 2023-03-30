// This Macro is called by the Darkness spell so players can place walls and lights.

const daylightParams = args[args.length - 1];

function daylightLight(cx, cy, radius) {
  const lightTemplate = {
    x: cx,
    y: cy,
    rotation: 0,
    walls: true,
    vision: false,
    config: {
      alpha: 0.5,
      angle: 0,
      bright: radius,
      coloration: 1,
      dim: radius,
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
      color: null,
    },
    hidden: false,
    flags: {
      spellEffects: {
        Daylight: {
          ActorId: daylightParams.targetActorId,
        },
      },
    },
  };
  canvas.scene.createEmbeddedDocuments("AmbientLight", [lightTemplate]);
}

if (args[0] == "on") {
  daylightLight(daylightParams.x, daylightParams.y, daylightParams.distance);
  const darkLights = canvas.lighting.placeables.filter((w) => w.data.flags?.spellEffects?.Darkness);
  if (darkLights.length > 0){
    const lightArray = [];
    for (darkness of darkLights){
      if (canvas.grid.measureDistance({ x: daylightParams.x, y: daylightParams.y}, { x: darkness.x, y: darkness.y }) <= 120){
        lightArray.push(darkness.id);
      }
    }
    await canvas.scene.deleteEmbeddedDocuments("AmbientLight", lightArray);   
  }
}

if (args[0] == "off") {
  const dayLights = canvas.lighting.placeables.filter((w) => w.data.flags?.spellEffects?.Daylight?.ActorId === daylightParams.targetActorId);
  const lightArray = dayLights.map((w) => w.id);
  await canvas.scene.deleteEmbeddedDocuments("AmbientLight", lightArray);
}