var chatConfig=require('../config/chat');
export function objectAppend(obj0:TypeInterface._Object, obj:TypeInterface._Object){
    for(var k in obj){
        if(!obj0.hasOwnProperty(k)){
            obj0[k]=obj[k];
        }
    }
    return obj0;
}

/**
 * 图片转表情码
 * @param content
 * @returns {*}
 */
export function encodeFace(content:string){
    return content.replace(/<img.+?alt="(.+?)".*?>/gi, '$1');
}

/**
 * 表情码转图片
 * @param content
 * @returns {*}
 */
export function decodeFace(content:string){
    return content.replace(/\[(.+?)\]/g, function(match, $1){
        if(~chatConfig.emoticonNames.indexOf($1)){
            return '<img class="emoticon-'+$1+'" src="data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw==">';
        }else{
            return match;
        }
    });
}

export function hasParent(currentNode:any, parentNode:any) {
    var flag = false;

    recurse(currentNode);

    //递归往上找父节点
    function recurse(nextParent:any) {
        if (nextParent === parentNode) {
            flag = true;
        } else if (nextParent.parentNode && nextParent.parentNode !== document.body) {
            //住上找到body节点为止
            recurse(nextParent.parentNode);
        }
    }

    return flag;
}

function hasClass(element:any, className:string) {
    if (!className) {
        throw new Error('参数"className"不能为空！');
    }
    var result:any = false;
    if (element.getAttribute('class')) {
        var classList = element.getAttribute('class').split(/\s+/);
        result = ~classList.indexOf(className);
    }
    return result;
}

export function addClass(element:any, className:string) {
    if (!className) {
        throw new Error('参数"className"不能为空！');
    }
    var classNames = [];

    //原来的class
    if (element.getAttribute('class')) {
        classNames = element.getAttribute('class').split(/\s+/);
    }

    //没有才添加
    if (hasClass(element, className)) {
        //新增的class
        classNames.push(className);

        //更新
        element.setAttribute('class', classNames.join(' '));
    }
}


export function removeClass(element:any, className:string) {
    if (!className) {
        throw new Error('参数"className"不能为空！');
    }
    var classNames = [];

    //原来的class
    if (element.getAttribute('class')) {
        classNames = element.getAttribute('class').split(/\s+/);
    }

    //判断指定class是否存在于元素中
    if (hasClass(element, className)) {
        //移除指定class
        classNames.splice(classNames.indexOf(className), 1);

        //更新
        element.setAttribute('class', classNames.join(' '));
    }
}

/**
* 在指定容器的指定光标位置插入内容节点
* @param node
* @param container
*/
export function insertAtCursor(node:any, container:any) {
   var selection = window.getSelection();
   var range;
   //判断全局的选择是否指定区域内
   if (container && (!selection.anchorNode || !hasParent(selection.anchorNode, container))) {
       container.focus();
       range = document.createRange();
       range.selectNodeContents(container);
       range.setStart(container, container.childNodes.length);
   } else {
       range = selection.getRangeAt(0);
   }
   //插入到范围的开始点
   range.insertNode(node);
   //设置范围的开始点到插入的内容之后（即把光标显示在插入内容之后，否则是在之前的）
   range.setStartAfter(node);
   //刷新选择的内容（一个Selection只允许有一个Range，因这里的Range有改变过，故需在add前清除掉）
   selection.removeAllRanges();
   selection.addRange(range);
}

/**
 * 判断传入数据是否为空
 * @param val
 * @returns {*}
 */
export function isEmpty(val:any){
    switch(Object.prototype.toString.call(val)){
        case '[object Array]':
            return !(val&&val.length);
        case '[object Object]':
            return !(val&&JSON.stringify(val)!=='{}');
        case '[object Null]':
            return true;
        case '[object Undefined]':
            return true;
        case '[object Boolean]':
            return false;
        case '[object String]':
            return val==='';
        default:
            return false;
    }
}