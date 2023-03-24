actor = args[0].actor;
if (actor.system.resources.primary.value <= 0) return ui.notifications.warn("No psionic dice remaining.");

// Create a dialogue box to confrim usage.
let confirmed = false;
let dialog = new Promise((resolve, reject) => { 
    new Dialog({
    title: "Psi-Bolstered Knack",
    content: `If your psionic die roll of ${args[0].damageTotal} turned your check into a success, click Confirm. Otherwise Cancel.`,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Confirm",
            callback: () => resolve(true)
        },
        two: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => {resolve(false)}
        }
    },
    default: "Cancel"
  }).render(true);
});
confirmed = await dialog;

if(!confirmed){
    return;
} else {
    const item = actor.items.getName("Psionic Power: Psionic Energy");
    value = actor.system.resources.primary.value - 1;
    await item.update({"system.uses.value": value});
}