const lastArg = args[args.length - 1];
uuid = lastArg.targetUuids[0];

if (lastArg.saves.length == 0){
	game.dfreds.effectInterface.addEffect({ effectName: 'Channel Divinity: Abjure Enemy (Fail)', uuid });
} else {
	game.dfreds.effectInterface.addEffect({ effectName: 'Channel Divinity: Abjure Enemy (Success)', uuid });	
}