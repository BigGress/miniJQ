
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
    return Object.prototype.toString.call(obj) === "[object Array]"
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