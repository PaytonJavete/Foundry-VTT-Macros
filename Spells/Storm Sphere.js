AAhelpers.applyTemplate(args);

const lastArg = args[args.length - 1];
const template = await fromUuid(lastArg.templateUuid);
template.update({"flags":{"Storm Sphere":{"id":lastArg.actor._id, "spellLevel": lastArg.spellLevel}}});

let size = canvas.grid.size * ((template.distance*2.3) / canvas.dimensions.distance);
new Sequence()
  .effect()
    .file("jb2a.call_lightning.low_res.purple")
    .size({width: size, height: size})
    .persist(true)
    .opacity(0.5)
    .origin(lastArg.itemUuid)
    .attachTo(template)
  .play();