var bruges = {};

bruges.init = function() {
	// black or white
	if (new Date().getHours() > 6 && new Date().getHours() < 18) {
		$("body").addClass("white");
	} else {
		$("body").addClass("black");
	}		
	
	var brugesData;
	var $gigInfo = $("#gigInfo");
	
	function renderMusic() {
		$("#songs ul").append("<li>Coming Soon</li>");
	}
	function renderGigs() {
    for (year in brugesData.gigs) {
      		$("#gigs").append(TrimPath.processDOMTemplate("gigs_item_template", {year: year, gigs: brugesData.gigs[year]}));
    }
		$("#gigs a").click(showGig);
	}
	function resize() {
		var $foo = $("#foo");
		$foo.height($(window).height() - $foo.position().top - $("nav").outerHeight() - 40);		
		$gigInfo.height($(window).height());
		$foo.html("");
		renderFoo();
	}
	function renderFoo() {
		renderBox();
	}
	function renderLinks() {
		$("#links .links-container").html(TrimPath.processDOMTemplate("link_item_template", brugesData));
		$("#hitbrugeup").click(showContact);
	}
	function showGig() {
		var label = $(this).text();
		var year = $(this).data("year");
		for (var i=0; i< brugesData.gigs[year].length; i++) {
			if (brugesData.gigs[year][i].label === label) {
				$gigInfo.show();
				$gigInfo.animate({width: 200});
				$gigInfo.html(TrimPath.processDOMTemplate("gig_template", brugesData.gigs[year][i]));
				$(".close-me", $gigInfo).click(hideGig);				
			}
		}
	}
	function hideGig() {
		$gigInfo.animate({width: 0}, function() {
			$gigInfo.html("");
			$gigInfo.hide();
		});		
	}
	function showContact() {
		$gigInfo.show();
		$gigInfo.animate({width: 280});
		$gigInfo.html(TrimPath.processDOMTemplate("contact_template", {email_1:"themanager", email_2:"brugestheband"}));
		$(".close-me", $gigInfo).click(hideGig);		
	}
	$.getJSON("data.json", function(json) {
		brugesData = json;
		renderMusic();
		renderGigs();
		renderLinks();
		resize();
		renderFoo();
	});
	$(window).resize(resize);
};

$(document).ready(bruges.init);

function renderBox() {
	var $boxes = $("#foo");
	$boxes.addClass("theboxes");
	var config = {};
		
	config.height = $boxes.height();
	config.width = $boxes.width();
	
	config.boxWidth = 60;
	config.boxHeight = 60;
	
	if ($("body").hasClass("black")) {
		config.colour = "#FFF";
	} else {
		config.colour = "#000";
	}
	
	function highlight(x, y, opacity, colour) {
		var $el = $(".box[x="+x+"][y="+y+"]",$boxes);
		if (colour === null) {
			colour = config.colour;
		}
		$el.animate({
			opacity: opacity,
			backgroundColor: colour
		}, 200, function() {
			$el.animate({opacity: 0, backgroundColor: config.colour}, 100);
		});
		/*$el.css({opacity: opacity});
		setTimeout(function() {
			$el.animate({opacity: 0}, 100);
		}, 100);*/
	}
	
	$boxes.width(config.width).height(config.height);
	
	config.boxesHoriz = parseInt(config.width/config.boxWidth);
	config.boxesVert = parseInt(config.height/config.boxHeight);
	
	for (var y=0; y<config.boxesVert; y++) {
		for (var x=0; x<config.boxesHoriz; x++) {
			var $newBox = $("<div class='box'>");
			$newBox.css({
				top: y*(config.boxHeight),
				left: x*(config.boxWidth),
				height: config.boxHeight,
				width: config.boxWidth
			});
			$newBox.attr("x", x).attr("y",y);
			$newBox.addClass("coord-"+x+"_"+y);
			$boxes.append($newBox);
		}
	}
	function doStuffWithBoxes(el, withColour) {
		var boxX = parseInt($(el).attr("x"));
		var boxY = parseInt($(el).attr("y"));		
		var colour;
		if (withColour) {
			colour = get_random_color();
		}
		for (y=Math.max(boxY-3, 0); y<Math.min(boxY+4,config.boxesVert); y++) {				
			for (var x=Math.max(boxX-3, 0); x<Math.min(boxX+4, config.boxesHoriz) ;x++) {
				var diff = Math.max(Math.abs(boxX-x), Math.abs(boxY-y));
				if (diff === 0) {
					if (withColour) {
						$(el).animate({opacity: 1, backgroundColor: colour}, 100);						
					} else {
						$(el).animate({opacity: 1}, 100);
					}					
				} else {
					if (parseInt(Math.random()*10000000000) % 2 === 0) {
						highlight(x, y, 1/(diff+1), colour);
					}
				}					
			}
		}
	}
	$(".box",$boxes).hover(
		function() {
			doStuffWithBoxes(this, false);						
		}, 
		function() {
			$(this).animate({opacity: 0, backgroundColor: config.colour}, 100);
		}
	);/*.click(function() {
		//doStuffWithBoxes(this, true);
	});*/
}

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}