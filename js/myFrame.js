//frame by Mr Jin
function $$() {

}
$$.prototype = {
    $id: function (id) {
        return document.getElementById(id);
    },
    $tag: function (tag) {
        return document.getElementsByTagName(tag);
    },
    extend: function (source,json) {
        var obj = source;
        for( var key in json) {
            obj[key] = json[key];
        }
        return obj;
    }
};
var $$ = new $$();
$$.extend($$,{
    on: function (id,type,fn) {
        var dom = document.getElementById(id);
        return dom.addEventListener(type,fn);
    }
})