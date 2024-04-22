const lastArg = args[args.length - 1];
if (lastArg.failedSaves.length > 0){
	let center = canvas.grid.getCenter(lastArg.failedSaves[0].x, lastArg.failedSaves[0].y);
	let position = {x: center[0], y: center[1]};
	await warpgate.spawnAt(position, "Shadow");
}