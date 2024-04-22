if (args[0] === "off"){
	const lastArg = args[args.length - 1];
	let token = canvas.tokens.get(lastArg.tokenId);

	let center = canvas.grid.getCenter(token.x, token.y);
	let position = {x: center[0], y: center[1]};
	let size = canvas.grid.size;
	let listPositions = [];

	//left 2
	listPositions.push({x: position.x-size, y: position.y});
	listPositions.push({x: position.x-size, y: position.y+size});

	//center left 4
	listPositions.push({x: position.x, y: position.y-size});
	listPositions.push(position);
	listPositions.push({x: position.x, y: position.y+size});
	listPositions.push({x: position.x, y: position.y+(2*size)});

	//center right 4
	listPositions.push({x: position.x+size, y: position.y-size});
	listPositions.push({x: position.x+size, y: position.y});
	listPositions.push({x: position.x+size, y: position.y+size});
	listPositions.push({x: position.x+size, y: position.y+(2*size)});

	//right 2
	listPositions.push({x: position.x+(2*size), y: position.y});
	listPositions.push({x: position.x+(2*size), y: position.y+size});

	for (pos of listPositions){	
		await warpgate.spawnAt(pos, "Skeleton");
	}

	await warpgate.dismiss(lastArg.tokenId);
}