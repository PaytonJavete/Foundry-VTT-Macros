lastArg = args[args.length-1];
const token = canvas.tokens.get(lastArg.tokenId);
const actor = token.actor;
formula = `${lastArg.spellLevel}d8[fire]`;
DAE.setFlag(actor, "HeatMetalDamage", formula);