import {hasParent} from '../utils/index';
import * as React from 'react';

interface CompProps {
    show?:boolean,
    onClose?:Function,
    x?:number,
    y?:number
}

class ContextMenu extends React.Component<CompProps>{
   
    componentWillReceiveProps(nextProps:CompProps){
        if(nextProps.show){
            //绑定document点击消失事件
            document.addEventListener('mousedown', this.handleClose, false);
        }else{
            //解绑
            document.removeEventListener('mousedown', this.handleClose, false);
        }
    }
    handleClose(e:any){
        if(!hasParent(e.target, this.refs.contextMenu)) {
            this.props.onClose();
        }
    }
    render(){
        const {show,x,y} = this.props;
        if(!show){
            return null;
        }
        return (
            <div ref="contextMenu" className="context-menu" style={{left:x,top:y}}>
                <ul className="unstyled">
                    {
                        React.Children.map(this.props.children, function(child){
                            return <li>{child}</li>
                        })
                    }
                </ul>
            </div>
        )
    }
};

export default ContextMenu;