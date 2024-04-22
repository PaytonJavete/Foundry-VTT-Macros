const lastArg = args[args.length-1];

//Check if melee attack/strength attack, and if it is finesse and attacker has higher dex we also disregard
if (!["mwak"].includes(lastArg.itemData.system.actionType) || lastArg.itemData.system?.ability != "str") return {};
if((lastArg.itemData.system.properties.fin == true) && (lastArg.actor.system.abilities.dex.mod > lastArg.actor.system.abilities.str.mod)) return {};

let halveDamage = 0 - Math.ceil(lastArg.damageTotal / 2);
return {damageRoll: `${halveDamage}`, flavor: "Weakened Attack"};