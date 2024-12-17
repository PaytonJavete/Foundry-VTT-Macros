let confirmed = false;
let dialog = new Promise((resolve, reject) => {
  new Dialog({
    title: "Title",
    content: `Content that can contain variables and html`,
    buttons: {
        confirm: {
            icon: '<i class="fas fa-check"></i>',
            label: "Confirm",
            callback: () => resolve(true)
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