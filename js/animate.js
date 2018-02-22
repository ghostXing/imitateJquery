//动画框架
function  Animate () {
    //句柄
    this.timer = null;
    this.interval = 15;
    this.queen = [];
}
Animate.prototype = {
    //用户输入数据入口
    add: function (context,json,duration) {
        this.adapter(context,json,duration);
        this.run();
    },
    //运行函数
    run: function () {
        var that = this;
        this.timer = setInterval(function () {
            that.loop();
        },that.interval);
    },
    //每次循环的函数
    loop: function () {
        for(var i = 0,len = this.queen;i < len.length;i++ ) {
            this.move(len[i]);
        }
    },
    //每次循环的运动函数
    move: function (data) {
        var tween = this.getTween(data);
        // console.log(tween);
        if(tween > 1) {
            this.stop();
        } else {
            this.manyProperty(data,tween);
        }
    },
    //获取时间进程
    getTween: function (data) {
        var pass = +new Date();
        return (pass - data.now) / data.duration;
    },
    //单物体，多属性
    manyProperty: function (data,tween) {
        for ( var i = 0; i < data.jsonArray.length; i++) {
            this.oneProperty(data,data.jsonArray[i],tween)
        }
    },
    //单物体，单属性
    oneProperty: function (data,obj,tween) {
        if(obj.name === "opacity") {
            $$.css(data.context,obj.name,obj.origin + obj.s * tween);
        } else {
            $$.css(data.context,obj.name,obj.origin + obj.s * tween + "px");
        }
    },
    //提高用户体验，数据适配器
    adapter: function (context,json,duration) {
        //每个物体中储存的数据
        var data = {};
        data.context = context;
        data.now = +new Date();
        data.duration = duration;
        data.jsonArray = this.getStyle(context,json);
        this.queen.push(data);
    },
    getStyle: function (context,json) {
        //储存每个物体中的运动属性
        var jsonArray = [];
        for(var item in json) {
            var obj = {};
            obj.name = item;
            obj.origin = parseFloat($$.css(context,item));
            obj.s = parseFloat(json[item]) - obj.origin;
            jsonArray.push(obj);
        }
        //显示jsonArray中转换的数据
        console.log(jsonArray);
        return jsonArray;
    },
    //停止
    stop: function () {
        clearInterval(this.timer);
    },
    //内存回收函数
    destroy: function () {

    }
};
//对象实例化
var animate = new Animate();
