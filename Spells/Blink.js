const lastArg = args[args.length-1];
const target = canvas.tokens.get(lastArg.tokenId);
console.log(args);

if (args[0].tag == "OnUse" && args[0].item.name.includes("End")){
	let blinkRoll = await new Roll("1d20").evaluate({async: true});
	await game.dice3d.showForRoll(blinkRoll);
	let rollTotal = blinkRoll.total;
	console.log(rollTotal);
	if (rollTotal >= 11) target.data.update({ "hidden": true });
}
else if (args[0].tag == "OnUse" && args[0].item.name.includes("Start")){
	if (!target.data.hidden) return;

	const userColor = game.user?.color ? "0x" + game.user.color.replace(/^#/, '') : 0x0D26FF;
	const range = 10;
	const tokenWidth = target.data.width;
	let startX = target.x;
	let startY = target.y;

	let aaSeq01 = await new Sequence()
	aaSeq01.effect()
	    .file("modules/autoanimations/animationPNG/teleportCircle.png")
	    .atLocation(target)
	    .size(((tokenWidth / canvas.grid.size) + 0.5 + (range / canvas.dimensions.distance)) * 2, { gridUnits: true })
	    .fadeIn(500)
	    .scaleIn(0, 500)
	    .fadeOut(500)
	    .name("teleportation")
	    //.elevation(target?.document?.elevation - 1)
	    .persist(true)
	    .opacity(0.5)
	    .filter("Glow", {
	        distance: 10,
	        outerStrength: 5,
	        innerStrength: 5,
	        color: userColor,
	        quality: 0.2,
	    })
	    //.forUsers(hideBorder)
	aaSeq01.play()

	let pos;
	canvas.app.stage.addListener('pointerdown', event => {
	    if (event.data.button !== 0) { return }
	    pos = event.data.getLocalPosition(canvas.app.stage);

	    let topLeft = canvas.grid.getTopLeft(pos.x, pos.y);

	    if (canvas.grid.measureDistance({ x: startX, y: startY}, { x: topLeft[0], y: topLeft[1] }, { gridSpaces: true }) <= range) {
	    	target.data.update({ "hidden": false });
	    	let gridPos = canvas.grid.getTopLeft(pos.x, pos.y);
    		let centerPos = canvas.grid.getCenter(pos.x, pos.y);
    		let tokenCenter = canvas.grid.getCenter(startX, startY);		
	        deleteTemplatesAndMove(gridPos, centerPos, tokenCenter, tokenWidth, target);
	        canvas.app.stage.removeListener('pointerdown');
	    } else {
	        ui.notifications.warn("Blink: Out of range");
	    }
	});
}
else if (args[0] == "off"){
	target.data.update({ "hidden": false });
}

async function deleteTemplatesAndMove(gridPos, centerPos, tokenCenter, tokenWidth, target) {
    Sequencer.EffectManager.endEffects({ name: "teleportation" });

    let offset = (tokenWidth-1) * (canvas.grid.size / 2);

    console.log(gridPos);
    console.log(centerPos);
    console.log(tokenCenter);
    console.log(tokenWidth);

    let aaSeq = new Sequence();

    // Start Animation
    let startEffect = aaSeq.effect();
    startEffect.file('jb2a.smoke.puff.centered.blue');
    startEffect.atLocation({x: tokenCenter[0]+offset, y: tokenCenter[1]+offset});   
    startEffect.size(tokenWidth * 1.5, { gridUnits: true });

    // End Animation
    let endEffect = aaSeq.effect();
    endEffect.file('jb2a.smoke.puff.centered.blue');
    endEffect.atLocation({ x: centerPos[0]+offset, y: centerPos[1]+offset });
    endEffect.size(tokenWidth * 1.5, { gridUnits: true });

    // Move Token
    let animSeq = aaSeq.animation();
    animSeq.on(target);
    //animSeq.fadeOut(data.start.options.tokenOut)
    animSeq.teleportTo({ x: gridPos[0], y: gridPos[1] });

    aaSeq.play();
}