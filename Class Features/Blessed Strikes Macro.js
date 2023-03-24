if (args[0].hitTargets.length < 1) return {};
if (!["mwak","rwak"].includes(args[0].itemData.data.actionType)) return {}; // weapon attack

const dice= args[0].isCritical ? 2: 1;

return {damageRoll: `${dice}d8[radiant]`, flavor: "Blessed Strike"};