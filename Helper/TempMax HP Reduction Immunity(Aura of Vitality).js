lastArg = args[args.length-1];
const actor = canvas.tokens.get(lastArg.tokenId).actor;

if (args[0] === "on"){
	DAE.setFlag(actor, "ImmuneMaxHpReduced", true);
} else if (args[0] === "off"){
	DAE.unsetFlag(actor, "ImmuneMaxHpReduced");
}