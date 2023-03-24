const lastArg = args[args.length - 1];
console.log(lastArg);

uuid = lastArg.targetUuids[0];

if (lastArg.saves.length == 0){
	game.dfreds.effectInterface.addEffect({ effectName: 'Channel Divinity: Abjure Enemy', uuid });
} else {
	game.dfreds.effectInterface.addEffect({ effectName: 'Channel Divinity: Abjure Enemy (Success)', uuid });	
}