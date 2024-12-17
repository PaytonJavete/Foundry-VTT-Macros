const lastArg = args[args.length-1];
const caster = canvas.tokens.get(lastArg.tokenId);
const target = canvas.tokens.get(lastArg.targets[0].id);

let casterX = caster.document.x;
let casterY = caster.document.y;
let targetX = target.document.x;
let targetY = target.document.y;

let stepX = casterX - targetX;
let stepY = casterY - targetY;

let increment = 5;

while (stepX != 0 || stepY != 0){
	if (stepX < 0){
		casterX += increment;
		targetX -= increment;
		caster.document.update({x: casterX});
		target.document.update({x: targetX});
		stepX += increment;
		if (stepX > 0) break;
	}

	if (stepX > 0){
		casterX -= increment;
		targetX += increment;
		caster.document.update({x: casterX});
		target.document.update({x: targetX});
		stepX -= increment;
		if (stepX < 0) break;
	}

	if (stepY < 0){
		casterY += increment;
		targetY -= increment;
		caster.document.update({y: casterY});
		target.document.update({y: targetY});
		stepY += increment;
		if (stepY > 0) break;
	}

	if (stepY > 0){
		casterY -= increment;
		targetY += increment;
		caster.document.update({y: casterY});
		target.document.update({y: targetY});
		stepY -= increment;
		if (stepY < 0) break;
	}
}