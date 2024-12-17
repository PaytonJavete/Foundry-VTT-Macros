const actor = canvas.tokens.get(args[0].tokenId).actor;
const item = actor.items.getName("Fire Storm");
const workflowItemData = duplicate(item);
workflowItemData.system.preparation.mode = "atwill";
workflowItemData.system.uses = {max: null, per: "", value: null};
setProperty(workflowItemData, "flags.itemacro", {});
setProperty(workflowItemData, "flags.midi-qol", {});

const spellItem = new CONFIG.Item.documentClass(workflowItemData, { parent: actor });
const options = { showFullCard: false, createWorkflow: true, configureDialog: false };

for (let i = 2; i <= 10; i++){
	let confirmed = false;
	let dialog = new Promise((resolve, reject) => {
	  new Dialog({
	    title: "Next Fire Storm Area",
	    content: `Place 10 ft. fire storm cube ${i} out of 10?`,
	    buttons: {
	        confirm: {
	            icon: '<i class="fas fa-check"></i>',
	            label: "Confirm",
	            callback: async () => {
	            	resolve(true);
	            }
	        },
	        cancel: {
	            icon: '<i class="fas fa-times"></i>',
	            label: "Cancel",
	            callback: () => {resolve(false)}
	        }
	    },
	    default: "cancel",
	    close: html => {
	        resolve(); //needed for closing to still resolve false and complete code
	    }
	  }).render(true);
	});
	confirmed = await dialog;
	console.log(confirmed);
	if (!confirmed) break;
	else await MidiQOL.completeItemRoll(spellItem, options);
}

for (template of canvas.templates.placeables){
    if (template.document.flags["midi-qol"].originUuid == item.uuid) template.document.delete();
}