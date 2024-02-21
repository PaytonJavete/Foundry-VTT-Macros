const lastArg = args[args.length - 1];

if (args[0] == "off"){
	let template = canvas.templates.placeables.find(t => t.document.flags['midi-qol'].originUuid == lastArg.origin);
	canvas.scene.deleteEmbeddedDocuments('MeasuredTemplate', [template.id], {deleteAll: false});
}