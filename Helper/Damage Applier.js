let confirmed = false;
let numDice = 0;
let die = 0;
let damageType = "";
let flavorText = "You forgot to write flavor text dummy"

let optionsText = "";
let dTypes = ['acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder'];
for (const type of dTypes){
  optionsText += `<option value="${type}">${type}</option>`;
}

let dialog = new Promise((resolve, reject) => { 
    new Dialog({
    title: "Get that damage up in there",
    content: `
    <form id="damage-form">
        <p>'I\'m not doin enough damage!'</p>
        <div class="form-group">
            <input type="text" name="num-die"> d <input type="text" name="die">
        </div>

        <div class="form-fields">
            <select name="damage-type">` + optionsText + `</select>
        </div>
    </form>
    `,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "DIE!",
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
        numDice = parseInt(html.find('[name=num-die]')[0].value);
        die = parseInt(html.find('[name=die]')[0].value);
        damageType = html.find('[name=damage-type]')[0].value;
    }
  }).render(true);
});
confirmed = await dialog;

let targetList = Array.from(game.user.targets);

if (confirmed){
    const damageRoll = await new Roll(`${numDice}d${die}[${damageType}]`).roll();
    await game.dice3d.showForRoll(damageRoll);

    const itemCard = await ChatMessage.create({
        user: game.user._id,
        speaker: "GM",
        content: `<h2>Damage Applier</h2> ${damageRoll.total} ${damageType} damage!`,
        async: true
    });

    new MidiQOL.DamageOnlyWorkflow(
        targetList[0].actor,
        token,
        damageRoll.total,
        damageType,
        targetList,
        damageRoll,
        {
          flavor: "Damage",
          itemCardId: itemCard.id,
        }
    );

}