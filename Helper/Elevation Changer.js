let height = 0;

let dialog = new Promise((resolve, reject) => { 
    new Dialog({
    title: "Go Up, Go Down",
    content: `
    <form id="damage-form">
        <p>'New Height'</p>
        <div class="form-group">
            <input type="text" name="elevate">
        </div>
    </form>
    `,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Weee!",
            callback: () => resolve(true)
        },
        two: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => {resolve(false)}
        }
    },
    default: "Cancel",
    close: html => {
        height = parseInt(html.find('[name=elevate]')[0].value);
    }
  }).render(true);
});
confirmed = await dialog;

if (!confirmed || !Number.isInteger(height)) return;

for (const token of game.user.targets){
	token.document.update({elevation: height})
}