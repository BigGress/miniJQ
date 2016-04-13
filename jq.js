
var $ = function(select){

    if($.isString(select)){
        return document.querySelectorAll(select);
    }else{
        throw new Error("$ function must be string")
    }
}
/**
* @describe 判断元素是不是数组
* @param arr = [any] 输入任何变量、数组都可以
* @return 返回boolean
* */
$.isArray = function(arr){
    return $.objtype(arr) === "[object Array]";
}
/**
 * @describe 判断元素是不是字符串
 * @param str = [any] 输入任何变量、数组都可以
 * @return 返回boolean
 * */
$.isString = function(str){
    return $.objtype(str) === "[object String]";
}

$.param = function(obj){
    var arr = [];
    for(var name in obj){
        if(Object.prototype.toString.call(obj[name]) === "[object Array]"){
            arr.push(arrObjToStr(obj[name],name))
        }else if(Object.prototype.toString.call(obj[name]) === "[object Object]"){
            for(var child in obj[name]){
                arr.push(encodeURIComponent(name+"["+child+"]")+"="+encodeURIComponent(obj[name][child]))
            }
        }else{
            arr.push(encodeURIComponent(name)+"="+encodeURIComponent(obj[name]))
        }
    }
    function arrObjToStr(arrObj,parent_name){
        var arr=[];
        var checktype=Object.prototype.toString
        if(checktype.call(arrObj) === "[object Array]"){
            for(var i=0;i<arrObj.length;i++){
                if(checktype.call(arrObj[i])=== "[object Object]"){
                    for (var name in arrObj[i]) {
                        arr.push(encodeURIComponent(parent_name+"["+i+"]"+"["+name+"]") + "=" + encodeURIComponent(arrObj[i][name]));
                    }
                }
            }
        }else{
            arr.push()
        }
        return arr.join("&").replace(/%20/g,"+")

    }
    return arr.join('&')
}
/**
 * @describe 判断参数类型
 * @param obj = [any] 输入任何变量、数组都可以
 * @return 返回对象元素
 * */
$.objtype = function(obj){
    return Object.prototype.toString.call(obj)
}

$.ajax = function(){
    if($.objtype(arguments[0]).match(/Object/)){
        var obj = arguments[0]
        var ajax = new XMLHttpRequest();
        ajax.open(obj.type||"GET",obj.url,obj.async||"true");

        if(obj.header){
            ajax.setRequestHeader(obj.header.split(":")[0],obj.header.split(":")[1]);
        }else{
            ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        }

        if($.objtype(obj.data).match(/String/)){
            ajax.send(obj.data)
        }else{
            ajax.send($.param(obj.data))
        }

        ajax.overrideMimeType(obj.type||"text/xml")

        if(obj.beforeSend){
            ajax.onloadstart = function(){
                obj.beforeSend()
            }
        }


        if(obj.async!="false"&&obj.success){
            ajax.onreadystatechange = function(){
                if(ajax.readyState==4&&ajax.status==200||400){
                    obj.success(ajax.responseText)

                }else {
                    console.error(ajax.onerror)
                }
            }
        }



    }else{
        console.error("arguments is not a object")
    }
}
/**
* @describe 图片预加载策略,新建仅仅支持图片、css、js
* @param imgURL = [URLString[]] 这里输入图片地址，必须是数组形式
* @return imgElement 直接返回了图片元素
* */
$.preload = function(){
    if($.objtype(arguments[0]).match(/String/)){
        preloadFn(arguments[0],arguments[1],arguments[2])
    }else if($.objtype(arguments[0]).match(/Array/)){
        for(var i=0;i<arguments[0].length;i++){
            preloadFn(arguments[0][i],arguments[1],arguments[2])
        }
    }else{
        console.error("arguments must string or array")
    }

    /**
    * @describe 预加载函数
    * */
    function preloadFn(str,callback1,callback2){
        if(str.match(/\.jpg|png|gif$/)){
            var img = new Image();

            img.onloadstart = function(){
                if(callback2) callback2();
            }

            img.onload =function(){
                if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
                    if(callback1) callback1(img);
                }
            }
            img.src = str;
        }else if(str.match(/\.js$/)){
            var jsel = document.createElement('script');
            jsel.type = "text/javascript";
            jsel.async = true;
            jsel.src = str;
            document.getElementsByTagName("body")[0].appendChild(jsel);
            jsel.onloadstart = function(){
                if(callback2) callback2(jsel);
            }
            jsel.onload = function(){
                console.dir(this)
                if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
                    if(callback1) callback1(jsel);
                }
            }
        }else if(str.match(/\.css$/)){
            var cssel = document.createElement("link");
            cssel.rel="Stylesheet";
            cssel.href=str;
            document.getElementsByTagName("body")[0].appendChild(cssel);
            cssel.onloadstart =function(){
                if(callback2) callback2(cssel);
            }
            cssel.onload =function(){
                if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
                    if(callback1) callback1(cssel);
                }
            }
        }
    }
}
/**
 * @describe 动态添加dom元素
 * @param parent = [Element] 输入父元素
 *        obj = [childObj]
 *        childObj输入子元素类型
 *        childObj有以下属性：
 *              element: [DomName] 创建的元素标签
 *              id: [String] 元素对应的id
 *              className:[String] 元素对应的class
 *              attr:[String|Object] 可以输入字符串或者元素对应的元素属性
 *              children:Object 这个对象可以直接输入这个元素对应的子元素
 *              text: 这个元素的下的文字
 *
 *        callback = [Function] 这是个回调函数,参数是创建出来的元素
 * @example
 *  $.addEl($("body")[0],{
 *      element:"div",
 *      id:"test,
 *      className:"abc",
 *      这里属性有两种写法，一种对象，一种是字符串
 *
 *      //attr:"data-id='abc',onclick=Function",
 *      attr:{
 *         "data-id":'abc',
 *         onclick:Function
 *      }
 *      children:Object, children 的写法就是父元素的写法
 *      text:"这是一个测试",
 *
 *  },function(el){})
 *
 * */
$.addEl = function(parent,obj,callback){
    var option = {
        element:obj.element || "div",
        id:obj.id,
        className:obj.className,
        attr:obj.attr,
        children:obj.children,
        text:obj.text
    }

    var el = document.createElement(option.element);
    //判断是否为dom元素
    if(!/HTML/g.test($.objtype(parent))){
        throw new Error("父元素不是DOM");
        return false;
    }
    //设置元素id
    if(!!obj.id){
        el.id = obj.id
    }
    //设置元素class
    if(!!obj.className){
        el.className = obj.className
    }
    //设置元素属性
    if($.isString(obj.attr)){
        obj.attr = $.stringToObjForAddElFunction(obj.attr);
    }
    if(!!obj.attr){
        for(var i in obj.attr){
            el.setAttribute(i,obj.attr[i])
        }
    }
    //设置元素内容
    if(!!obj.text){
        el.innerText = obj.text
    }
    //判断是否有子元素
    if(!!obj.children){
        if($.isArray(obj.children)){
            obj.children.map(function(els){
                $.addEl(el,els)
            })
        }else{
            $.addEl(el,obj.children)
        }
    }

    if(callback) callback(el);

    try {
        parent.appendChild(el)
    }catch (e){
        throw new Error("发生错误")
    }
}
/**
 * @describe 这个函数是为了addEl函数中的obj.attr这个对象准备的，如果是字符串就切成对象
 * @param str = [string]
 * @return object
 * */
$.stringToObjForAddElFunction = function(str){
    if($.isString(str)){
        //先根据逗号划分所有字符串
        var str = str.split(",");
        var objArr = [],obj={};
        for(var i=str.length;i--;){
            //先根据等号划分所有字符串
            objArr = objArr.concat(str[i].split("="));
        }
        console.log(objArr.length)
        for(var i=0;i<objArr.length;i=i+2){
            console.log(i);
            obj[objArr[i]] = objArr[i+1]
        }
        return obj
    }else{
        throw new Error("输入的必须是数组")
    }
}