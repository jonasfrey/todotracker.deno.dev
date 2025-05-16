
import {
    f_add_css,
    f_s_css_prefixed,
    o_variables, 
    f_s_css_from_o_variables
} from "https://deno.land/x/f_add_css@2.0.0/mod.js"

import {
    f_o_html_from_o_js,
    f_o_proxified_and_add_listeners,
    f_o_js_a_o_toast,
    f_o_toast,
    o_state_a_o_toast,
    s_css_a_o_toast
} 
// from "./tmp.js"
from "https://deno.land/x/handyhelpers@5.2.6/mod.js"

async function f_s_hashed_sha256(s) {
    // Encode the string as UTF-8
    const msgBuffer = new TextEncoder().encode(s);
    
    // Hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  }


// Encrypt JSON data
let f_a_n_u8_encrypted_from_string = async function(jsonData, uuid) {
    try {
        // Convert UUID to key material
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            uuidToArrayBuffer(uuid),
            { name: 'AES-CBC' },
            false,
            ['encrypt']
        );
        
        // Generate IV (recommended to be random and stored with ciphertext)
        const iv = crypto.getRandomValues(new Uint8Array(16));
        
        // Convert JSON to string then to ArrayBuffer
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(jsonData));
        
        // Encrypt the data
        const ciphertext = await crypto.subtle.encrypt(
            {
                name: 'AES-CBC',
                iv: iv
            },
            keyMaterial,
            data
        );
        
        // Combine IV and ciphertext for storage/transmission
        const result = new Uint8Array(iv.length + ciphertext.byteLength);
        result.set(iv, 0);
        result.set(new Uint8Array(ciphertext), iv.length);
        
        return result;
    } catch (e) {
        console.error('Encryption error:', e);
        throw e;
    }
}

// Decrypt data back to JSON
let f_s_dectrypted_from_a_n_u8 = async function(encryptedData, uuid) {
    try {
        // Split IV and ciphertext
        const iv = encryptedData.slice(0, 16);
        const ciphertext = encryptedData.slice(16);
        
        // Convert UUID to key material
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            uuidToArrayBuffer(uuid),
            { name: 'AES-CBC' },
            false,
            ['decrypt']
        );
        
        // Decrypt the data
        const decrypted = await crypto.subtle.decrypt(
            {
                name: 'AES-CBC',
                iv: iv
            },
            keyMaterial,
            ciphertext
        );
        
        // Convert back to JSON
        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    } catch (e) {
        console.error('Decryption error:', e);
        throw e;
    }
}




// import { Boolean } from '/three.js-r126/examples/jsm/math/BooleanOperation.js';
// import { STLExporter } from '/three/STLExporter.js';
// if you need more addons/examples download from here...
//  
let s_id_error_msg = 'error_msg'
o_variables.n_rem_font_size_base = 1. // adjust font size, other variables can also be adapted before adding the css to the dom
o_variables.n_rem_padding_interactive_elements = 0.5; // adjust padding for interactive elements 
f_add_css(
    `

    #${s_id_error_msg}{
        position: absolute;
        width: 100%;
        top: 0;
        background: #f5c0c099;
        color: #5e0505;
        padding: 1rem;
        z-index: 111;
    }
    .app{
        max-width: 100vw;
        style: "display: flex;
        flex-direction: row;
        padding: 1rem;

        background-size:cover;
    }
    h2{
        margin-bottom: 2rem !important;
        margin-top: 2rem !important;
    }
    .a_o_cv_section{
        position:relative;
    }
    .o_cv_section {
        margin-bottom: 3rem;
        position:relative;
        display: flex;
        flex-direction: row;
        z-index:1;
        padding-left: 1rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 1rem;
    }
    .o_cv_section .title{
        display:flex;
        display:flex;
        align-items:center;
        margin-left: 1rem;
    }

    .a_o_cv_section .line{
        z-index:0;
        width: 10px; 
        height: 95%; 
        background: black;
        position:absolute;
        top: 2.5%;
        left:2rem   ;
        animation: growHeight 2s ease-in-out forwards;
    }


    @keyframes growHeight {
    from {
        height: 2.5%;
    }
    to {
        height: 95%;
    }
    }
    .a_o_cv_section div{ 
        flex: 0 0 auto;
    }
    .a_o_cv_section .year{
        border-radius: 50%;
        width: 50px;
        height: 50px;
        text-align:center;
        display:flex;
        align-items:center;
        justify-content:center; 
        background: rgba(0,0,0,0.8);
    }
    .a_o_project{
        display:flex;
        flex-wrap: wrap;
        flex-direction: row;
    }
    .o_project{
        display:flex;
        align-items: center;
        justify-content:center;
        width: 50%;
        aspect-ratio: 2/1;
    }
    a{
        background: rgba(0,0,0,0.6);
        padding: 1rem !important; 
        border-radius: 1rem;
    }
    .o_todoitem{
        display: flex;
        flex-direction: row;
        padding: 0.2rem;
        align-items: center;
    }
    .o_todoitem button{
        padding: 0rem;
    }
    button.bgcolor{
        padding: 0.5rem;
    }
    .o_todoitem:hover {
        background: rgba(22,22,22,0.8);
    }
    .colorpicker{
        position: fixed;
        top:0;
        left:0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.5);
        z-index: 100;
        padding: 1rem;
        box-sizing: border-box;
        backdrop-filter: blur(5px);
        border-radius: 1rem;
        border: 1px solid rgba(255,255,255,0.5);
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        font-family: 'Courier New', Courier, monospace;
        text-align: center;
        z-index: 100;           
    }
    .colorpicker div{

        flex: 1; /* Makes items grow equally to fill space */
        min-height: 100px; /* Sets minimum height */
        min-width: 100px; /* Sets minimum width */
        background-color: #3498db; /* Your desired background color */
        border: 1px solid #2980b9; /* Optional border for better visibility */


    }
    .inputs{
        position:fixed;
        bottom:0;
    }        
    ${s_css_a_o_toast}
    ${
        f_s_css_from_o_variables(
            o_variables
        )
    }
    `
);




let f_callback_beforevaluechange = function(a_s_path, v_old, v_new){
    // console.log('a_s_path')
    // console.log(a_s_path)
    // let s_path = a_s_path.join('.');
    // if(s_path == 'a_o_person.0.s_name'){
    //     console.log('name of first person will be changed')
    // }
}
let f_callback_aftervaluechange = function(a_s_path, v_old, v_new){
    // console.log('a_s_path')
    // console.log(a_s_path)
    // let s_path = a_s_path.join('.');
    // if(s_path == 'n_thickness'){
    //     f_update_rendering();
    // }
}

let o_div = document;
let o_blob_stl = null;
// let a_o_license = await(await fetch('https://api.sketchfab.com/v3/licenses')).json()
// let a_o_category = await(await(fetch('https://api.sketchfab.com/v3/categories'))).json()

function f_s_error_from_s_prop_value(s_prop, value) {
    if (typeof s_prop !== 'string') {
      return ('s_prop must be a string');
    }
    if (s_prop.startsWith('s_')) {
      if (typeof value !== 'string') {
        return (`Value for s_prop '${s_prop}' must be a string`);
      }
    } else if (s_prop.startsWith('n_')) {
      if (typeof value !== 'number' || isNaN(value)) {
        return (`Value for s_prop '${s_prop}' must be a number`);
      }
    } else if (s_prop.startsWith('a_')) {
      if (!Array.isArray(value)) {
        return (`Value for s_prop '${s_prop}' must be an array`);
      }
    } else if (s_prop.startsWith('b_')) {
      if (typeof value !== 'boolean') {
        return (`Value for s_prop '${s_prop}' must be a boolean`);
      }
    } else if (s_prop.startsWith('o_')) {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return (`Value for s_prop '${s_prop}' must be an object`);
      }
    }
    else if (s_prop.startsWith('v_')) {
        if (typeof value === 'undefined') {
          return (`Value for s_prop '${s_prop}' must be anything but undefined`);
        }
      } else {
      return (`s_prop '${s_prop}' has no recognized prefix`);
    }
  
    return '';
  }
  

let f_a_o_error_type = function(
    o
){
    let a_o_error = []
    for(let s_prop in o){
        let s = f_s_error_from_s_prop_value(
            s_prop, 
            o[s_prop]
        );
        if(s != ''){
            a_o_error.push(
                {
                    s, 
                    s_prop, 
                    value: o[s_prop]
                }
            )
        }
    }
    return a_o_error
}
let f_o_check_types_and_potentially_throw_error = function(
    o
){
    let a_o_error = f_a_o_error_type(o);
    if(a_o_error.length > 0){
        throw new Error(`object has type error(s): ${JSON.stringify(a_o_error, null, 4)}`);
    }
    return o

}
let f_o_todoitem = function(
    s_text,
    n_ts_ms_created = Date.now(), 
    b_done_final = false,
    s_bg_color = 'rgba(0,0,0,1.0)',
    a_n_ts_ms_done = []
){
    return f_o_check_types_and_potentially_throw_error({
        s_text, 
        n_ts_ms_created, 
        s_bg_color,
        a_n_ts_ms_done
    });

}

let o_state = f_o_proxified_and_add_listeners(
    {
        b_show_settings: false,
        s_text: '',
        o_todoitem: null,
        b_show_colorpicker: false,
        b_show_done : true, 
        o_list: {
            s_id: '',
            a_o_todoitem: [
                f_o_todoitem('Wash the dishes'),
                f_o_todoitem('Do the laundry'),
                f_o_todoitem('Go grocery shopping'),
            ],
        },        
        // ...o_state_a_o_toast,
    }, 
    f_callback_beforevaluechange,
    f_callback_aftervaluechange, 
    o_div
)
let b_new = true;
let s_id = window.location.hash.replace('#', '');
let f_v_o_list_from_s_id = async function(s_id){
    let s_id_hashed = await f_s_hashed_sha256(s_id);
    let o_resp = await fetch(
        '/read', 
        {
            method: 'POST',
            body: JSON.stringify(
                {s_id_hashed}
            )
        }
    );

    let a_n_u8_encrypted = new Uint8Array(await o_resp.arrayBuffer());
    if(a_n_u8_encrypted.length == 0){
        return null;
    }
    const s_json_decrypted = await f_s_dectrypted_from_a_n_u8(new Uint8Array(a_n_u8_encrypted), s_id);
    let o_data = JSON.parse(s_json_decrypted);
    return o_data;
}
if(s_id != ``){
    b_new = false;
    let v_o_list = await f_v_o_list_from_s_id(s_id);
    if(v_o_list != null){
        o_state.o_list.s_id = s_id;    
        o_state.o_list.a_o_todoitem = v_o_list.a_o_todoitem;
    }else{
        b_new = true;
    }
}
if(b_new){
    o_state.o_list.s_id = crypto.randomUUID();
    window.location.hash = o_state.o_list.s_id;
}


globalThis.o_state = o_state

// globalThis.f_o_toast = f_o_toast
let o_el_svg = null;
// then we build the html
// f_o_toast('this is info', 'info', 5000)
// f_o_toast('this is warning','warning', 5000)
// f_o_toast('this is error','error', 5000)
// f_o_toast('this will take a while','loading', 5000)

let f_a_n_u8_payload = async function(
    o_data,
    s_id
){
    let a_n_u8_encrypted = await f_a_n_u8_encrypted_from_string(
        o_data, 
        s_id // encrypt with the id
    )
    const encoder = new TextEncoder();
    let s_id_hashed = await f_s_hashed_sha256(s_id); // hash the id
    const a_n_u8_hashed_id = encoder.encode(s_id_hashed);

    // Create a single ArrayBuffer with:
    // - 2 bytes for hash length (Uint16)
    // - N bytes for hash
    // - Remaining bytes for encrypted data
    let n_bytes_hash = 2;
    const buffer = new Uint8Array(n_bytes_hash + a_n_u8_hashed_id.length + a_n_u8_encrypted.length);
    const view = new DataView(buffer.buffer);
  
    // Write hash length (2 bytes)
    view.setUint16(0, a_n_u8_hashed_id.length);
  
    // Write hash bytes
    buffer.set(a_n_u8_hashed_id, n_bytes_hash);
  
    // Write encrypted data
    buffer.set(a_n_u8_encrypted, n_bytes_hash + a_n_u8_hashed_id.length);
  
    return buffer
}
let f_update_o_list = async function(){

    // update data structure updates that changes with different git versions
    for(let o of o_state.o_list.a_o_todoitem){
        if(!o?.b_done_final){
            o.b_done_final = false;
        }
    }
    let a_n_u8_payload = await f_a_n_u8_payload(
        o_state.o_list,
        o_state.o_list.s_id
    )
    let o_resp = await fetch(
        '/write', 
        {
            method: 'POST',
            'Content-Type': 'application/octet-stream', // Important for binary data
            body: a_n_u8_payload
        }
    );
    // f_o_toast('saved', 'success', 5000)
}

let o = await f_o_html_from_o_js(
    {
        class: "app",
        f_a_o: ()=>{
            return [
                {
                    s_tag: 'a',
                    href: 'https://buymeacoffee.com/jonasimmanuelfrey',
                    style: "position:fixed; top:0; right:0; z-index: 100;max-width:100px; background:rgba(0,0,0,0.5);",
                    f_a_o: ()=>{
                        return [
                            {
                                style: 'width: 100%;padding:0;',
                                s_tag: "img",
                                src: './bmc-button.png',
                            }
                        ]
                    }
                },
                {
                    class: "inputs", 
                    f_a_o: ()=>{
                        return [
                            {
                                a_s_prop_sync: 'b_show_done',
                                s_tag: "button", 
                                f_s_innerText: ()=>{
                                    return (o_state.b_show_done) ? 'hide done': 'show done'
                                },
                                onclick: (o_event)=>{
                                    o_state.b_show_done = !o_state.b_show_done;
                                    o_state.o_list.a_o_todoitem = o_state.o_list.a_o_todoitem;
                                }
                            },
                            {
                                s_tag: "input", 
                                type: 'text', 
                                a_s_prop_sync: ['s_text'],
                                onkeydown: (o_event)=>{
                                    let s_text = o_event.target.value;
                                    //if key is entered, add todoitem
                                    if(o_event.key == 'Enter'){
                                        if(s_text != ''){
                                            o_state.o_list.a_o_todoitem.push(
                                                f_o_todoitem(s_text)
                                            );
                                            o_state.s_text = '';
                                            f_update_o_list();
                                        }
                                    }
                                }
                            },
                            {
                                s_tag: "button",
                                innerText: 'add',
                                onclick:()=>{
                                    if(o_state.s_text != ''){
                                        o_state.o_list.a_o_todoitem.push(
                                            f_o_todoitem(o_state.s_text)
                                        );
                                        o_state.s_text = '';
                                        f_update_o_list();
                                    }
                                }
                            },
                            {
                                s_tag: "button",
                                innerText: '⚙️',
                                onclick:()=>{
                                   o_state.b_show_settings = !o_state.b_show_settings;
                                }
                            },
                        ]
                    }
                },
                {
                    a_s_prop_sync: ['b_show_colorpicker'],
                    f_b_render: ()=>{
                        return o_state.b_show_colorpicker;
                    }, 
                    f_a_o: ()=>{
                        return [

                            {
                                class: 'colorpicker',
                                onclick: (o_event)=>{
                                    o_state.b_show_colorpicker = false;
                                },
                                f_a_o: ()=>{
                                    return ['red', 'green', 'blue', 'yellow', 'purple', 'orange'].map(s=>{
                                        return {
                                            class: 'o_button',
                                            style: `background: ${s};`,
                                            onclick: ()=>{
                                                o_state.b_show_colorpicker = false;
                                                o_state.o_todoitem.s_bg_color = s;
                                            }
                                        }
                                    })
                                }
                            }
                        ]
                        
                    }
                },
                {
                    a_s_prop_sync: ['b_show_settings'],
                    f_b_render: ()=>{
                        return o_state.b_show_settings;
                    }, 
                    f_a_o: ()=>{
                        return [
                            {
                                class: 'colorpicker',
                                onclick: (o_event)=>{
                                    o_state.b_show_settings = false;
                                },
                                f_a_o: ()=>{
                                    return [
                                        {
                                            class: 'o_button',
                                            s_tag: 'button',
                                            innerText: '➡️ export list as json',
                                            onclick: ()=>{
                                                // Convert JSON object to a string
                                                const jsonStr = JSON.stringify(o_state.o_list, null, 2); // 2-space indentation for readability

                                                // Create a Blob (file-like object) with the JSON data
                                                const blob = new Blob([jsonStr], { type: 'application/json' });

                                                // Create a temporary URL for the Blob
                                                const url = URL.createObjectURL(blob);

                                                // Create a hidden anchor element and trigger a click
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `${window.location.hostname}.json`;
                                                document.body.appendChild(a);
                                                a.click();

                                                // Clean up
                                                setTimeout(() => {
                                                    document.body.removeChild(a);
                                                    URL.revokeObjectURL(url);
                                                }, 100);
                                            }
                                        },
                                        {
                                            class: 'o_button',
                                            s_tag: 'button',
                                            innerText: '⬅️ import list from json',
                                            onclick: ()=>{
                                                // Create a file input element
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.accept = '.json'; // Accept only JSON files

                                                // Trigger the file input click
                                                input.click();

                                                // Handle the file selection
                                                input.onchange = async (event) => {
                                                    const file = event.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = async (e) => {
                                                            try {
                                                                const o_list = JSON.parse(e.target.result);
                                                                if(!f_b_UUIDv4(o_list?.s_id)){
                                                                    alert(`json must have following structure: {s_id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx', a_o_todoitem: [${JSON.stringify(f_o_todoitem('testitem'))}]}`);
                                                                    throw new Error('s_id is not a valid UUIDv4');
                                                                }
                                                                let v_o_list = await f_v_o_list_from_s_id(s_id);
                                                                if(v_o_list != null){
                                                                    let b = confirm(`a list with the id ${s_id} already exists. overwrite existing list?`);
                                                                    if(!b){
                                                                        return;
                                                                    }
                                                                }
                                                                o_state.o_list = o_list;
                                                                f_update_o_list();
                                                                window.location.hash = `#${o_list.s_id}`;
                                                            } catch (error) {
                                                                console.error('Error parsing JSON:', error);
                                                            }
                                                        };
                                                        reader.readAsText(file);
                                                    }
                                                };
                                            }
                                        }, 
                                        {
                                            class: 'o_button',
                                            s_tag: 'button',
                                            innerText: '❌ delete list (ireversable)',
                                            onclick: async ()=>{
                                                o_state.o_list.a_o_todoitem = [];
                                               
                                                let s_id_hashed = await f_s_hashed_sha256(o_state.o_list.s_id);
                                                let o_resp = await fetch(
                                                    '/delete', 
                                                    {
                                                        method: 'POST',
                                                        body: JSON.stringify(
                                                            {s_id_hashed}
                                                        )
                                                    }
                                                );
                                                console.log(o_resp.json())
                                            }
                                        }, 
                                       
                                    ]
                                }
                            }
                        ]
                        
                    }
                },
                {
                    a_s_prop_sync: ['b_show_done', 'o_list.a_o_todoitem.[n]'],
                    class: 'a_o_todoitem',
                    f_a_o: ()=>{
                        // console.log('asdfrender')
                        return o_state.o_list.a_o_todoitem
                        .toSorted((a, b) => {
                              // Get the last timestamp for each item (determines current status)
                            const aLastTimestamp = a.a_n_ts_ms_done[a.a_n_ts_ms_done.length - 1] || 0;
                            const bLastTimestamp = b.a_n_ts_ms_done[b.a_n_ts_ms_done.length - 1] || 0;
                            
                            // Determine status: even length = done, odd length = undone
                            const aIsDone = a.a_n_ts_ms_done.length % 2 === 0;
                            const bIsDone = b.a_n_ts_ms_done.length % 2 === 0;
                            
                            // First sort by status (UNDONE first, DONE second)
                            if (aIsDone && !bIsDone) return -1;   // a is done, b is undone → b comes first
                            if (!aIsDone && bIsDone) return 1;  // a is undone, b is done → a comes first
                            
                            // If same status, sort by timestamp (newest first)
                            if (aIsDone) {
                                // Both are done → sort by original completion time (newest done first)
                                return b.a_n_ts_ms_done[0] - a.a_n_ts_ms_done[0];
                            } else {
                                // Both are undone → sort by last undone time (newest undone first)
                                return bLastTimestamp - aLastTimestamp;
                            }
                        })
                        .filter(
                            o=>{
                                if(o?.b_done_final){
                                    return false;
                                }
                                if(o_state.b_show_done){
                                    return true;
                                }
                                return o.a_n_ts_ms_done?.at(-1) == null;
                            }
                        )
                        .map(o_todoitem=>{
                            // console.log(o_todoitem)
                            return {
                                class: 'o_todoitem',
                                a_s_prop_sync: ['o_list.a_o_todoitem'],
                                f_a_o: ()=>{
                                    let b_done = o_todoitem.a_n_ts_ms_done.length%2 == 1
                                    return [
                                        {
                                            s_tag: "button", 
                                            innerText: '🗑️', 
                                            onclick: ()=>{
                                                let o_item = o_state.o_list.a_o_todoitem.find(
                                                    (o_todoitem2, n_index) => {
                                                        return `${o_todoitem2.s_text}${o_todoitem2.n_ts_ms_created}` 
                                                            == `${o_todoitem.s_text}${o_todoitem.n_ts_ms_created}`;
                                                    }
                                                )
                                                o_item.b_done_final = true;
                                                if(!b_done){
                                                    o_item.a_n_ts_ms_done.push(Date.now());
                                                }
                                                f_update_o_list();
                                            }
                                        },
                                        {
                                            s_tag: 'button',
                                            class: 'o_button',
                                            onclick: ()=>{
                                                let o_item = o_state.o_list.a_o_todoitem.find(
                                                    (o_todoitem2, n_index) => {
                                                        return `${o_todoitem2.s_text}${o_todoitem2.n_ts_ms_created}` 
                                                            == `${o_todoitem.s_text}${o_todoitem.n_ts_ms_created}`;
                                                    }
                                                )
                                                o_item.a_n_ts_ms_done.push(Date.now());
                                                f_update_o_list();
                                            },
                                            f_s_innerText: ()=>{
                                                return (b_done) ? '✅': '◻️'
                                            }
                                        },
                                        {
                                            innerText: o_todoitem.s_text,
                                            style: `${(b_done) ? 'text-decoration: line-through;': ''}`
                                        },
                                        {
                                            s_tag: 'button',
                                            class: 'o_button bgcolor',
                                            style: `background: ${o_todoitem.s_bg_color};`,
                                            onclick: ()=>{
                                                o_state.o_todoitem = o_todoitem;
                                                o_state.b_show_colorpicker = true;
                                                // console.log(o_todoitem)
                                                
                                            }
                                        }, 
                                    ]
                                }   
                            }
                        })
                    }
                }
            ]
        },
    }, 
    o_state
)
document.body.appendChild(o);


let f_b_UUIDv4 = function(s_uuid) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s_uuid);
}

document.addEventListener('keydown', (event) => {
        
    if (event.key === 'Escape') {
        if(o_state.b_show_colorpicker){
            o_state.b_show_colorpicker = false;
        }
    }
});


// Convert UUID string to ArrayBuffer
function uuidToArrayBuffer(uuid) {
    // Remove hyphens and convert to hex string
    const hex = uuid.replace(/-/g, '');
    const buffer = new ArrayBuffer(16);
    const view = new DataView(buffer);
    
    // Parse hex string into ArrayBuffer
    for (let i = 0; i < 16; i++) {
        view.setUint8(i, parseInt(hex.substr(i * 2, 2), 16));
    }
    
    return buffer;
}

