const i18n = require('i18n');
const storycfg = require('storycfg');

var emptyFunc = function (event) {
    event.stopPropagation();
};

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        scrollItemTemplate: { // item template to instantiate other items
            default: null,
            type: cc.Node
        },
        questionLabel: {
            default: null,
            type: cc.Label
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        selectAudio: {     // 选择音效资源
            default: null,
            url: cc.AudioClip
        },
        playerNode: {
            default: null,
            type: cc.Node
        },
        storyNode: {
            default: null,
            type: cc.Node
        },
        player: null,
        story: null,
    },

    // use this for initialization
    onLoad: function () {
        this.content = this.scrollView.content;
        
        this.player = this.playerNode.getComponent('Player');
        this.story = this.storyNode.getComponent('Story');
        console.log(storycfg);
        this.loadQuestion(this.player.currentStory.toString());
        this.loadLifeNum();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    loadLifeNum: function (player) {
        let self = this;
        self.scoreLabel.string = i18n.t("UI/DIE NUM") + self.player.lifeNum;
    },
    
    loadQuestion: function (url) {
        let self = this;
        let urlArr = url.split('/');
        let fileName = urlArr[urlArr.length - 1].replace('.fire', '');
        if(1==1) {
            self.questionLabel.string = storycfg.chapter[url].question;
            
            // 加答案button
            let totalCount = storycfg.chapter[url].total;
            for(let i = 1; i <= totalCount; ++i) {
                let item = cc.instantiate(this.scrollItemTemplate);
        		item.setPosition(-80, -item.height * (0.25 + i - 1));
        		item.string = storycfg.chapter[url].answer[i].action;
        		//item.getComponent('Item').updateItem(i, i);
                //this.items.push(item);
                console.log(item.string);
                this.content.addChild(item);
            }
            return;
        }
        cc.loader.loadRes('text/story/chapter.' + url + '/question', 
        function(err, txt) {
            if (err) {
                self.questionLabel.string = i18n.t("scripts/Global/Menu.js.1");
                return;
            }
            self.questionLabel.string = txt;
        });
    },
});
