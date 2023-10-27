const lastArg = args[args.length-1];
const tokenM = canvas.tokens.get(lastArg.tokenId);
const actorM = tokenM.actor;
const firstCast = lastArg.item.system.components.concentration;
const templateM = await fromUuid(lastArg.templateUuid);

// save damage data
if (firstCast){
	const isStorm = await DAE.getFlag(actorM, "CallLightning");
	let die = lastArg.spellLevel;
	if (isStorm) die += 1;
	await DAE.setFlag(actorM, "CallLightning", die);

	if (!isStorm){
		let size = canvas.grid.size * ((60*2.3) / canvas.dimensions.distance);
		new Sequence()
		    .effect()
		    	.size({width: size, height: size})
		        .file("jb2a.call_lightning.low_res.blue")
		        .opacity(0.8)
		        .attachTo(templateM)
		        .persist()
		        .aboveLighting()
		        .origin(lastArg.tokenUuid)
		        .name("Call Lightning")
			.play()
	}
}
else {
	let size = canvas.grid.size * ((40*2.3) / canvas.dimensions.distance);
	new Sequence()
	    .effect()
	    	.size({width: size, height: size})
	        .file("jb2a.lightning_strike.blue")
	        .playbackRate(0.8)
	        .atLocation(templateM)
		.play()
	canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [templateM.id]);
}