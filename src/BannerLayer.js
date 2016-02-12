

var BannerLayer = cc.Layer.extend({
	feedbackText: [],
	banner: null,

	ctor: function() {
		this._super();

	    this.feedbackText = ["yahoo!", "yay!", "good job!", "cowabunga!",
				 "holy crap!", "keep it up!", "whoa!", "dang!",
				 "gosh golly!", "booya!", "oh wow!", 
				 "oh jeez!", "so good!", "!!!!!!!!!!!!!!!!!" ];

		var size = cc.winSize;

		this.banner = new Banner();
		this.banner.attr({
			scale: 1.0,
			anchorX: 0.5,
			anchorY: 0.5,
			x: cc.winSize.width / 2,
			y: cc.winSize.height / 2,
			visible: false
		});

	    this.addChild(this.banner);
	},

    /*
     * launchBanner({ title: 'Hello' })
     */
    launchFallingBanner: function(data) {

        var that = this;

        var titleStr;

        if(data) {
            titleStr = data.title;
        } else {
            titleStr = this.feedbackText[Math.floor(Math.random()*this.feedbackText.length)];
        }
        this.banner.setVisible(true);
        this.banner.launchWithText(titleStr);
        this.banner.setPosition(cc.winSize.width / 2, cc.winSize.height + this.banner.getContentSize().height / 2);

        var moveDuration = 0.5;
        var moveAction = cc.moveTo(moveDuration, cc.p(this.banner.x, cc.winSize.height / 2));
        //var moveActionBack = cc.moveTo(moveDuration, cc.p(this.banner.x, cc.winSize.height + this.banner.getContentSize().height / 2));
        moveAction.easing(cc.easeOut(2.0));
        var delayAction = cc.delayTime(0.8);
        var fadeOutAction = cc.fadeTo(0.2, 0*255);
        var fadeInAction = cc.fadeTo(0.1, 0.75*255);
        var removeAction = cc.callFunc(function() {
            that.banner.setVisible(false);
        });
        this.banner.stopAllActions();
        this.banner.runAction(cc.sequence(moveAction, delayAction, fadeOutAction, removeAction, fadeInAction));
    },


    /*
     * launchBanner({ title: 'Hello' })
     */
    launchShrinkingBanner: function(data) {

        var that = this;

        var titleStr;

        if(data) {
            titleStr = data.title;
        } else {
            titleStr = this.feedbackText[Math.floor(Math.random()*this.feedbackText.length)];
        }
        var oldFontSize = this.banner.bannerLabel.getFontSize();
        this.banner.bannerLabel.setFontSize(500);
        this.banner.setVisible(true);
        this.banner.launchWithText(titleStr);
        this.banner.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);

        var scaleUpAction = cc.scaleBy(0.1, 40.0);
        var scaleDownAction = cc.scaleBy(2.0, 1/40.0);
        scaleDownAction.easing(cc.easeIn(3.0));
        var fadeOutAction = cc.fadeTo(0.3, 0*255);
        var fadeInAction = cc.fadeTo(0.1, 0.75*255);
        var removeAction = cc.callFunc(function() {
            that.banner.setVisible(false);
        });
        var fixFontAction = cc.callFunc(function(){
           that.banner.bannerLabel.setFontSize(72);
        });
        this.banner.stopAllActions();
        this.banner.runAction(cc.sequence(scaleDownAction, fadeOutAction, removeAction, fadeInAction, scaleUpAction, fixFontAction));
    },

});