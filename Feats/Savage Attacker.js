lastArg = args[args.length-1];
token = canvas.tokens.get(lastArg.tokenId);
actor = token.actor;

if (!["mwak"].includes(lastArg.itemData.system.actionType)) return {}; // melee weapon attack

if (lastArg.hitTargets.length == 0) return {}; // is a hit

if (game.combat) {
  const combatTime = `${game.combat.id}-${game.combat.round + game.combat.turn /100}`;
  const lastTime = DAE.getFlag(actor, "savageAttackerTime");
  if (combatTime === lastTime) {
   MidiQOL.warn("Savage Attacker Damage: Already done a savage attack this turn");
   return {};
  }
}

const damageDice = lastArg.damageRoll.dice;

let diceTotal = 0;
let diceNumbers = [];
for (die of damageDice){
	for (roll of die.results){
		diceTotal += roll.result;
		diceNumbers.push(die.faces);
	}
}
let content = "Reroll damage dice for this attack?";

probHigher = evaluateProbHigher(diceTotal, diceNumbers);
if (probHigher == null){
	content += " (Too many dice for percent evaluation)";
} else {
	let percentSuccess = Math.round(probHigher * 1000) / 10;
	content += ` (${percentSuccess}% chance to increase result)`;
}

let useSA = false;
let dialog = new Promise((resolve, reject) => {
    new Dialog({
      title: "Savage Attacker",
      content: `${content}`,
      buttons: {
          one: {
              icon: '<i class="fas fa-check"></i>',
              label: "Reroll",
              callback: () => resolve(true)
          },
          two: {
              icon: '<i class="fas fa-times"></i>',
              label: "Keep",
              callback: () => {resolve(false)}
          }
      },
      default: "two"
      }).render(true);
});
useSA = await dialog;

if (!useSA) return {};

if (game.combat) {
  const combatTime = `${game.combat.id}-${game.combat.round + game.combat.turn /100}`;
  DAE.setFlag(actor, "savageAttackerTime", combatTime);
}

let newDamageRoll = await new Roll(`${lastArg.damageRoll.formula}`).evaluate({async: true});
await game.dice3d.showForRoll(newDamageRoll);
let damageDifference = newDamageRoll.total - lastArg.damageTotal;
if (damageDifference < 0) damageDifference = 0;

return {damageRoll: `${damageDifference}`, flavor: "Savage Attacker Damage Increase"};

function evaluateProbHigher(total, numbers){
	if (numbers.length > 5){
		return null;
	}
	let numHigher = 0;
	combinations = numbers.reduce((a, b)=> a*b, 1);
	if (numbers.length == 1){
		return ((combinations - total) / combinations);
	}

	numberChoices = []
	for (let num of numbers){
		choices = []
		for (let i = 1; i <= num; i++){
			choices.push(i);
		}
		numberChoices.push(choices);
	}

	combinationArray = generateCombinationArray(numberChoices);

	for (let num of combinationArray){
		if (num > total) numHigher += 1;
	}
	
	return (numHigher / combinations);
}

//magic code from the internet that gets all combinations...
function generateCombinationArray(array){
	const combine = ([head, ...[headTail, ...tailTail]]) => {
	  if (!headTail) return head

	  const combined = headTail.reduce((acc, x) => {
	    return acc.concat(head.map(h => h+x))
	  }, [])

	  return combine([combined, ...tailTail])
	}

	return (combine(array));
}