cc.Class({
    extends: cc.Component,

    properties: {
        displayName: 'Jane',  // 主角名字
        lifeNum: 0,  // 死亡次数
        currentStory: 0, // 当前进行的故事节点编号
        alive: 1,
    },

    // use this for initialization
    onLoad: function () {
      
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    selectAction: function (selectId) {
        return currentStory;
    },
    
    selectSound: function () {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.selectAudio, false);
    },
});
