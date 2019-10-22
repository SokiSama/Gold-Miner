(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/JavaScript/Game/Main.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a7abbtxvtpLoq5yORxKD06b', 'Main', __filename);
// JavaScript/Game/Main.js

'use strict';

var _Config = require('./Config');

var _Config2 = _interopRequireDefault(_Config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

//引入 得分等配置 太长 所以换个文件写


cc.Class({
    extends: cc.Component,

    properties: {
        //钩子速度
        speed: {
            default: 3,
            displayName: '钩子速度'
        },
        //钩子旋转速度
        rotateSpeed: {
            default: 1,
            displayName: '钩子旋转速度'
        },
        //钩子范围
        HookRange: {
            default: 70,
            displayName: '钩子旋转角度范围'
        },
        //所有的prefab 这种方式是同步的 代码比较好写 就是难拖
        Prefabs: {
            default: [],
            type: cc.Prefab
        },
        InitTime: {
            default: 10
        },
        //钩子触碰到物品的声音
        CollisionAudio: {
            default: null,
            type: cc.AudioClip
        },
        //加分的声音
        AddScroeAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        /**
         * 初始化
         */
        this.init();

        //加载首页资源
        cc.director.preloadScene('Index');
    },


    /**
     * @description 初始化 各种需要的比变量
     */
    init: function init() {
        var _this = this;

        //钩子矿工
        this.Miner = cc.find('Canvas/Header/Miner');
        //矿工动画 
        this.MinerAnimation = this.Miner.getComponent(cc.Animation);
        //获取钩子
        this.Hook = cc.find('Canvas/Header/Miner/Hook');
        //获取钩子初始长度
        this.HookHeight = this.Hook.height;
        //放下钩子开关 0 停止 1 发射 2拉回
        this.HookState = 0;
        //得分累计
        this.Score = cc.find('Canvas/Header/Info/ScoreAndTarget/Score').getComponent(cc.Label);
        //通关目标分数
        this.TargetScore = cc.find('Canvas/Header/Info/ScoreAndTarget/Target').getComponent(cc.Label);
        //倒计时
        this.Time = cc.find('Canvas/Header/Info/CheckpointAndTime/Time').getComponent(cc.Label);
        //关卡数
        this.Checkpoint = cc.find('Canvas/Header/Info/CheckpointAndTime/Checkpoint').getComponent(cc.Label);
        //物品区域
        this.itemArea = cc.find('Canvas/ItemArea');
        //开启碰撞
        this.manager = cc.director.getCollisionManager();
        this.manager.enabled = true;
        // this.manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

        //重组prefab数组 方便查询
        this.Prefab = {};
        this.Prefabs.forEach(function (item) {
            _this.Prefab[item._name] = item;
        });

        //发射钩子按钮
        var emitHook = cc.find('Canvas/emitHookBtn');
        //重玩本关按钮
        var ReloadBtn = cc.find('Canvas/Mask/ReloadBtn');
        //暂停按钮
        var PauseBtn = cc.find('Canvas/Pause');
        //弹出框
        this.Mask = cc.find('Canvas/Mask');
        //游戏结束按钮 包括过关/结束游戏
        this.GameOverBtn = cc.find('Canvas/Mask/GameOverBtn');

        this.Mask.on(cc.Node.EventType.TOUCH_END, this.CloseMask.bind(this));

        this.GameOverBtn.on(cc.Node.EventType.TOUCH_END, this.Next.bind(this));

        emitHook.on(cc.Node.EventType.TOUCH_END, this.emitHookBtn.bind(this));

        ReloadBtn.on(cc.Node.EventType.TOUCH_END, this.Reload.bind(this));

        PauseBtn.on(cc.Node.EventType.TOUCH_END, this.ShowMask.bind(this));

        this.ResetInfo();
        this.StartTime();
        this.SetLevel();
        this.CreateTargetScor();
        this.CreateItem();
    },


    /**
     * @description 钩子旋转
     */
    HookRoTate: function HookRoTate() {
        if (this.HookState) return;

        //限制范围 只能在 70 与 -70 之间
        if (this.Hook.rotation >= 70) {
            this.rotateSpeed = -this.rotateSpeed;
        } else if (this.Hook.rotation <= -70) {
            this.rotateSpeed = Math.abs(this.rotateSpeed);
        };

        this.Hook.rotation += this.rotateSpeed;
    },


    /**
     * @description 发射钩子按钮事件
     */
    emitHookBtn: function emitHookBtn() {
        //TODO 停止钩子旋转
        //打开/关闭 钩子开关 没有拉回之前 当前position ！= 初始位置时 不允许操作
        if (this.HookState) return;

        this.HookState = 1;
    },


    /**
     * @description 发射钩子
     */
    emitHook: function emitHook() {
        switch (this.HookState) {
            case 1:
                this.Hook.height += this.speed;
                break;
            case 2:
                if (this.Hook.height <= this.HookHeight) {

                    //检测是否拉回物品
                    if (this.Hook.children[1].childrenCount) {
                        this.Handle(this.Hook.children[1].children);
                    };

                    this.StopHookMove();
                } else {
                    this.Hook.height -= this.speed;
                };
                break;
        };
    },


    /**
     * @description 拉回钩子
     */
    PullBackHook: function PullBackHook() {

        //播放拉回钩子动画
        this.MinerAnimation.play('PullRope');
        this.HookState = 2;
    },


    /**
     * 设置钩子拉回的速度
     */
    SetSpeed: function SetSpeed(other) {
        _Config2.default[other.node.name] = _Config2.default[other.node.name] || {};
        this.speed = _Config2.default[other.node.name].speed || 3;
    },


    /**
     * 重置所有分数信息
     */
    ResetInfo: function ResetInfo() {
        //this.victory 游戏胜利失败状态 0 = 游戏中 1 = 成功 2 = 失败
        this.victory = this.Score.string = this.Time.string = this.Checkpoint.string = this.TargetScore.string = 0;
    },


    /**
     * 启动倒计时
     */
    StartTime: function StartTime() {
        var _this2 = this;

        this.Time.string = this.InitTime;
        this.timer = setInterval(function () {
            _this2.InitTime--;
            _this2.Time.string = _this2.InitTime;
            if (_this2.InitTime <= 0) {
                clearInterval(_this2.timer);
                _this2.GameOver();
            };
        }, 1000);
    },


    /**
     * 设置关卡数
     */
    SetLevel: function SetLevel() {
        var level = cc.sys.localStorage.getItem('level');
        if (!level) {
            cc.sys.localStorage.setItem('level', 1);
        };

        this.Checkpoint.string = '\u7B2C' + cc.sys.localStorage.getItem('level') + '\u5173';
    },


    /**
     * 确定过关目标分数
     * 目标分数根据关卡关数确定 难度累加率为
     *  基数 1000
     *  每关递增500分
     * 
     * 最大 5000分
     */
    CreateTargetScor: function CreateTargetScor() {
        var level = cc.sys.localStorage.getItem('level') - 1;
        var targetScoreBase = 1000;
        var inc = 500;
        var targetScore = targetScoreBase + inc * level;
        this.TargetScore.string = targetScore > 5000 ? 5000 : targetScore;
    },


    /**
     * 生成物品 需要根据目标分来生成 生成的所有物品总分必须比目标过关分数高20%
     * 生成的物品数量在 10-30
     */
    CreateItem: function CreateItem() {
        var _this3 = this;

        var scoreBase = this.TargetScore.string + this.TargetScore.string * 0.2;
        var Range = parseInt(Math.random() * 20 + 10);
        //先从分数小的 加起来
        // 如果数量 超过范围限制的数量则删除1个添加一个大分数更大一点的 如果还超出范围 删除两个小的..

        //排序，将物品按分数排序
        var itemArr = this.sortItems();

        var newItemArr = this.CreateCalc(itemArr);
        //生成相应的Prfab
        newItemArr.forEach(function (item) {
            var node = cc.instantiate(_this3.Prefab[item._name]);
            var XY = _this3.randomXY();
            node.parent = _this3.itemArea;
            node.setPosition(XY);
        });
    },


    /**
     * 随机坐标
     */
    randomXY: function randomXY() {
        //x = 屏幕宽度 / 2 * 随机数
        //y = 地平面位置 + 随机数cc.random0To1() +高度范围（可以说是Y的最小点）
        //地平面位置 = 地面y + 地面 高度 / 2
        // - 30是因为物品锚点在中间位置 设置坐标到范围定点的时候 会有部分超出
        var groundY = this.itemArea.y + this.itemArea.height / 2;
        var randX = (this.itemArea.width - 30) / 2 * (Math.random() - 0.5) * 2;
        var randY = (this.itemArea.height - 30) / 2 * (Math.random() - 0.5) * 2;
        return cc.v2(randX, randY);
    },


    /**
     * 排序物品
     */
    sortItems: function sortItems() {

        var newArr = [];

        for (var key in _Config2.default) {
            _Config2.default[key].name = key;
            newArr.push(_Config2.default[key]);
        };

        newArr.sort(function (a, b) {
            return a.score > b.score ? 1 : -1;
        });

        return newArr;
    },


    /**
     * 生成所需的物品清单 每关递增一个钻石 保证最小分数下够分过关
     */
    CreateCalc: function CreateCalc() {
        var _this4 = this;

        //石头2-4个  14 -25
        var s = this.createRandm(2, 4);
        //黄金10-15个 500 500
        var g = this.createRandm(10, 15);
        //骨头1-3个
        var b = this.createRandm(1, 3);
        //钻石1-3个
        var d = this.createRandm(1, 3);

        var list = [{ name: 's', num: s }, { name: 'g', num: g }, { name: 'b', num: b }, { name: 'd', num: d }];

        var createItemArr = [];

        list.forEach(function (item) {

            switch (item.name) {
                case 's':
                    //TODO
                    createItemArr = [].concat(_toConsumableArray(createItemArr), _toConsumableArray(_this4.CreateItemType('Stone-', 0, 1, 0, 3, s)));
                    break;
                case 'g':
                    createItemArr = [].concat(_toConsumableArray(createItemArr), _toConsumableArray(_this4.CreateItemType('Gold-', 0, 1, 0, 3, g)));
                    break;
                case 'b':
                    createItemArr = [].concat(_toConsumableArray(createItemArr), _toConsumableArray(_this4.CreateItemType('Bone-', 0, 3, 0, 0, b)));
                    break;
                case 'd':
                    createItemArr = [].concat(_toConsumableArray(createItemArr), _toConsumableArray(_this4.CreateItemType('Drill', 0, 0, 0, 0, d)));
                    break;
            };
        });
        //每关累加1个钻石
        var level = cc.sys.localStorage.getItem('level') - 1;

        createItemArr = [].concat(_toConsumableArray(createItemArr), _toConsumableArray(this.CreateItemType('Drill', 0, 0, 0, 0, level)));

        return createItemArr;
    },

    /**
     * 分类创建物品
     */
    CreateItemType: function CreateItemType(name, a1, a2, b1, b2, num) {
        var arr = [];
        for (var i = 0; i < num; i++) {
            //拼接name
            var min = this.createRandm(a1, a2);
            var max = this.createRandm(b1, b2);
            var str = '';
            if (name == 'Bone-') {
                str = name + min;
            } else if (name == 'Drill') {
                str = name;
            } else {
                str = name + min + '-' + max;
            };
            arr.push(this.Prefab[str]);
        };
        return arr;
    },


    /**
     * 生成n-m随机数
     */
    createRandm: function createRandm(n, m) {
        m += 1;
        var a = m - n;
        var num = Math.random() * a + n;
        return parseInt(num);
    },


    /**
     * @description 关闭绳子状态
     */
    StopHookMove: function StopHookMove() {
        this.HookState = 0;
        this.Hook.height = this.HookHeight;
        //停止播放拉回动画
        this.MinerAnimation.stop('PullRope');
        //重置发射钩子速度
        this.speed = 3;
    },


    /**
     * @description 处理拉回的物品，删除物品以及添加得分
     */
    Handle: function Handle(items) {
        this.AddScore(items);
        this.RemoveItem(items);
    },


    /**
     * @description 删除物品
     */
    RemoveItem: function RemoveItem(items) {
        items.forEach(function (item) {
            item.destroy();
        });
    },

    /**
     * @description 添加得分
     */
    AddScore: function AddScore(items) {
        if (!items[0]) return;
        var scoreCon = _Config2.default[items[0].name] || {};
        this.Score.string = parseInt(this.Score.string) + (scoreCon.score || 0);
        //播放得分音效
        cc.audioEngine.play(this.AddScroeAudio);
    },


    /**
     * 暂停游戏
     */
    _GamePauseAminationCallBack: function _GamePauseAminationCallBack() {
        cc.game.pause();
    },


    /**
     * 显示Mask
     */
    ShowMask: function ShowMask() {
        //显示弹出框
        var finished = cc.callFunc(this._GamePauseAminationCallBack, this);
        var action = cc.sequence(cc.scaleTo(0.3, 1, 1), finished);
        var str = '';
        action.easing(cc.easeBounceOut(0.3));
        //修改显示的文字
        if (this.victory == 1) {
            str = '下一关';
        } else if (this.victory == 2) {
            str = '退出游戏';
        } else {
            str = '继续游戏';
        };
        this.GameOverBtn.children[0].getComponent(cc.Label).string = str;

        this.Mask.runAction(action);
    },


    /**
     * 恢复游戏，关闭弹出框
     * 如果是游戏通关原因而打开的弹出框不予理睬
     */
    CloseMask: function CloseMask() {
        if (this.victory) return;
        var action = cc.scaleTo(0.2, 0, 0);
        cc.game.resume();
        this.Mask.runAction(action);
    },


    /**
     * 重玩本关
     */
    Reload: function Reload() {
        cc.game.resume();
        //停止倒计时
        this.timer && clearInterval(this.timer);
        //重载场景
        cc.director.loadScene('Game');
    },


    /**
     * 继续下一关
     */
    Next: function Next() {

        switch (this.victory) {
            case 0:
                //继续游戏
                this.CloseMask();
                break;
            case 1:
                //胜利
                var cur = this.Checkpoint.string.match(/\d+/)[0];
                cc.sys.localStorage.setItem('level', parseInt(cur) + 1);
                this.Reload();
                break;
            case 2:
                //退出游戏
                this.ExitGame();
                break;
        };
    },


    /**
     * 退出游戏 返回上一个场景
     */
    ExitGame: function ExitGame() {
        cc.game.resume();
        cc.director.loadScene('Index');
    },


    /**
     * 游戏结束
     * 胜利或失败都视为游戏结束
     */
    GameOver: function GameOver() {
        //判断用户得分是否超过目标分
        var s = 0;

        if (this.Score.string >= this.TargetScore.string) {
            s = 1;
        } else {
            //游戏失败
            s = 2;
        };
        this.victory = s;
        this.ShowMask();
    },


    // start () {

    // },

    update: function update(dt) {
        this.emitHook();
        this.HookRoTate();
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Main.js.map
        