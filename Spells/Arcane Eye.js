lastArg = args[args.length-1];
const actor = canvas.tokens.get(lastArg.tokenId).actor;

if (args[0] === "on"){
	let [summonId] = await warpgate.spawn("Arcane Eye", { 
            token: {
                name: "Arcane Eye",
            },
            actor: {
                name: "Arcane Eye", 
            }});
	DAE.setFlag(actor, "ArcaneEye", summonId);
} else if (args[0] === "off"){
    const summonId = DAE.getFlag(actor, "ArcaneEye");
    warpgate.dismiss(summonId);
}