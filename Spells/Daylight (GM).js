// This Macro is called by the Darkness spell so players can place walls and lights.
/* 
Parameters passed:
  - state: ["on" or "off"]
  - daylightSpellParams: {
      x: template.x,
      y: template.y,
      targetActorId: targetActor.id,
  }
 */

function daylightLight(cx, cy) {
  const lightTemplate = {
    x: cx,
    y: cy,
    rotation: 0,
    walls: true,
    vision: false,
    config: {
      alpha: 0.5,
      angle: 0,
      bright: 60,
      coloration: 1,
      dim: 120,
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
          ActorId: daylightSpellParams.targetActorId,
        },
      },
    },
  };
  canvas.scene.createEmbeddedDocuments("AmbientLight", [lightTemplate]);
}

if (state == "on") {
  daylightLight(daylightSpellParams.x, daylightSpellParams.y);
  const darkLights = canvas.lighting.placeables.filter((w) => w.data.flags?.spellEffects?.Darkness);
  if (darkLights.length > 0){
    const lightArray = [];
    for (darkness of darkLights){
      if (canvas.grid.measureDistance({ x: daylightSpellParams.x, y: daylightSpellParams.y}, { x: darkness.x, y: darkness.y }) <= 120){
        lightArray.push(darkness.id);
      }
    }
    await canvas.scene.deleteEmbeddedDocuments("AmbientLight", lightArray);   
  }
}

if (state == "off") {
  const dayLights = canvas.lighting.placeables.filter((w) => w.data.flags?.spellEffects?.Daylight?.ActorId === daylightSpellParams.targetActorId);
  const lightArray = dayLights.map((w) => w.id);
  await canvas.scene.deleteEmbeddedDocuments("AmbientLight", lightArray);
}