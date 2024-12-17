//set flags and set hidden
let drawings = canvas.drawings.placeables.filter(d => d.document.hidden == false);
for (d of drawings){
	flags = d.document.flags;
	tags = [];
	if (Array.isArray(flags?.tagger?.tags)) tags = flags.tagger.tags;
	tags.push("Dinvren");
	d.document.update({flags: {tagger: {tags: tags}}});
}

let drawings = canvas.drawings.placeables.filter(d => d.document.flags.tagger?.tags?.includes("Dinvren"));
for (d of drawings) d.document.update({hidden : true});