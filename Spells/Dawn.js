const lastArg = args[args.length - 1];
const template = await fromUuid(lastArg.templateUuid);
let size = canvas.grid.size * ((template.data.distance*3.5) / canvas.dimensions.distance);

new Sequence()
  .effect()
    .file("jb2a.portals.horizontal.vortex_masked.yellow")
    .size({width: size, height: size})
    .persist()
    .belowTokens()
    .attachTo(template)
  .play();

let params = {template: {x: template.data.x, y: template.data.y, uuid: template.uuid}, light_P: {dim: 0, bright: 30, color: null}};
const gmMacro = game.macros.find(m => m.name === "Attach Light to Template");
gmMacro.execute(params);

return await AAhelpers.applyTemplate(args);