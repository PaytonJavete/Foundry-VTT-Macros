// This Macro is called by the Wall of Force spell so players can place walls.

const wofParams = args[args.length - 1];

function circleWall(cx, cy, radius) {
  let walls = [];
  const step = 30;
  for (let i = step; i <= 360; i += step) {
    let theta0 = Math.toRadians(i - step);
    let theta1 = Math.toRadians(i);

    let lastX = Math.floor(radius * Math.cos(theta0) + cx);
    let lastY = Math.floor(radius * Math.sin(theta0) + cy);
    let newX = Math.floor(radius * Math.cos(theta1) + cx);
    let newY = Math.floor(radius * Math.sin(theta1) + cy);

    walls.push({
      c: [lastX, lastY, newX, newY],
      move: CONST.WALL_MOVEMENT_TYPES.NORMAL,
      light: CONST.WALL_SENSE_TYPES.NONE,
      sight: CONST.WALL_SENSE_TYPES.NONE,
      sound: CONST.WALL_SENSE_TYPES.NONE,
      dir: CONST.WALL_DIRECTIONS.BOTH,
      door: CONST.WALL_DOOR_TYPES.NONE,
      ds: CONST.WALL_DOOR_STATES.CLOSED,
      flags: {
        spellEffects: {
          WoF: {
            ActorId: wofParams.targetActorId,
          },
        },
      },
    });
  }

  canvas.scene.createEmbeddedDocuments("Wall", walls);
}

function lineWall(x, y, direction, gridLine){
  theta = Math.toRadians(direction);
  console.log(`Origin coordiantes: (${x}, ${y})`)
  destinationX = Math.floor(x + (Math.cos(theta) * gridLine));
  destinationY = Math.floor(y + (Math.sin(theta) * gridLine));
  console.log(`Destination coordiantes: (${destinationX}, ${destinationY})`)
  new Sequence()
        .effect()
            .file("modules/JB2A_DnD5e/Library/5th_Level/Wall_Of_Force/WallOfForce_01_Grey_V_200x25.webm")
            .atLocation({ x: x, y: y })
            .stretchTo({ x: destinationX, y: destinationY })
            .name("WoF")
            .persist()
        .play();

  walls = [];
  walls.push({
    c: [x, y, destinationX, destinationY],
    move: CONST.WALL_MOVEMENT_TYPES.NORMAL,
    light: CONST.WALL_SENSE_TYPES.NONE,
    sight: CONST.WALL_SENSE_TYPES.NONE,
    sound: CONST.WALL_SENSE_TYPES.NONE,
    dir: CONST.WALL_DIRECTIONS.BOTH,
    door: CONST.WALL_DOOR_TYPES.NONE,
    ds: CONST.WALL_DOOR_STATES.CLOSED,
    flags: {
      spellEffects: {
        WoF: {
          ActorId: wofParams.targetActorId,
        },
      },
    },
  });

  canvas.scene.createEmbeddedDocuments("Wall", walls);
}

if (args[0] == "on") {
  if (wofParams.hasOwnProperty('radius')){
      circleWall(wofParams.x, wofParams.y, wofParams.radius);
      new Sequence()
        .effect()
            .file("modules/JB2A_DnD5e/Library/5th_Level/Wall_Of_Force/WallOfForce_01_Grey_Sphere_400x400.webm")
            .atLocation({ x: wofParams.x, y: wofParams.y })
            .name("WoF")
            .persist()
        .play();
  }
  else {
    if (wofParams.isHorizontal){
      let theta = Math.toRadians(wofParams.direction);
      let destinationX = Math.floor(wofParams.x + (Math.cos(theta) * (0.5 * wofParams.gridLine)));
      let destinationY = Math.floor(wofParams.y + (Math.sin(theta) * (0.5 * wofParams.gridLine)));
      new Sequence()
        .effect()
            .file("modules/JB2A_DnD5e/Library/5th_Level/Wall_Of_Force/WallOfForce_01_Grey_H_200x200.webm")
            .atLocation({ x: destinationX, y: destinationY })
            .name("WoF")
            .persist()
        .play();
    }
    else {
      lineWall(wofParams.x, wofParams.y, wofParams.direction, wofParams.gridLine);
    }
  }
}

if (args[0] == "off") {
  actorId = wofParams.targetActorId
  let wofWalls = canvas.walls.placeables.filter(wall => wall.document.flags?.spellEffects?.WoF.ActorId == actorId);
  const wallArray = wofWalls.map((w) => w.id);
  await canvas.scene.deleteEmbeddedDocuments("Wall", wallArray);
  Sequencer.EffectManager.endEffects({ name: "WoF" });
}