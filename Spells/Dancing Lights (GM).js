/* 
Parameters passed:
  - state: ["on" or "off"]
  - dlSpellParams: {
      x: template.data.x,
      y: template.data.y,
      lightColor: color,
      targetActorId: targetActor.id,
  }
 */

function dancingLight(cx, cy, color) {
  const lightTemplate = {
    x: cx,
    y: cy,
    rotation: 0,
    walls: false,
    vision: false,
    config: {
      alpha: 0.2,
      angle: 360,
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
          ActorId: dlSpellParams.targetActorId,
        },
      },
    },
  };
  canvas.scene.createEmbeddedDocuments("AmbientLight", [lightTemplate]);
}

if (state === "on") {
  dancingLight(dlSpellParams.x, dlSpellParams.y, dlSpellParams.lightColor)
}

if (state === "off") {
  const dancingLights = canvas.lighting.placeables.filter((w) => w.document.flags?.spellEffects?.DancingLights?.ActorId === dlSpellParams.targetActorId);
  const lightArray = dancingLights.map((w) => w.id);
  await canvas.scene.deleteEmbeddedDocuments("AmbientLight", lightArray);
}