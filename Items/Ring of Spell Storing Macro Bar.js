const actorD = canvas.tokens.controlled[0].actor;
let levels = await findStoredSpellLevels(actorD); //will also remove used spells

const messages = Array.from(game.messages);
for (var i = messages.length - 1; i >= 0; i--) {
    content = messages[i].data.content;
    if (messages[i].data?.flags["midi-qol"]?.workflowId){
        workflowId = messages[i].data.flags["midi-qol"].workflowId;
        workflow = MidiQOL.Workflow.getWorkflow(workflowId);
        if(workflow?.item.type == "spell"){
        	let storedSpell = duplicate(workflow.item);
            let upcastLevel = workflow.castData.castLevel;
            let name = workflow.actor.name;
            storedSpell._id = randomID();

        	if(storedSpell.system.level == 0) return ui.notifications.warn("Cannot store cantrips in Ring of Spell Storing."); 
            levels += upcastLevel;
            if (levels > 5 ) return ui.notifications.error("Attempted to store more than 5 levels of spells in Ring of Spell Storing");

            //if already have spell, just casting it multiple times store multiple charges
            let existingSpell = actorD.items.find(i => i.name == storedSpell.name && i.system?.materials?.value == `Stored Spell from ${name}` && i.system.level == upcastLevel);
            if (existingSpell){
                let uses = existingSpell.system.uses;
                existingSpell.update({"system.uses": {value: uses.value+1, max: uses.max+1, per: 'charges'}});
            }
        	else {
        		storedSpell.system.preparation.mode = "atwill";
				storedSpell.system.uses = {value: 1, max: 1, per: 'charges'};
				storedSpell.system.materials.value = `Stored Spell from ${name}`;
                storedSpell.system.materials.consumed = false;
          
                //adjust damage to reflect upcast damage
                if (storedSpell.system.damage.parts.length > 0 && upcastLevel > storedSpell.system.level){
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
                if (storedSpell.system.save.ability != ""){
                    storedSpell.system.save.scaling  = 'flat';
                    storedSpell.system.save.dc = workflow.actor.system.attributes.spelldc;
                }
                
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

	        	await actorD.createEmbeddedDocuments('Item', [storedSpell]); 
        	}
            break;      
        }
    }
}

async function findStoredSpellLevels(user){
	let n = 0;
	const ringSpells = user.items.filter(i => i.system?.materials?.value.includes("Stored Spell"));
	for (spell of ringSpells){
		if (spell.system.uses.value > 0) n += (spell.system.level*spell.system.uses.value);
		else spell.delete();
	}
	return n;
}