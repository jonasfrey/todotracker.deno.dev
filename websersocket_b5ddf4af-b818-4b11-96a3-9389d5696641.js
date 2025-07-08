
import {
    f_websersocket_serve,
    f_v_before_return_response__fileserver
} from "https://deno.land/x/websersocket@5.0.0/mod.js"


import {
    O_ws_client
} from "./classes.module.js"
import { ensureDir } from "https://deno.land/std@0.224.0/fs/ensure_dir.ts";

import { f_o_config } from "./functions.module.js";
import {
    f_a_o_entry__from_s_path
} from "https://deno.land/x/handyhelpers@5.0.0/mod.js"

let s_path_abs_file_current = new URL(import.meta.url).pathname;
let s_path_abs_folder_current = s_path_abs_file_current.split('/').slice(0, -1).join('/');
const b_deno_deploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;

let a_o_ws_client = []

const o_kv = await Deno.openKv();
let s_prefix = 'todotracker.deno.dev';
// let o_config = await f_o_config();
// console.log({o_config});

// let s_path_abs_folder_cached_shaders = './folder_to_ensure';
// if(!b_deno_deploy){
//     await ensureDir(s_path_abs_folder_cached_shaders)// deno deploy is read only...
// }



let f_handler = async function(o_request){

    // websocket 'request' handling here
    if(o_request.headers.get('Upgrade') == 'websocket'){

        const {
            socket: o_socket,
            response: o_response
        } = Deno.upgradeWebSocket(o_request);
        let o_ws_client = new O_ws_client(
            crypto.randomUUID(),
            o_socket
        )
        a_o_ws_client.push(o_ws_client);

        o_socket.addEventListener("open", (o_e) => {
            console.log({
                o_e, 
                s: 'o_socket.open called'
            })
        });

        o_socket.addEventListener("message", async (o_e) => {
            console.log({
                o_e, 
                s: 'o_socket.message called'
            })
            let v_data = o_e.data;
            a_o_ws_client
                .filter(o=>o!=o_ws_client)  // send to all other clients, comment out to send to all clients
                .forEach(o=>{
                    o.o_socket.send('message was received from a client')

                })
        });
        o_socket.addEventListener("close", async (o_e) => {
            a_o_ws_client.splice(a_o_ws_client.indexOf(o_ws_client), 1);
            console.log({
                o_e, 
                s: 'o_socket.close called'
            })
        });

        return o_response;
    }
    // normal http request handling here
    let o_url = new URL(o_request.url);
    if(o_url.pathname == '/'){
        return new Response(
            await Deno.readTextFile(
                `${s_path_abs_folder_current}/localhost/client.html`
            ),
            { 
                headers: {
                    'Content-type': "text/html"
                }
            }
        );
    }
    if(o_url.pathname == '/read'){
        let o_post_data = await o_request.json();
        // console.log(o_post_data)
        let a_a_n_u8 = [];
        let n_len_a_n_u8 = 0;
        let a_o_entry = await o_kv.list({prefix: [s_prefix, `o_list`,o_post_data.s_id_hashed]});
        for await (const o_entry of a_o_entry) {
        //   console.log(o_entry.key); // ["preferences", "ada"]
        //   console.log(o_entry.value); // { ... }
        //   console.log(o_entry.versionstamp); // "00000000000000010000"
          n_len_a_n_u8 += o_entry.value.length;
          a_a_n_u8.push(o_entry.value);
        }
        let a_n_u8_complete = new Uint8Array(n_len_a_n_u8);
        let n_offset = 0;
        for(let a_n_u8 of a_a_n_u8){
            a_n_u8_complete.set(a_n_u8, n_offset);
            n_offset += a_n_u8.length;
        }

        // let a_n_u8_encrypted = await o_kv.get([s_prefix, `o_list`,o_post_data.s_id_hashed]);
        // console.log(a_n_u8_encrypted);
        return new Response(
            a_n_u8_complete,
            //a_n_u8_encrypted?.value,
            { 
                headers: {
                    'Content-type': "application/octet-stream"
                }
            }
        );
    }
    if(o_url.pathname == '/serverconnectiontest'){
        return new Response(
            JSON.stringify(
                {b_success: true}
            ),
            { 
                headers: {
                    'Content-type': "application/json"
                }
            }
        );
    }
    if(o_url.pathname == '/write'){
        try {
            let a_n_u8_payload = new Uint8Array(await o_request.arrayBuffer());
            const view = new DataView(a_n_u8_payload.buffer);
            // Read hash length (first 2 bytes)
            const n_bytes_hash = view.getUint16(0);
            
            // Read hash (next N bytes)
            const s_id_hashed = new TextDecoder().decode(
                a_n_u8_payload.slice(2, 2 + n_bytes_hash)
            );
            
            
            // Remaining bytes are the encrypted data
            const a_n_u8_encrypted = a_n_u8_payload.slice(2 + n_bytes_hash);
            // console.log(a_n_u8_encrypted);
            // Store in Deno KV
            let n_bytes_max_value = 65000;
            let n_arrays = Math.ceil(a_n_u8_encrypted.length / n_bytes_max_value);
            for(let n_i = 0; n_i < n_arrays; n_i++){
                let a_n_u8_encrypted_slice = a_n_u8_encrypted.slice(
                    n_i * n_bytes_max_value,
                    (n_i + 1) * n_bytes_max_value
                );
                let v_list = await o_kv.set([s_prefix, `o_list`,s_id_hashed, n_i], a_n_u8_encrypted_slice);
            }
            // let v_list = await o_kv.set([s_prefix, `o_list`,s_id_hashed], a_n_u8_encrypted);
            
            return new Response(
                JSON.stringify(
                    {write: true}
                ),
                { 
                    headers: {
                        'Content-type': "application/json"
                    }
                }
            );
            
        } catch (error) {
            console.error('Error in /write:', error);
            return new Response(
                JSON.stringify(
                    {error: 'Failed to write data'}
                ),
                { 
                    status: 500,
                    headers: {
                        'Content-type': "application/json"
                    }
                }
            );
            
        }
    }
    if(o_url.pathname == '/delete'){
        let o_post_data = await o_request.json();
        // console.log(o_post_data)
        let a_v_key = [s_prefix, `o_list`,o_post_data.s_id_hashed]
        let a_n_u8_encrypted = await o_kv.get(a_v_key);
        if(a_n_u8_encrypted){
            await o_kv.delete(a_v_key);
        }
        return new Response(
            JSON.stringify(
                {delete: true}
            ),
            { 
                headers: {
                    'Content-type': "application/json"
                }, 
            }
        );
    }

    return f_v_before_return_response__fileserver(
        o_request,
        `${s_path_abs_folder_current}/localhost/`
    )

}

let s_name_host = Deno.hostname(); // or maybe some ip adress 112.35.8.13
let b_development = s_name_host != 'the_server_name_here';
let s_name_host2 = (b_development) ? 'localhost': s_name_host;
// let o_info_certificates = {
//     s_path_certificate_file: './self_signed_cert_b5ddf4af-b818-4b11-96a3-9389d5696641.crt',
//     s_path_key_file: './self_signed_key_b5ddf4af-b818-4b11-96a3-9389d5696641.key'
// }
await f_websersocket_serve(
    [
        {
            n_port: 8081,
            b_https: false,
            s_hostname: s_name_host,
            f_v_before_return_response: f_handler
        },
        ...[
            (!b_deno_deploy) ? {
                // ...o_info_certificates,
                n_port: 8443,
                b_https: true,
                s_hostname: s_name_host,
                f_v_before_return_response: f_handler
            } : false
        ].filter(v=>v)   
    ]
);