const roll = await new Roll(`1d10`).roll();
const result = roll.total;
console.log(result);
const beholder = args[args.length - 1].actor;

let item = undefined;

switch(result){
	case 1:
		item = beholder.items.getName("Charm Ray");
		break;
	case 2:
		item = beholder.items.getName("Paralyzing Ray");
		break;
	case 3:
		item = beholder.items.getName("Fear Ray");
		break;
	case 4:
		item = beholder.items.getName("Slowing Ray");
		break;
	case 5:
		item = beholder.items.getName("Enervation Ray");
		break;
	case 6:
		item = beholder.items.getName("Telekinetic Ray");
		break;
	case 7:
		item = beholder.items.getName("Sleep Ray");
		break;
	case 8:
		item = beholder.items.getName("Petrification Ray");
		break;
	case 9:
		item = beholder.items.getName("Disintegration Ray");
		break;
	case 10:
		item = beholder.items.getName("Death Ray");
}

item.roll();