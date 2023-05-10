const lastArg = args[args.length - 1];
const tokenD = canvas.tokens.get(lastArg.tokenId);
const actorD = tokenD.actor;
const itemD = actor.items.getName(lastArg.item.name);
let currentC = itemD.system.uses.value;
let charges = 0;

if (currentC == 0) return ui.warn.notifications("Cube of Force has no charges remaining");

let choices = "";
if(currentC >= 1) choices += `<option value="1">Gases, wind, and fog cannot pass through the barrier.</option>`;
if(currentC >= 2) choices += `<option value="2">Nonliving matter cannot pass through the barrier. Walls, floors, and ceilings can pass through at your discretion.</option>`;
if(currentC >= 3) choices += `<option value="3">Living matter cannot pass through the barrier.</option>`;
if(currentC >= 4) choices += `<option value="4">Spell effects cannot pass through the barrier.</option>`;
if(currentC >= 5) choices += `<option value="5">Nothing can pass through the barrier. Walls, floors, and ceilings can pass through at your discretion.</option>`;
choices += `<option value="0">The barrier deactivates.</option>`;

let cast = false;
let activate = new Promise((resolve, reject) => { 
    new Dialog({
    title: "Cube of Force Effect",
    content: `
    <form id="womm-form">
        <div class="form-group">
            <label>Choice</label>
            <div class="form-fields">
                <select name="choices">` + choices + `</select>
            </div>
        </div>
    </form>
    `,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Confirm",
            callback: async (html) => {
                charges += parseInt(html.find('[name=choices]')[0].value);
                resolve(true);
            }
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
cast = await activate;
if (!cast) return;

if (charges == 0){
    let effect = actorD.effects.find(e => e.label == "Cube of Force");
    effect.delete();
}
else {
    newValue = currentC - charges;
    itemD.update({"system.uses.value": newValue})
}