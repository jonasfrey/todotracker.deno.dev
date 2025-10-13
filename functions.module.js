
let s_path_abs_file_current = new URL(import.meta.url).pathname;
let s_path_abs_folder_current = s_path_abs_file_current.split('/').slice(0, -1).join('/');

let f_o_config = async function(){
    let s_json__o_config = await Deno.readTextFile(
        `${s_path_abs_folder_current}/o_config.gitignored.json`
    );
    return JSON.parse(s_json__o_config);
}

let f_o_ws_client = function
    constructor(
        s_uuidv4,
        s_uuid_hashed,
        o_socket
    ){
        return {
            s_uuidv4: s_uuidv4,
            s_uuid_hashed: s_uuid_hashed,
            o_socket: o_socket
        }

    }


export {
    f_o_config,
    f_o_ws_client
}