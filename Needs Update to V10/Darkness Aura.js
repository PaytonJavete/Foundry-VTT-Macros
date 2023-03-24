console.log(args);
const lastArg = args[args.length - 1];
tokenObj = await fromUuid(lastArg.tokenUuid);
token = tokenObj._object;

if (args[0] == 'on'){
	tokenLightUpdate({"dim": 0, "bright": 15, "angle": 360, "luminosity": -1, "animation": {"type": "none"}});
}

if (args[0] == 'off'){
	tokenLightUpdate({"dim": 0, "bright": 0, "angle": 360, "luminosity": 0.5});
}

console.log(token.light);

function tokenLightUpdate(data) {
  token.document.update({light: data});
}