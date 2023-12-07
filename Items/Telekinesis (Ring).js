const lastArg = args[args.length - 1];
const target = lastArg.targets[0];
const caster = await fromUuid(lastArg.tokenUuid);

new Sequence()
  .effect()
    .file("jb2a.boulder.toss.02.01.stone.brown")
    .atLocation(caster)
    .stretchTo(target)
    .waitUntilFinished(-100)
  .effect()
    .file("jb2a.impact.boulder.02")
    .atLocation(target)
  .play();
