import axios from 'axios';
import { Header } from "./header";
export function DeleteCallback(api, id){
    alert(api);
    alert(id);
    return axios
        .post( api, 
            {
                "id": id
                },
            { headers: Header() }
        ).then(response => {
            return response.data;
        });   
}