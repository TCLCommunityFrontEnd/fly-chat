import {addClass,removeClass} from '../utils/index';
import * as React from 'react';
const objProperties=["length", "name", "arguments", "caller", "prototype"]; //一个类固定的属性方法

let chatWindow:any;
let isDragging=false;
let originalX= 0;
let originalY=0;
let translateX=0;
let translateY=0;
let currentTranslateX=0;
let currentTranslateY=0;
let transformName=document.body.style.webkitTransform!==undefined?'webkitTransform':'transform';//确定当前浏览器兼容的属性
let transformValue='';


export default (ChatComponent:any) => {
    let HocComponent:any = function(props:TypeInterface._Object){
        const {show} = props;
        function dragStart(e:any){
            //阻止默认行为，防止滚屏【注意：如果在滑动版面里有点击事件的话不要用此方法，否则点击事件会无法触发】
            e.preventDefault();
            //鼠标左键
            if(e.button==0) {
                addClass(document.body, 'no-select');
                addClass(chatWindow, 'dragging');
                isDragging = true;
                originalX = e.pageX;
                originalY = e.pageY;
            }
        }
        function dragMove(e:any){
            e.preventDefault();
            if (isDragging) {
                translateX=e.pageX-originalX;
                translateY=e.pageY-originalY;
                transformValue=`translate3d(${currentTranslateX+translateX}px,${currentTranslateY+translateY}px,0)`;
                chatWindow.style[transformName]=transformValue;
            }
        }
        function dragStop(e:any){
            e.preventDefault();
            if (isDragging) {
                removeClass(document.body, 'no-select');
                removeClass(chatWindow, 'dragging');
                isDragging = false;
                currentTranslateX+=translateX;
                currentTranslateY+=translateY;

                //清零，以免重复累加
                translateX=0;
                translateY=0;
            }
        }
        //事件委托形式
        function headerMouseDown(e:any){
            let target=e.target;
            while (target&&target!==document){
                if(target.id=='chatHeader'){
                    this.dragStart(e);
                    break;
                }
                target=target.parentNode;
            }
        }
        React.useEffect(()=>{
            chatWindow=document.getElementById('chatWindow');
            document.getElementById('chatMenu').addEventListener("mousedown", dragStart, false);
            document.addEventListener("mousedown", headerMouseDown, false);
            document.addEventListener("mousemove", dragMove, false);
            document.addEventListener("mouseup",dragStop, false);
            return function cleanup(){
                console.log('aa')
                document.getElementById('chatMenu').removeEventListener("mousedown", dragStart, false);
                document.removeEventListener("mousedown", headerMouseDown, false);
                document.removeEventListener("mousemove", dragMove, false);
                document.removeEventListener("mouseup", dragStop, false);
            }
        },[])
        const getStyle=function(){
            let style:TypeInterface._Object={};
            //显示隐藏动画相关
            let tv;
            if(show){
                tv=transformValue;
            }else{
                tv=`translate3d(-140px,0,0) scale(0.01)`; //scale不能为0，否则会意外地频闪且最小化的位置不准
            }
            style[(transformName=='transform'?'':'Webkit')+'Transform']=tv;
            return style;
        };
        return <ChatComponent {...props} getStyle={getStyle}/>
    }
    //继承静态方法
    const properties=Object.getOwnPropertyNames(ChatComponent);
    properties.forEach((name) => {
        if(!~objProperties.indexOf(name)){
            HocComponent[name]=ChatComponent[name];
        }
    });
    return HocComponent; 
}