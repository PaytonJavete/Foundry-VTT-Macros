const template = await fromUuid(args[0].templateUuid);
darknessLight(template.data.x, template.data.y, 15);
canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [template.id]);

function darknessLight(cx, cy, radius) {
  const lightTemplate = {
    x: cx,
    y: cy,
    rotation: 0,
    walls: false,
    vision: false,
    config: {
      alpha: 0.5,
      angle: 0,
      bright: radius,
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
      "perfect-vision": {
        sightLimit: 0,
      },
    },
  };
  canvas.scene.createEmbeddedDocuments("AmbientLight", [lightTemplate]);
}