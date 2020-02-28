
declare const APP_NAME:string;
declare const APP_LOGO_EN:any;
declare const APP_LOGO_ZH:any;
declare const NEED_AUTH:string;


declare namespace TypeInterface {
    interface _Object {
        [key:string]:any

    }
}

declare namespace ComponentPropsInterface {
    interface RootProps {
        locale:string,
        store:any,
        loadLang?:Function,
        init?:Function,
        langs?:TypeInterface._Object,
        onWillMount?:Function
    }
}