async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const lastArg = args[args.length-1];
let size = canvas.grid.size * ((5*2) / canvas.dimensions.distance);
let token = canvas.tokens.get(lastArg.tokenId);
if(args[0] === "on"){
	new Sequence()
	    .effect()
	    	.size({width: size, height: size})
	        .file("jb2a.shield.01.intro.blue")
	        .atLocation(token)
	    .waitUntilFinished(-1000)
	    .effect()
	    	.size({width: size, height: size})
	        .file("jb2a.shield.01.loop.blue")
	        .attachTo(token)
	        .persist()
	        .origin(lastArg.tokenUuid)
	        .name("Fizban PS")
	    .play()
} else if (args[0] === "off"){		
	new Sequence()
	    .effect()
	    	.size({width: size, height: size})
	        .file("jb2a.shield.01.outro_fade.blue")
	        .atLocation(token)
	    .play()
	await wait(1000);
	await Sequencer.EffectManager.endEffects({ name: "Fizban PS", origin: lastArg.tokenUuid });
}