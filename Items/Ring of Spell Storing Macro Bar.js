const actorD = canvas.tokens.controlled[0].actor;

let levels = await findStoredSpellLevels(actorD); //will also remove used spells
console.log(levels);
let newSpells = [];

const messages = Array.from(game.messages);
for (var i = messages.length - 1; i >= 0; i--) {
    content = messages[i].data.content;
    if (messages[i].data?.flags["midi-qol"]?.workflowId){
        workflowId = messages[i].data.flags["midi-qol"].workflowId;
        workflow = MidiQOL.Workflow.getWorkflow(workflowId);
        console.log(workflow);
        if(workflow.item.type == "spell"){
        	storedSpell = duplicate(workflow.item);
        	console.log(storedSpell);
        	console.log(newSpells);
            //if cantrip or from a stored spell skip
        	if(storedSpell.system.level == 0) continue;
            if(storedSpell.system.materials.value == "Stored Spell") continue;

            //if already have spell, just casting it multiple times store multiple charges
        	if(newSpells.includes(storedSpell)){
        		index = newSpells.indexOf(storedSpell);
        		uses = newSpells[index].system.uses;
        		newSpells[index].system.uses = {max: uses.max+1, value: uses.value+1};
        	}
        	else {
        		storedSpell.system.preparation.mode = "atwill";
				storedSpell.system.uses = {value: 1, max: 1, per: 'charges', recovery: ''}
				storedSpell.system.materials.value = "Stored Spell";
                storedSpell.system.materials.consumed = false;

                let upcastLevel = workflow.castData.castLevel           
                //adjust damage to reflect upcast damage
                if (storedSpell.system.damage.parts.length > 0){
                    scaling = storedSpell.system.scaling;
                    if (scaling.mode == "level"){
                        if (scaling.formula.includes("@item.level")){
                            let formula = " + " + scaling.formula.replace('@item.level', `${upcastLevel}`);
                            storedSpell.system.damage.parts[0][0] += formula;
                        } else {
                            let stringScaleDice = scaling.formula.split('d')[0];
                            let scaleDice = parseInt(stringScaleDice) * (upcastLevel - storedSpell.system.level);
                            let formula = " + " + scaling.formula.replace(stringScaleDice, `${scaleDice}`);
                            storedSpell.system.damage.parts[0][0] += formula;
                        }   
                    }
                }
                storedSpell.system.level = upcastLevel;

                //set DC to be flat equal to original caster DC
                storedSpell.system.save.scaling = 'flat';
                storedSpell.system.save.dc = workflow.actor.system.attributes.spelldc;
                
                //set attack roll to be orignal caster attack roll (diff between ringbearer and caster)
                if (storedSpell.system.actionType.includes("ak")){
                    let userAttack = actorD.system.attributes.prof;
                    if (actorD.system.attributes.spellcasting != ''){
                        let type = storedSpell.system.actionType;              
                        let bonus = parseInt(actorD.system.bonuses[type].attack) || 0;
                        let abilityType = actorD.system.attributes.spellcasting;
                        let spellAbility = actorD.system.abilities[abilityType].mod; 
                        userAttack += (spellAbility + bonus);                     
                    }

                    let casterAttack = workflow.attackTotal - workflow.d20AttackRoll;
                    storedSpell.system.attackBonus = casterAttack - userAttack;
                }

                //try ways to implement summons that rely on original actor data??
	        	newSpells.push(storedSpell);
        	}
        	levels += storedSpell.system.level;
        	console.log(levels);
       		if (levels == 5) break;
       		else if (levels > 5 ) return ui.notifications.error("Attempted to store more than 5 levels of spells in Ring of Spell Storing");
        }
    }
}

await actorD.createEmbeddedDocuments('Item', newSpells);

async function findStoredSpellLevels(user){
	let n = 0;
	const ringSpells = user.items.filter(i => i.system?.materials?.value.includes("Stored Spell"));
    console.log(ringSpells);
	for (spell of ringSpells){
		if (spell.system.uses.value > 0) n += (spell.system.level*spell.system.uses.value);
		else spell.delete();
	}
	return n
}