const lastArg = args[args.length-1];

if (args[0] == "off" && lastArg["expiry-reason"] == 'midi-qol:zeroHP'){
	let token = canvas.tokens.get(lastArg.tokenId);
	let centerPos = canvas.grid.getCenter(token.x, token.y);
	const measureTemplateData = {
	  t: "circle",
	  user: game.userId,
	  distance: 5,
	  direction: 0,
	  x: centerPos[0],
	  y: centerPos[1],
	  fillColor: game.user.color,
	  flags: {
	      limits: {
	        sight: {
	          basicSight: { enabled: true, range: 0 }, // Darkvision
	          lightPerception: { enabled: true, range: 0 }, // Light Perception
	        },
	      },
	    }
	};

	const doc = new CONFIG.MeasuredTemplate.documentClass(measureTemplateData, { parent: canvas.scene });
	canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [doc]);

	new Sequence()
        .effect()
          .file("jb2a.darkness.black")
          .size(220)
          .atLocation(token)
          .persist()
        .play();
}