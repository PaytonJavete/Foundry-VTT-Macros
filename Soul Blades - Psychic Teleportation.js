const lastArg = args[args.length - 1];
const sourceToken = await fromUuid(lastArg.tokenUuid);

const userColor = game.user?.color ? "0x" + game.user.color.replace(/^#/, '') : 0x0D26FF;
const range = lastArg.damageTotal * 10;
const tokenWidth = sourceToken.width;
let startX = sourceToken.x;
let startY = sourceToken.y;

let aaSeq01 = await new Sequence()
aaSeq01.effect()
    .file("modules/autoanimations/animationPNG/teleportCircle.png")
    .atLocation(sourceToken)
    .size(((tokenWidth / canvas.grid.size) + 0.5 + (range / canvas.dimensions.distance)) * 2, { gridUnits: true })
    .fadeIn(500)
    .scaleIn(0, 500)
    .fadeOut(500)
    .name("teleportation")
    //.elevation(sourceToken?.document?.elevation - 1)
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
        deleteTemplatesAndMove();
        canvas.app.stage.removeListener('pointerdown');
    } else {
        ui.notifications.warn("Psychic Teleportaion: Out of range");
    }
});

async function deleteTemplatesAndMove() {
    let gridPos = canvas.grid.getTopLeft(pos.x, pos.y);
    let centerPos = canvas.grid.getCenter(pos.x, pos.y);
    let tokenCenter = canvas.grid.getCenter(startX, startY);

    Sequencer.EffectManager.endEffects({ name: "teleportation" })

    let aaSeq = new Sequence();

    // Start Animation
    let startEffect = aaSeq.effect()
    startEffect.file("modules/animated-spell-effects/spell-effects/magic/magic_explosion_CIRCLE_05.webm")
    startEffect.atLocation({x: tokenCenter[0], y: tokenCenter[1]})    
    startEffect.size(tokenWidth * 1.5, { gridUnits: true })

    // End Animation
    let endEffect = aaSeq.effect()
    endEffect.file("modules/animated-spell-effects/spell-effects/air/smoke_explosion_CIRCLE_01.webm")
    endEffect.atLocation({ x: centerPos[0], y: centerPos[1] })
    endEffect.size(tokenWidth * 1.5, { gridUnits: true })

    // Move Token
    let animSeq = aaSeq.animation()
    animSeq.on(sourceToken)
    //animSeq.fadeOut(data.start.options.tokenOut)
    animSeq.teleportTo({ x: gridPos[0], y: gridPos[1] })

    aaSeq.play()
};