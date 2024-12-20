//##############################################################################################################################
// Call Macro
// - Under item 'Details'
// - On Use Macros : After Active Effects
// Variables (search and replace)
// - RANGE : range of telportation
// - NAME : name of ability
// - START_EFFECT : animation at original location
// - END_EFFECT : animation at target location
//##############################################################################################################################

const lastArg = args[args.length - 1];
const sourceToken = await fromUuid(lastArg.tokenUuid);

const userColor = game.user?.color ? "0x" + game.user.color.css.replace(/^#/, '') : 0x0D26FF;
const range = RANGE;
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
    .name("teleportation - NAME")
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
        ui.notifications.warn("NAME: Out of range");
    }
});

async function deleteTemplatesAndMove() {
    let gridPos = canvas.grid.getTopLeft(pos.x, pos.y);
    let centerPos = canvas.grid.getCenter(pos.x, pos.y);
    let tokenCenter = canvas.grid.getCenter(startX, startY);
    let offset = (tokenWidth-1) * (canvas.grid.size / 2);

    Sequencer.EffectManager.endEffects({ name: "teleportation - NAME" })

    let aaSeq = new Sequence();

    // Start Animation
    let startEffect = aaSeq.effect()
    startEffect.file("START_EFFECT")
    startEffect.atLocation({x: tokenCenter[0]+offset, y: tokenCenter[1]+offset})    
    startEffect.size(tokenWidth * 1.5, { gridUnits: true })

    // End Animation
    let endEffect = aaSeq.effect()
    endEffect.file("END_EFFECT")
    endEffect.atLocation({ x: centerPos[0]+offset, y: centerPos[1]+offset })
    endEffect.size(tokenWidth * 1.5, { gridUnits: true })

    // Move Token
    let animSeq = aaSeq.animation()
    animSeq.on(sourceToken)
    //animSeq.fadeOut(data.start.options.tokenOut)
    animSeq.teleportTo({ x: gridPos[0], y: gridPos[1] })

    aaSeq.play()
};