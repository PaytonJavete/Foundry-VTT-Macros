const lastArg = args[args.length-1];
const item = await fromUuid(lastArg.origin);
const caster = item.parent;

if(args[0] == "on"){
	let embraced = DAE.getFlag(caster, "Embrace");
	if (embraced == undefined || embraced?.length == 0) embraced = [lastArg.tokenId];
	else if (!embraced.includes(lastArg.tokenId)) embraced.push(lastArg.tokenId);
	DAE.setFlag(caster, "Embrace", embraced);
}
else if (args[0] == "off"){
	let embraced = DAE.getFlag(caster, "Embrace");
	embraced = embraced.filter(item => item !== lastArg.tokenId);
	DAE.setFlag(caster, "Embrace", embraced);
}