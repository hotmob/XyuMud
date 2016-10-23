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
        scoreLabel: { // 得分
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
        this.loadQuestion();
        this.loadLifeNum();
        this.content.removeChild(this.scrollItemTemplate); // 清除无用背景
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    loadLifeNum: function (player) {
        let self = this;
        self.scoreLabel.string = i18n.t("UI/DIE NUM") + self.player.lifeNum;
    },
    
    loadQuestion: function () {
        let self = this;
        let url = self.player.currentStory.toString();
        let urlArr = url.split('/');
        let fileName = urlArr[urlArr.length - 1].replace('.fire', '');
        if(1==1) {
            self.questionLabel.string = storycfg.chapter[url].question;
            // 加答案button
            let totalCount = storycfg.chapter[url].total;
            for(let i = 1; i <= totalCount; ++i) {
                let item = cc.instantiate(this.scrollItemTemplate);
                let answer = storycfg.chapter[url].answer[i].action;
                item.getComponent('ListItem').updateItem(i,
                    120 - ((item.height + 10 ) * (i - 1)), answer,i);
        		//let button = item.getComponent('ListItem').getComponent(cc.Button);
        		//button.clickEvents.push(new cc.Component.EventHandler( 
        		//    ));
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
    
    onButtonHandl(event) {
        let self = this;
        let node = event.target;
        let button = node.getComponent(cc.Button);
        let index = node.getComponent('ListItem').index;
        console.log(self.player.currentStory + " : " + index);
        if(index !== 0 && index !== -999) {
            let result = storycfg.chapter[
                self.player.currentStory].answer[index];
            self.questionLabel.string = result.result;
            self.content.removeAllChildren();
            let item = cc.instantiate(self.scrollItemTemplate);
            if(result.score !== 0) { // 死了
                self.player.lifeNum = self.player.lifeNum + result.score;
                item.getComponent('ListItem').updateItem(0, 120, '你死了！点击重来',0);
                self.player.alive = 0; // die
                this.loadLifeNum();
            } else {
                if(storycfg.total === self.player.currentStory){ // 通关
                    item.getComponent('ListItem').updateItem(-999, 120, '恭喜你！通关',-999);
                } else {
                    item.getComponent('ListItem').updateItem(0, 120, '恭喜你！点击继续',0);
                }
            }
            self.content.addChild(item);
        } else if (index === -999) { // 通关画面
            self.content.removeAllChildren();
            self.questionLabel.string = '通关了你还想怎样？';
        } else {
            if(self.player.alive !== 1) { // 死了
                self.player.currentStory = 1;
                self.player.alive = 1;
            } else {
                self.player.currentStory = self.player.currentStory + 1;
            }
            self.content.removeAllChildren();
            this.loadQuestion();
        }
    },
});
