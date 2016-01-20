
var $ = function(select){
    var re = new RegExp(/^\#/g),
        sel = re.exec(select),
        space = new RegExp(/\s/g),
        searchSpace = space.exec(select),
        reEl;

    if(sel){
        reEl = document.querySelector(select);
    }else{
        if(searchSpace){
            reEl = document.querySelector(select);
        }else{
            reEl = document.querySelectorAll(select);
        }
    }

    if(reEl.length === 1){
        return reEl[0];
    }else{
        return reEl;
    }
}

$.isArray = function(obj){
    return Object.prototype.toString.call(obj) === "[object Array]";
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

$.objtype = function(){
    return Object.prototype.toString.call(arguments[0])
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
                if(ajax.readyState==4&&ajax.status==200){
                    if(ajax.responseXML){
                        obj.success(ajax.responseXML)
                    }else{
                        obj.success(ajax.responseText)
                    }
                }else {
                    console.error(ajax.onerror)
                }
            }
        }



    }else{
        console.error("arguments is not a object")
    }
}

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

    function preloadFn(str,callback1,callback2){
        if(str.match(/\.jpg$/)){
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


