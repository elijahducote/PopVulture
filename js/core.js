import van from "vanjs-core";
import { reactive, list } from "vanjs-ext";
import { timeline as json } from "../automation.json";
import { FastAverageColor } from "fast-average-color";

var chronicle = document.getElementsByClassName("timeline__wrap")[0],
root = document.documentElement,
fac = new FastAverageColor(),
count = 0,
playlists;
root.style.setProperty("--basiccolor","#000");

function frag (item) {
	return van.tags[item];
}

function mixColors(color1, color2, percentage) {
  const ratio = percentage / 100;
  const inverseRatio = 1 - ratio;

  const mixedColor = color1.map((component, index) => {
    return Math.round(component * inverseRatio + color2[index] * ratio);
  });

  return mixedColor;
}

function getColor () {
	if (json[count].isloaded) return;
	console.log("Has not been loaded!")
	fac.getColorAsync(json[count].cover,{speed:"precision",algorithm:"dominant",step:3}).then(function(color){
	        var lumColor;
			if (color.isLight) {
				lumColor = [255,255,255];
				playlists[count].style.setProperty("color","#000","important");
				playlists[count].style.setProperty("text-shadow","0 .2rem .15rem rgba(255,255,255,0.7), 0 .4rem .65rem rgba(255,255,255,0.2), 0 .9rem 1.15rem rgba(255,255,255,0.2)","important");
			}
			else {
				lumColor = [0,0,0];
				playlists[count].style.setProperty("color","#FFF","important");
				playlists[count].style.setProperty("text-shadow","0 .2rem .15rem rgba(0,0,0,0.7), 0 .4rem .65rem rgba(0,0,0,0.2), 0 .9rem 1.15rem rgba(0,0,0,0.2)","important");
			}
			var bgcolor = mixColors(lumColor,color.value,62.5),
			avrg = `rgba(${bgcolor[0]},${bgcolor[1]},${bgcolor[2]},1)`,
			tint = avrg.substring(0,color.rgb.length);
			playlists[count].style.backgroundImage = `linear-gradient(0deg, ${tint},0.4) 0%, ${tint},1) 100%),url("${json[count].cover}")`;
			json[count].isloaded = true;
	});
}


function removeWords(str, words) {
  const wordsSet = new Set(words);
  return str.split(' ').filter(w => !wordsSet.has(w)).join(' ');
}

function kairos() {
timeline(document.querySelectorAll(".timeline"),{
    // Choose whether the timeline should be vertical or horizontal

	mode: "horizontal",
	
	
	// When using the timeline in horizontal mode, define at which viewport width it should revert to vertical mode

	forceVerticalMode: -1,
	
	
	// When using the timeline in horizontal mode, define the vertical alignment of the first item

	horizontalStartPosition: "top",
	
	
	// When using the timeline in horizontal mode, define how many items to move when clicking a navigation button

	moveItems: 1,
	
	
	// When using the timeline in horizontal mode, this defines whether the timeline should start from the right. This overrides the startIndex setting.

	rtlMode: false,
	
	
	// When using the timeline in horizontal mode, define which item the timeline should start at

	startIndex: 0,
	
	
	// When using the timeline in vertical mode, define the alignment of the first item

	verticalStartPosition: "left",
	
	
	// When using the timeline in vertical mode, define the distance from the bottom of the screen, in percent or pixels, that the items slide into view
	
	verticalTrigger: "-1%",
	
	
	// If using the timeline in horizontal mode, define how many items are visible in the viewport
	
    visibleItems: 1
	
});
}

function populate () {
	var title = [],
	link = [],
	img = [],
	palette = [],
	cur = json.length,
	ndx = 0,
	nth,
	diff,
	items,
	item;
	for (nth = cur;cur;--cur) {
		diff = nth - cur;
		title[diff] = removeWords(json[diff].name,["Pop","Vulture"]);
		link[diff] = json[diff].url;
		img[diff] = json[diff].cover;
	}
	items = reactive(title);
	return list(frag("div")({class:"timeline__items"}),items, function (v) {
		
	item = frag("div")({class:"timeline__item"},frag("a")({href:link[ndx],target:"_blank",rel:"noreferrer noopener"},frag("div")({class:"timeline__content"},frag("h1")(title[ndx]))));
		
		++ndx;
				
		return item;
		
	});
}

van.add(chronicle,populate());

function addCount () {
	++count;
	count = Math.min(count,(json.length - 1));
	getColor();
	console.log(count);
}

function removeCount () {
	--count;
	count = Math.max(count,0);
	getColor();
	console.log(count);
}

window.kairos = kairos;
window.addCount = addCount;
window.removeCount = removeCount;
window.addEventListener("DOMContentLoaded",function(){
	playlists = document.getElementsByClassName("timeline__content");
	getColor();
	var elem = document.getElementsByClassName("timeline-nav-button")[1],
	elem1 = document.getElementsByClassName("timeline-nav-button")[0],
	latest = document.getElementsByClassName("header-text3")[0];
	elem.addEventListener("click",addCount);
	elem1.addEventListener("click",removeCount);
	
	van.hydrate(latest,function () {
		return frag("a")({href:json[0].url,target:"_blank",rel:"noreferrer noopener"},frag("span")({class:"header-text3"},"Latest Playlist"));
	});
	
	window.addEventListener("resize", function() {
		count = 0;
	});
});