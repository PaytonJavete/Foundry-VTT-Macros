const lastArg = args[args.length - 1];
const token = await fromUuid(lastArg.tokenUuid);

new Sequence()
	.effect()
	  .file("modules/jb2a_patreon/Library/Cantrip/Toll_The_Dead/TollTheDeadShockwave_01_Regular_Blue_400x400.webm")
	  .size({
	    width: canvas.grid.size * (25 / canvas.dimensions.distance),
	    height: canvas.grid.size * (25 / canvas.dimensions.distance),
	  })
	  .atLocation(token)
	.play();