

var ComboBannerLayer = cc.Layer.extend({
	feedbackText: [],
	banner: null,

	ctor: function() {
	    this.feedbackText = ["yahoo!", "yay!", "good job!", "cowabunga!",
				 "holy crap!", "keep it up!", "whoa!", "dang!",
				 "gosh golly!", "booya!", "oh wow!", 
				 "oh jeez!", "so good!", "!!!!!!!!!!!!!!!!!" ];
	    
	    
	    this._super();

	    console.log(this.getContentSize());
	    this.banner = new cc.LabelTTF("", b_getFontName(res.markerFont), 72);
	    this.banner.attr({
		    scale: 1.0,
			anchorX: 0.5,
			anchorY: 0.5,
			x: this.getContentSize().width / 8,
			y: 0
		});
	    console.log(this.banner.y);
	    
	    this.banner.enableStroke(cc.color(0, 0, 255, 255), 1);
	    this.banner.setColor(cc.color(255, 255, 255, 0.75*255));
	    //this.initLabel();
	    this.addChild(this.banner);
	},

	initLabel: function(){
	    
	    var text = this.feedbackText[Math.floor(Math.random()*this.feedbackText.length)];
	    this.banner.setString(text);
	    this.banner.setPosition(cc.winSize.width/8, cc.winSize.height/2);
	    
	    var moveTween = cc.moveTo(0.5, cc.p(this.banner.x + 900, this.banner.y));
	    
	    console.log(this.banner);
	    console.log(this.banner._string);
	    this.banner.runAction(moveTween);
	    this.schedule(this.clearText, 1.25, 1);
	    return this.banner;
	},

	clearText: function(){
	    this.banner.setString("");
	},

	makeFeedbackText: function(){
	    return this.initLabel();
	}
	
	
    });