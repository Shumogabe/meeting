import { DATETIME } from '../config';
export function getText(value){
    try{
        let val = value.trim();
        if(val == null) return null;
        else if(val == undefined) return null;
        else if(val == 'undefined') return null;
        else if(val == 'null') return null;
        else if(val == '') return null;
        else return value;
    }
    catch{
        return null;
    }
}
export function getHtmlContent(value){
    try{
        if(value == null) return null;
        else if(value == undefined) return null;
        else if(value == 'undefined') return null;
        else if(value == 'null') return null;
        else if(value == '') return null;
        else return value;
    }
    catch{
        return null;
    }
}
export function getNumber(value){
    try{
        if(value == null) return 0;
        else if(value == undefined) return 0;
        else if(value == 'undefined') return 0;
        else if(value == 'null') return 0;
        else if(value == '') return 0;
        else if(value == '0') return 0;
        else if(value == 0) return 0;
        else return value;
    }
    catch{
        return 0;
    }
}
export function getBoolean(value){
    try{
        if(value == null) return false;
        else if(value == undefined) return false;
        else if(value == 'undefined') return false;
        else if(value == 'null') return false;
        else if(value == '') return false;
        else if(value == '0') return false;
        else if(value == 0) return false;
        else if(value == 'false') return false;
        else if(value == false) return false;
        else return true;
    }
    catch{
        return 0;
    }
}
export function getDateTime(value){
    if(value == null) return DATETIME.NULL;
    else if(value == undefined) return DATETIME.NULL;
    else if(value == 'undefined') return DATETIME.NULL;
    else if(value == 'null') return DATETIME.NULL;
    else if(value == '') return DATETIME.NULL;
    else return value;
}