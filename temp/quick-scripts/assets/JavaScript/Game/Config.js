(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/JavaScript/Game/Config.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b35e46X56JFDLgpM8QxzYgM', 'Config', __filename);
// JavaScript/Game/Config.js

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
//物品属性
//速度： 0.8 ： 超慢 ：非常慢，1 ， 2 ：慢 ， 3 ： 一般，5 ：快 ， 6 ： 很快
exports.default = {
    //钻石
    "Drill": {
        "score": 500,
        "speed": 6
    },
    //骨头
    "Bone-0": {
        "score": 10,
        "speed": 5
    },
    //骨头
    "Bone-1": {
        "score": 10,
        "speed": 5
    },
    //骨架
    "Bone-2": {
        "score": 50,
        "speed": 3
    },
    //骨头
    "Bone-3": {
        "score": 10,
        "speed": 5
    },
    //黄金 小
    "Gold-0-0": {
        "score": 50,
        "speed": 6
    },
    //黄金 中
    "Gold-0-1": {
        "score": 100,
        "speed": 5
    },
    //黄金 大
    "Gold-0-2": {
        "score": 200,
        "speed": 3
    },
    //黄金 超大
    "Gold-0-3": {
        "score": 300,
        "speed": 1
    },
    //黄金 小
    "Gold-1-0": {
        "score": 50,
        "speed": 6
    },
    //黄金 中
    "Gold-1-1": {
        "score": 100,
        "speed": 5
    },
    //黄金 大
    "Gold-1-2": {
        "score": 200,
        "speed": 3
    },
    //黄金 超大
    "Gold-1-3": {
        "score": 300,
        "speed": 1
    },
    //石头 小
    "Stone-0-0": {
        "score": 10,
        "speed": 3
    },
    //石头 中
    "Stone-0-1": {
        "score": 30,
        "speed": 2
    },
    //石头 大
    "Stone-0-2": {
        "score": 60,
        "speed": 1
    },
    //石头 超大
    "Stone-0-3": {
        "score": 100,
        "speed": 0.8
    },
    //石头 小
    "Stone-1-0": {
        "score": 10,
        "speed": 3
    },
    //石头 中
    "Stone-1-1": {
        "score": 30,
        "speed": 2
    },
    //石头 大
    "Stone-1-2": {
        "score": 60,
        "speed": 1
    },
    //石头 超大
    "Stone-1-3": {
        "score": 100,
        "speed": 0.8
    }
};
module.exports = exports["default"];

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
        //# sourceMappingURL=Config.js.map
        