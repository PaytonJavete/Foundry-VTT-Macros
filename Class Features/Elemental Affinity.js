const lastArg = args[args.length-1];
const caster = canvas.tokens.get(lastArg.tokenId).actor;

if (lastArg.hitTargets.length == 0) return {}; // a creature was hit
if (lastArg.itemData.type != "spell" || lastArg.itemData.system.damage.parts.length == 0 ) return {}; // damaging spell
let fire = false;
for (daamageF of lastArg.itemData.system.damage.parts){
	if (daamageF[1] == "fire") fire = true;
}
if(!fire) return {}; //check if spell does fire damage

return {damageRoll: `${caster.system.abilities.cha.mod}`, flavor: "Elemental Affinity"};