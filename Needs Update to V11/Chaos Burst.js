if (args[0] == 'off'){
	token = canvas.tokens.get(args[2].tokenId);

	let objUpdate = new Object();
	objUpdate['data.attributes.hp.value'] = 115;
	token.actor.update(objUpdate);

	possibleTokens = canvas.tokens.objects.children.filter(token => token.data.disposition == 1);
	spells = token.actor.items.filter(item => item.type == "spell");

	targetList = [];
	for (let target of possibleTokens){
		targetDistance = findDistance(token, target);
		targetList.push({'target': target, 'distance': targetDistance});
	}
	targetList.push({'target': token, 'distance': 0});

	for (let spell of spells){
		range = spell.data.data.range;
		name = 	spell.data.name;	
		if (range.value == null){
			if (range.units == "self"){
				target = spell.data.data.target;
				if(target.type == "self"){
					console.log(`Target is self for ${name}`);
					continue;					
				}
				if (target.value != null){
					range = target.value;
				} else {
					return ui.notifications.error(`Unexpected target for spell: ${name}`);
				}
			} else if (range.units == "touch"){
				range = 10;
			} else {
				return ui.notifications.error(`Unexpected range for spell: ${name}`);
			}
		} else {
			range = range.value;
		}
	    console.log(`Range of ${name}: ${range}ft.`);
		viableTargets = targetList.filter(target => target.distance <= range);
		numTargets = viableTargets.length;
		if (numTargets == 0){
			console.log(`No viable targets for ${name}`);
		} else if (numTargets == 1){
			console.log(`The only viable target for ${name} is ${viableTargets[0].target.data.name}`)
		} else {
			randomIndex = Math.floor(Math.random() * numTargets);
			console.log(`The target selected for ${name} is ${viableTargets[randomIndex].target.data.name}`)
		}
	}

}

function findDistance(origin, target){
	originPoint = origin.center;
	targetPoint = target.center;
	x = targetPoint.x - originPoint.x;
	y = targetPoint.y - originPoint.y;
	distance = Math.sqrt((x * x) + (y * y));

	if (target.data.elevation != origin.data.elevation){
		z = Math.abs(target.data.elevation - origin.data.elevation) * canvas.grid.size;
		distance = Math.sqrt((distance * distance) + (z * z));
	}

	offset = (origin.data.width-1) * 2.5;
	distance = ((distance / canvas.grid.size) * 5) - offset;
	distance = Math.round(distance / 5) * 5;
	console.log(`Distance from ${origin.data.name} to ${target.data.name}: ${distance}ft.`);
	return distance;
}