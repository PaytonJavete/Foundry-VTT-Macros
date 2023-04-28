const lastArg = args[args.length-1];
const caster = canvas.tokens.get(lastArg.tokenId).actor;

if (lastArg.itemData.type != "spell" || lastArg.itemData.system.damage.parts.length == 0) return {}; // damaging spell

if (lastArg.hitTargets.length == 0) return {}; // a creature was hit

const itemSP = caster.items.getName("Sorcery Points");
const value = itemSP.system.uses.value - 1;
if (value < 0) return {}; // has SP to spend

const damageDice = lastArg.damageRoll.dice;

let rerollDice = await findBestRerollDice(damageDice, caster.system.abilities.cha.mod);

let content = "";
for(die of rerollDice){
	content += `<label class="checkbox"> <input type="checkbox" value="${die.id}" name="rerollDie" unchecked/>${die.roll}/${die.faces}</label>`;
}

let confimred = false;
let choices = [];
let dialog = new Promise((resolve, reject) => {
    new Dialog({
      title: "Empowered Spell",
      content: `
          <form id="WoFP-use-form">
               <div class="form-group">
              		${content}
               </div>
          </form>
          Reroll damage dice for this spell? (1 SP)
      `,
      buttons: {
          one: {
              icon: '<i class="fas fa-check"></i>',
              label: "Reroll",
              callback: async (html) => {
              	let inputs = html.find('[name=rerollDie]').get();
              	for (input of inputs){
              		if (input.checked) choices.push(input.value);
              	}
              	resolve(true);
              },
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
confimred = await dialog;

if (!confimred) return {};

rerollDice = rerollDice.filter(d => choices.includes(d.id));

let diceTotal = 0;
let diceFormula = "";
for(die of rerollDice){
	diceTotal += die.roll;
	diceFormula += `1d${die.faces}[${die.flavor}]+`;
}

await itemSP.update({"system.uses.value": value});

let newDamageRoll = await new Roll(diceFormula).evaluate({async: true});
await game.dice3d.showForRoll(newDamageRoll);
let damageDifference = newDamageRoll.total - diceTotal;

return {damageRoll: `${damageDifference}`, flavor: "Empowered Spell Damage Change"};

async function findBestRerollDice(diceArray, numReroll){
	let bestDice = [];
	let maxMin;
	for (die of diceArray){
		for (roll of die.results){
			chance = roll.result / die.faces;
			if (bestDice.length == numReroll){
				maxMin = Math.max(...bestDice.map(o => o.chance));
				if (chance < maxMin){
					object = bestDice.find(o => o.chance == maxMin);
					index = bestDice.indexOf(object);
					if (index > -1) bestDice.splice(index, 1);
					bestDice.push({chance: chance, roll: roll.result, faces: die.faces, flavor: die.flavor, id: randomID()});
				}			
			} 
			else if (bestDice.length < 5) bestDice.push({chance: chance, roll: roll.result, faces: die.faces, flavor: die.flavor, id: randomID()});
			else return ui.notifications.error("Unexpected Array Length for Metamagic - Empowered Spell");
		}
	}

	return bestDice;
}
