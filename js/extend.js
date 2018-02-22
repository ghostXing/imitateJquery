//基础框架
function $$() {

}

$$.prototype = {
    extend: function (source, json) {
        var obj = source;
        for (var key in json) {
            obj[key] = json[key];
        }
        return obj;
    }
};
//实例化
$$ = new $$();
//选择框架
$$.extend($$, {
    $id: function (id) {
        return document.getElementById(id);
    },
    $tag: function (tag, context) {
        var dom;
        if (context) {
            dom = context;
        } else {
            dom = document;
        }
        return dom.getElementsByTagName(tag);
    },
    $class: function (className, context) {
        var arr = [], dom;
        if (context) {
            dom = context.getElementsByTagName("*");
        } else {
            dom = document.getElementsByTagName("*");
        }
        for (var i = 0; i < dom.length; i++) {
            var item = dom[i];
            if (item.className === className) {
                arr.push(item);
            }
        }
        return arr;
    },
    //分组选择器
    $group: function (str) {
        var arr = [];
        var result = [];
        arr = str.split(",");
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            var flag = item.charAt(0);
            var index = item.indexOf(flag);
            var value = item.substring(index + 1);
            if (flag === "#") {
                result.push($$.$id(value));
            } else if (flag === ".") {
                var classArr = $$.$class(value);
                for (var j = 0; j < classArr.length; j++) {
                    result.push(classArr[j]);
                }
            } else {
                var tagArr = $$.$tag(item);
                for (var j = 0; j < tagArr.length; j++) {
                    result.push(tagArr[j]);
                }
            }
        }
        return result;
    },
    //层级选择器
    $layer: function (str) {
        var arr = [];
        var result = [], context = [];
        arr = str.split(" ");
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            var flag = item.charAt(0);
            var index = item.indexOf(flag);
            var value = item.substring(index + 1);
            if (flag === "#") {
                result = [];
                result.push($$.$id(value));
                context = result;
            } else if (flag === ".") {
                result = [];
                if (context.length > 0) {
                    for (var j = 0; j < context.length; j++) {
                        pushArray(result, $$.$class(value, context[j]));
                    }
                } else {
                    pushArray(result, $$.$class(value));
                }
                context = result;
            } else {
                result = [];
                if (context.length > 0) {
                    for (var j = 0; j < context.length; j++) {
                        pushArray(result, $$.$tag(item, context[j]));
                    }
                } else {
                    pushArray(result, $$.$tag(item));
                }
                context = result;
            }
        }

        function pushArray(result, arr) {
            for (var z = 0; z < arr.length; z++) {
                result.push(arr[z]);
            }
        }

        return result;
    },
    //分组层级选择器
    $apart: function (str) {
        var arr = [];
        var result = [];
        arr = str.split(",");
        for (var i = 0; i < arr.length; i++) {
            pushArray(result, $$.$layer(arr[i]));
        }

        function pushArray(result, arr) {
            for (var z = 0; z < arr.length; z++) {
                result.push(arr[z]);
            }
        }

        return result;
    },
    //h5选择器
    $all: function (str, target) {
        var dom = target || document;
        return dom.querySelectorAll(str);
    }
});
//数据类型判断框架
$$.extend($$, {
    isNumber: function (val) {
        return typeof val === 'number' && isFinite(val)
    },
    isBoolean: function (val) {
        return typeof val === "boolean";
    },
    isString: function (val) {
        return typeof val === "string";
    },
    isUndefined: function (val) {
        return typeof val === "undefined";
    },
    isObj: function (str) {
        if (str === null || typeof str === 'undefined') {
            return false;
        }
        return typeof str === 'object';
    },
    isNull: function (val) {
        return val === null;
    },
    isArray: function (arr) {
        if (arr === null || typeof arr === 'undefined') {
            return false;
        }
        return arr.constructor === Array;
    }
});
//事件框架
$$.extend($$, {
    on: function (id, type, fn) {
        var dom = $$.isString(id) ? document.getElementById(id) : id;
        return dom.addEventListener(type, fn, false);
    },
    click: function (id, fn) {
        return this.on(id, "click", fn);
    },
    mouseover: function (id, fn) {
        return this.on(id, "mouseover", fn);
    },
    mouseout: function (id, fn) {
        return this.on(id, "mouseout", fn);
    },
    hover: function (id, overfn, outfn) {
        this.mouseover(id, overfn);
        this.mouseout(id, outfn);
    },
    getEvent: function (e) {
        var event = event || window.event;
        return event;
    },
    getTarget: function (e) {
        var target = this.getEvent(e).target || this.getEvent(e).srcElement;
        return target;
    },
    //阻止冒泡
    stopPropagation: function (e) {
        var event = $$.getEvent(e);
        if (event.stopPropagation) {
            event.stopPropagation()
        } else {
            //IE阻止冒泡
            event.cancelBubble = true;
        }
    },
    //阻止默认行为
    preventDefault: function (e) {
        var event = $$.getEvent(e);
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
});
//样式框架
$$.extend($$, {
    css: function (context, key, value) {
        var doms = $$.isString(context) ? $$.$all(context) : context;
        //设置多个dom元素
        if (doms.length) {
            //设置模式
            if (value) {
                for (var i = 0; i < doms.length; i++) {
                    setOneStyle(doms[i], key, value);
                }
            } else {
                //获取模式
                return getStyle(doms[0], key);
            }
        } else {
            //设置单个dom元素
            if (value) {
                //设置
                setOneStyle(doms, key, value);
            } else {
                //获取
                return getStyle(doms, key);
            }
        }

        function setStyle(doms, key, value) {
            for (var i = 0; i < doms.length; i++) {
                var dom = doms[i];
                dom.style[key] = value;
            }
        }

        //设置单个样式值
        function setOneStyle(dom, key, value) {
            var dom = dom;
            dom.style[key] = value;
        }

        //获取样式
        function getStyle(dom, key) {
            if (dom.currentStyle) {
                return dom.currentStyle[key];
            } else {
                return window.getComputedStyle(dom, null)[key];
            }
        }
    },

});
//属性框架
$$.extend($$, {
    attr: function (context, key, value) {
        var doms = $$.isString(context) ? $$.$all(context) : context;
        if (value) {
            for (var i = 0; i < doms.length; i++) {
                doms[i].setAttribute(key, value);
            }
        } else {
            return doms[0].getAttribute(key);
        }
    },
    addClass: function (context, name) {
        var doms = $$.$all(context);
        for (var i = 0; i < doms.length; i++) {
            addName(doms[i], name);
        }

        //单个
        function addName(dom, name) {
            dom.className = dom.className + " " + name;
        }
    },
    removeClass: function (context, name) {
        var doms = $$.$all(context);
        for (var i = 0; i < doms.length; i++) {
            removeName(doms[i], name);
        }

        //单个
        function removeName(dom, name) {
            dom.className = dom.className.replace(name, " ");
        }
    },
    html: function (context, value) {
        var doms = $$.$all(context);
        if (value) {
            for (var i = 0; i < doms.length; i++) {
                doms[i].innerHTML = value;
            }
        } else {
            return doms[0].innerHTML;
        }
    }
});