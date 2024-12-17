/* 
Parameters passed:
  - template: {x: [x value of template], y: [y value of template], uuid: [template uuid]}
  - light_P: {dim: [int], bright: [int], color: [color hex], darkness: [bool]}};
 */

light = await createLight(light_P, template.x, template.y);

let updateHook = Hooks.on("updateMeasuredTemplate", (template) => templateUpdated(template));
let deleteHook = Hooks.on("preDeleteMeasuredTemplate", (template) => templateDeleted(template));

async function templateUpdated(templateDocument){
    if(templateDocument.uuid !== template.uuid) return;
    await light.update({x: templateDocument.x, y: templateDocument.y});
}

async function templateDeleted(templateDocument){
    if(templateDocument.uuid !== template.uuid) return;
    await light.delete();
    Hooks.off("updateMeasuredTemplate", updateHook);
    Hooks.off("preDeleteMeasuredTemplate", deleteHook);
}

async function createLight(args, cx, cy){
  const lightTemplate = {
    x: cx,
    y: cy,
    rotation: 0,
    walls: false,
    vision: false,
    config: {
      alpha: 0.5,
      angle: 360,
      bright: args.bright,
      coloration: 1,
      dim: args.dim,
      gradual: false,
      luminosity: 0.5,
      negative: args?.darkness,
      saturation: 0,
      contrast: 0,
      shadows: 0,
      animation: {
        speed: 5,
        intensity: 5,
        reverse: false,
      },
      color: args.color,
    },
    hidden: false,
  };
  [light] = await canvas.scene.createEmbeddedDocuments("AmbientLight", [lightTemplate]);
  return light;
}