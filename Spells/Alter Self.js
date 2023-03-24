let tactor;
let itemName = args[0].itemData.name;
if (args[0].tokenUuid) tactor = (await fromUuid(args[0].tokenUuid)).actor;
else tactor = game.actors.get(args[0].actorId);

let type = null;
let confirmed = false;

let dialog = new Promise((resolve, reject) => {
    new Dialog({
        title: 'Choose an alter self option',
        content: `
          <form class="flexcol">
            <div class="form-group">
              <select id="type">
                <option value="Aquatic Adaptation">Aquatic Adaptation</option>
                <option value="Change Appearance">Change Appearance</option>
                <option value="Natural Weapons">Natural Weapons</option>
              </select>
            </div>
          </form>
        `,
        buttons: {
            yes: {
                icon: '<i class="fas fa-bolt"></i>',
                label: 'Select',
                callback: async (html) => {
                    type = html.find('#type').val();
                    resolve(true);
                },
            },
        }
    }).render(true);
})
confirmed = await dialog;
if (!confirmed) return;

let effect =  tactor.effects.find(i => i.label === itemName);
let label = duplicate(effect.label);
label += ` - ${type}`;
await effect.update({label});

if (type === "Aquatic Adaptation"){
  let changes = duplicate(effect.changes);
  changes.push({key: "system.attributes.movement.swim", mode: 4, priority: 20, value: "@attributes.movement.walk"});
  await effect.update({changes}); 
}