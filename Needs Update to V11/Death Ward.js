if (args[0] == "off") {
	console.log(args);
	let actor = await fromUuid(args[1].actorUuid);
	let objUpdate = new Object();
	objUpdate['data.attributes.hp.value'] = 1;
	actor.update(objUpdate);
}