let data = game.settings.get(AECONSTS.MN, "customautospells");
data["Summon Elemental"] = [
   {
      creature:"Elemental Spirit - Water",
      number: 1,
      animation: "water",
   },
   {
      creature:"Elemental Spirit - Fire",
      number: 1,
      animation: "fire",
   },
   {
      creature:"Elemental Spirit - Earth",
      number: 1,
      animation: "magic2",
   }, 
   {
      creature:"Elemental Spirit - Air",
      number: 1,
      animation: "air",
   },           
];

data["Blade of Disaster"] = [
   {
      creature:"Blade of Disaster",
      number: 1,
      animation: "air",
   },
];

data["Spiritual Weapon"] = [
   {
      creature:"Spiritual Weapon (yklwa)",
      number: 1,
      animation: "air",
   },
      {
      creature:"Spiritual Weapon (Greatsword)",
      number: 1,
      animation: "lightning",
   },
      {
      creature:"Spiritual Weapon (spear)",
      number: 1,
      animation: "air",
   },
      {
      creature:"Spiritual Weapon (lance)",
      number: 1,
      animation: "air",
   },
];

data["Summon Draconic Spirit"] = [
   {
      creature:"Draconic Spirit - Metallic",
      number: 1,
      animation: "air",
   },
      {
      creature:"Draconic Spirit - Chromatic",
      number: 1,
      animation: "air",
   },
      {
      creature:"Draconic Spirit - Gem",
      number: 1,
      animation: "air",
   },
];

data["Flaming Sphere"] = [
   {
      creature:"Flaming Sphere",
      number: 1,
      animation: "fire",
   },
      {
      creature:"Flaming Sphere (Green)",
      number: 1,
      animation: "fire",
   },
];

data["Summon Celestial"] = [
   {
      creature:"Celestial Avenger",
      number: 1,
      animation: "air",
   },
   {
      creature:"Celestial Defender",
      number: 1,
      animation: "air",
   },      
];

game.settings.set(AECONSTS.MN, "customautospells", data);