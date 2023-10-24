// This Macro is called by the Darkness spell so players can place walls and lights.
/*
Parameters passed:
  - state: ["on" or "off"]
  - darknessSpellParams: {
      x: template.x,
      y: template.y,
      targetActorId: targetActor.id,
  }
 */

function darknessLight(cx, cy) {
  const lightTemplate = {
    x: cx,
    y: cy,
    rotation: 0,
    walls: false,
    vision: false,
    config: {
      alpha: 0.5,
      angle: 0,
      bright: 15,
      coloration: 1,
      dim: 0,
      gradual: false,
      luminosity: -1,
      saturation: 0,
      contrast: 0,
      shadows: 0,
      animation: {
        speed: 5,
        intensity: 5,
        reverse: false,
      },
      darkness: {
        min: 0,
        max: 1,
      },
      color: null,
    },
    hidden: false,
    flags: {
      spellEffects: {
        Darkness: {
          ActorId: darknessSpellParams.targetActorId,
        },
      },
    },
  };
  canvas.scene.createEmbeddedDocuments("AmbientLight", [lightTemplate]);
}

if (state == "on") {
  darknessLight(darknessSpellParams.x, darknessSpellParams.y);
}

if (state == "off") {
  const darkLights = canvas.lighting.placeables.filter((w) => w.data.flags?.spellEffects?.Darkness?.ActorId === darknessSpellParams.targetActorId);
  const lightArray = darkLights.map((w) => w.id);
  await canvas.scene.deleteEmbeddedDocuments("AmbientLight", lightArray);
}