
import {
    f_add_css,
    f_s_css_prefixed,
    o_variables, 
    f_s_css_from_o_variables
} from "https://deno.land/x/f_add_css@2.0.0/mod.js"


import { createApp, ref, onUpdated, reactive} from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

import {
    f_o_html_from_o_js,
} from "https://deno.land/x/handyhelpers@5.4.2/mod.js"

import {

    f_o_todoitem, 
    f_s_hashed_sha256,
    f_s_dectrypted_from_a_n_u8,
    f_a_n_u8_encrypted_from_string
} from './functions.module.js'


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
    #app{
        max-width: 100vw;
        style: "display: flex;
        flex-direction: row;
        
        background-size:cover;
    }
    .inputs {
        position: fixed;
        bottom: 0;
        z-index: 111;
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
    .o_todoitem a {
        padding: 0 !important;!imp;!impl;!i;!;
        margin:  0 !important;!i;!;
        background: transparent;
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
      

    .a_o_todoitem {
        padding-bottom: 5vh;
    }
    .fullpage {
        height: 100vh;
        display:flex; 
        flex-direction: column;
        padding: .5rem;
        box-sizing: border-box;
    }
    ${
        f_s_css_from_o_variables(
            o_variables
        )
    }
    `
);


let o_div = document;
let o_blob_stl = null;
// let a_o_license = await(await fetch('https://api.sketchfab.com/v3/licenses')).json()
// let a_o_category = await(await(fetch('https://api.sketchfab.com/v3/categories'))).json()


let o = await f_o_html_from_o_js(
    {
        id: "app",
        a_o: [

                {

                    s_tag: 'a',
                    href: 'https://buymeacoffee.com/jonasimmanuelfrey',
                    ":style": "`position:fixed; top:0; right:0; z-index: 100;max-width:100px; background:rgba(0,0,0,0.5);`",
                    a_o: [
                            {
                                style: 'width: 100%;padding:0;',
                                s_tag: "img",
                                src: './bmc-button.png',
                            }
                        ]
                },

                {
                    'v-if': "b_show_colorpicker",
                    a_o: 
                         [

                            {
                                class: 'colorpicker',
                                'v-on:click': 'b_show_colorpicker = false',
                                a_o: [
                                    {
                                        'v-for': "s in a_s_color",
                                        class: 'o_button',
                                        ":style": '`background: ${s};`',
                                        'v-on:click': 'f_update_colorpicker(s)',
                                    }
                                ]
                                
                            }
                        ]
                        
                    
                },
                {
                    'v-if': "b_show_settings",
                    a_o: [
                            {
                                class: 'colorpicker',
                                'v-on:click': 'b_show_settings = false',
                                a_o: [
                                        {
                                            a_s_prop_sync: 'b_show_deleted',
                                            s_tag: "button", 
                                            "v-html": "b_show_deleted ? 'hide deleted items': 'show deleted items'",
                                            'v-on:click': 'b_show_deleted = !b_show_deleted',
                                        },
                                     
                                        {
                                            class: 'o_button',
                                            s_tag: 'button',
                                            innerText: '➡️ export list as json',
                                            'v-on:click': 'f_export_list()',
                                            
                                        },
                                        {
                                            class: 'o_button',
                                            s_tag: 'button',
                                            innerText: '⬅️ import list from json',
                                            'v-on:click': 'f_import_list()',

                                        }, 
                                        {
                                            class: 'o_button',
                                            s_tag: 'button',
                                            innerText: '❌ delete list (ireversable)',
                                            'v-on:click': 'f_delete_list()',
                                        },

                                    ]
                                }
                            
                        ]
                        
                    
                },
                {
                    class: "fullpage", 
                        a_o:[                            
                                {

                                    class: 'a_o_todoitem',
                                    a_o: [
                                            {
                                            'v-for': 'o_todoitem1 in a_o_todoitem_sorted_filtered',
                                            ":key": "o_todoitem1.s_uuid",
                                                class: 'o_todoitem',
                                                a_o: [

                                                        {
                                                            s_tag: "button", 
                                                            innerText: '🗑️', 
                                                            'v-on:click': "f_delete_item(o_todoitem1)",
                                                            
                                                        },
                                                        {
                                                            s_tag: 'button',
                                                            class: 'o_button',
                                                            'v-on:click': "f_doneundone_todoitem(o_todoitem1)",
                                                            'v-html': "(f_b_done(o_todoitem1)) ? '✅': '◻️'",
                                                        },
                                                        {
                                                            'v-if': 'b_show_deleted && o_todoitem1?.b_done_final',
                                                            s_tag: "button", 
                                                            innerText: 'un-delete', 
                                                            'v-on:click': "f_undelete_item(o_todoitem1)",

                                                        },
                                                        {
                                                            'v-html': "`${(o_todoitem1?.b_done_final ? 'deleted - ': '')}${f_s_html_text_with_url(o_todoitem1?.s_text)}`",
                                                            ':style': `(f_b_done(o_todoitem1)) ? 'text-decoration: line-through;': ''`,
                                                        },
                                                        {
                                                            s_tag: 'button',
                                                            class: 'o_button bgcolor',
                                                            ':style': "`background: ${o_todoitem1?.s_bg_color};`",
                                                            'v-on:click': "s_uuid_selected = o_todoitem1?.s_uuid; b_show_colorpicker = true",
                                                        }, 
                                                    ]
                                            }
                                        ]
                                    }
                            ]
             
                },
                {
                    class: "inputs", 
                    a_o: [

                        {
                            s_tag: "input", 
                            type: 'text', 
                            'v-model': 's_text',
                            'v-on:keydown': "if($event.key === 'Enter' && s_text !== '') { f_add_todoitem(); }",

                        },
                        // {
                        //     s_tag: 'button',
                        //     class: 'o_button bgcolor',
                        //     ":style": "`background: ${s_bg_color};`",
                        //     'v-on:click': "b_show_colorpicker = true",
                        // },
                        {
                            s_tag: "button",
                            innerText: 'add',
                            'v-on:click': "f_add_todoitem()",
                            
                        },
                        {
                            s_tag: "button",
                            innerText: '⚙️',
                            'v-on:click': "b_show_settings = !b_show_settings",
                        },
                    ]
        
                },
            ]
    }
);
document.body.appendChild(o);





const app = createApp({
    // $nextTick: () => {
    //     debugger
    // // Runs after the DOM has updated
    // // this.accessRenderedElement()
    // },
    async mounted() {
            let o_self = this;
            globalThis.o_self = this;
            globalThis.o_self = this;
            o_self.o_video = null;

            let b_new_list = true;
            let s_id = window.location.hash.replace('#', '');

            if(s_id != ``){
    b_new_list = false;
    let v_o_list = await o_self.f_v_o_list_from_s_id(s_id);
    if(v_o_list != null){
        o_self.o_list.s_id = s_id;   
        o_self.o_list.a_o_todoitem = reactive(v_o_list.a_o_todoitem);
        o_self.o_list.n_ts_ms_last_downloaded_backup = v_o_list.n_ts_ms_last_downloaded_backup;
    }else{
        b_new_list = true;
    }

    document.addEventListener('keydown', (event) => {
            
        if (event.key === 'Escape') {
            if(o_self.b_show_colorpicker){
                o_self.b_show_colorpicker = false;
            }
        }

        
    });


o_self.n_id_interval_list_autofetch = setInterval(
    o_self.f_interval_fetch_list,
    o_self.n_ms_interval_list_autofetch
)



}

if(b_new_list){
    o_self.o_list.s_id = crypto.randomUUID();
    window.location.hash = o_self.o_list.s_id;
    o_self.o_list.a_o_todoitem.push(
        reactive(
            f_o_todoitem('this is your first todo item. click the square to mark it as done. click the trash can to delete it. click the color button to change its color. add more items with the input field at the bottom. everything is saved automatically. you can also import/export your list with the settings button ⚙️. have fun!')
        ),
    )

}

let b_never_backuped = false;
if(o_self.o_list.n_ts_ms_last_downloaded_backup == null || o_self.o_list.n_ts_ms_last_downloaded_backup == undefined){
    b_never_backuped = true;
    if(!b_new_list){
        o_self.o_list.n_ts_ms_last_downloaded_backup = new Date().getTime();
    }
}
let n_ms_delta = Math.abs(o_self.n_ms_loaded - o_self.o_list.n_ts_ms_last_downloaded_backup);
if(n_ms_delta > o_self.n_ms_autodownload_backup_interval || (b_never_backuped && !b_new_list)){
    let s_message = ''
    if(b_never_backuped){
        s_message = 'you never downloaded a backup of this list. it is recommended to download a backup now. do you want to download a backup now? (recommended)';
    }else{
        s_message = `the last backup was downloaded on ${new Date(o_self.o_list.n_ts_ms_last_downloaded_backup).toLocaleString()}. it is recommended to download a backup now. do you want to download a backup now? (recommended)`
    }
    let b = confirm(s_message);
    if(b){
        o_self.f_export_list();
    }
    o_self.o_list.n_ts_ms_last_downloaded_backup = new Date().getTime();
    o_self.f_update_o_list();
}

document.addEventListener('pointerup', this.f_pointerup);
          
    },
    beforeUnmount() {
        window.removeEventListener('pointerup', this.f_pointerup);
    },
    methods: {
        f_interval_fetch_list: async function(){
            let o_self = this;
            if(o_self.b_writing){
                return;
            }
            // console.log('ival')
            let v_o_list = await o_self.f_v_o_list_from_s_id(o_self.o_list.s_id);
            o_self.o_list.a_o_todoitem = v_o_list.a_o_todoitem;
        },
        f_o_toast: function(s_msg){
            alert(s_msg)
        },
        f_s_dectrypted_from_a_n_u8: f_s_dectrypted_from_a_n_u8,
    f_s_hashed_sha256: f_s_hashed_sha256,
    f_a_n_u8_encrypted_from_string: f_a_n_u8_encrypted_from_string,
    f_o_todoitem: f_o_todoitem,
    f_b_network_server_connection : async function(){
        let o_self = this;
        let n_ms = window.performance.now();

        try {
            
            let o_resp = await fetch(
                '/serverconnectiontest', 
                {
                    method: 'GET',
                }
            );
            if(!o_resp.ok){
                o_self.f_o_toast('there is no connection to the server!', 'error', 5000)
            }
            let o = await o_resp.json();

            if(o?.b_success){
                // o_self.f_o_toast('success connection server!', 'info', 5000)
            }
        } catch (error) {
            // This will catch network errors like ERR_CONNECTION_REFUSED
            if (error.message.includes('Failed to fetch') || 
                error.message.includes('NetworkError') || 
                error.message.includes('ERR_CONNECTION_REFUSED')) {
                o_self.f_o_toast('There is no connection to the server!', 'error', 5000);
            } else {
                o_self.f_o_toast('An unexpected error occurred!', 'error', 5000);
                console.error('Connection test error:', error);
            }
        }
        setTimeout(async ()=>{
            await o_self.f_b_network_server_connection();
            
            // if(s_id){
            //     let v_o_list = await o_self.f_v_o_list_from_s_id(s_id);
            //     if(v_o_list != null){
            //         o_state.o_list.s_id = s_id;    
            //         o_state.o_list.a_o_todoitem = v_o_list.a_o_todoitem;
            //     }
            // }

        }, o_self.n_ms_interval_server_network_connection_test)
    },


       
        f_test: function(){
            //always start like this 
            let o_self = this;
            // and then use o_self.prop instead of 'o_state.prop'
            // ...
        },


      
        f_b_UUIDv4 : function(s_uuid) {
            return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s_uuid);
        },
        f_add_todoitem: function(){
            let o_self = this;
            if(o_self.s_text != ''){
                let o_todoitem = o_self.f_o_todoitem(o_self.s_text);
                o_todoitem.s_bg_color = o_self.s_bg_color;
                o_self.o_list.a_o_todoitem.push(
                    o_todoitem
                );
                o_self.s_text = '';
                o_self.f_update_o_list();
            }
        },
        f_undelete_item: function(o_todoitem){
            let o_self = this;
            let o_item = o_self.o_list.a_o_todoitem.find(
                (o_todoitem2, n_index) => {
                    return `${o_todoitem2.s_text}${o_todoitem2.n_ts_ms_created}` 
                        == `${o_todoitem.s_text}${o_todoitem.n_ts_ms_created}`;
                }
            )
            o_item.b_done_final = false;
            o_self.f_update_o_list();
        },
        f_doneundone_todoitem: function(o_todoitem){
            let o_self = this;
            let o_item = o_self.o_list.a_o_todoitem.find(
                (o_todoitem2, n_index) => {
                    return `${o_todoitem2.s_text}${o_todoitem2.n_ts_ms_created}` 
                        == `${o_todoitem.s_text}${o_todoitem.n_ts_ms_created}`;
                }
            )
            o_item.a_n_ts_ms_done.push(Date.now());
            o_self.f_update_o_list();
        },
        f_delete_item: function(o_todoitem){
            let o_self = this;
            let o_item = o_self.o_list.a_o_todoitem.find(
                (o_todoitem2, n_index) => {
                    return `${o_todoitem2.s_text}${o_todoitem2.n_ts_ms_created}` 
                        == `${o_todoitem.s_text}${o_todoitem.n_ts_ms_created}`;
                }
            )
            o_item.b_done_final = true;
            let b_done = o_item.a_n_ts_ms_done.length%2 == 1;
            if(!b_done){
                o_item.a_n_ts_ms_done.push(Date.now());
            }
            o_self.f_update_o_list();
        },
        f_delete_list: async function(){
            let o_self = this;
            let b = confirm(`do you really want to delete this list? this cannot be undone!`);
            if(!b){
                return;
            }

            o_self.o_list.a_o_todoitem = [];
            
            let s_id_hashed = await o_self.f_s_hashed_sha256(o_self.o_list.s_id);
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

        },
        f_v_o_list_from_s_id : async function(s_id){
            let o_self = this;
            let s_id_hashed = await o_self.f_s_hashed_sha256(s_id);
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
            const s_json_decrypted = await o_self.f_s_dectrypted_from_a_n_u8(new Uint8Array(a_n_u8_encrypted), s_id);
            let o_data = JSON.parse(s_json_decrypted);
            return o_data;
        },
        f_a_n_u8_payload : async function(
            o_data,
            s_id
        ){
            let o_self = this;
            let a_n_u8_encrypted = await o_self.f_a_n_u8_encrypted_from_string(
                o_data, 
                s_id // encrypt with the id
            )
            const encoder = new TextEncoder();
            let s_id_hashed = await o_self.f_s_hashed_sha256(s_id); // hash the id
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
        },
        f_update_o_list : async function(){

            let o_self = this;
            o_self.b_writing = true;
            // update data structure updates that changes with different git versions
            for(let o of o_self.o_list.a_o_todoitem){
                if(!o?.b_done_final){
                    o.b_done_final = false;
                }
                if(!o?.s_uuid){
                    o.s_uuid = crypto.randomUUID();
                }
            }
            let a_n_u8_payload = await o_self.f_a_n_u8_payload(
                o_self.o_list,
                o_self.o_list.s_id
            )
            let o_resp = await fetch(
                '/write', 
                {
                    method: 'POST',
                    'Content-Type': 'application/octet-stream', // Important for binary data
                    body: a_n_u8_payload
                }
            );

            o_self.b_writing = false;
            // f_o_toast('saved', 'success', 5000)
        },

    f_s_html_text_with_url : function(text, options = {}){
        // console.log(text)
        if(!text){
            return '';
        }
        let o_self = this;
        // return text
        // const urlRegex = /(?:https?:\/\/)?(?:www\.)?[^\s<>"']+\.[^\s<>"']+/gi;
        // let urlRegex = /\bhttps?:\/\/[^\s<>"']+/gi;
        let urlRegex = /\b(?:https?:\/\/[^\s<>"']+|(?:[a-z0-9\-]+\.)+[a-z]{2,}(?::\d+)?(?:\/[^\s<>"']*)?)/gi;

        return text.replace(urlRegex, url => {
        const href = url.startsWith('http') ? url : 'http://' + url;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
    },
    f_export_list : function(){
        let o_self = this;
        // Convert JSON object to a string
        const jsonStr = JSON.stringify(o_self.o_list, null, 2); // 2-space indentation for readability

        // Create a Blob (file-like object) with the JSON data
        const blob = new Blob([jsonStr], { type: 'application/json' });

        // Create a temporary URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a hidden anchor element and trigger a click
        const a = document.createElement('a');
        a.href = url;
        a.download = `${window.location.hostname}_${o_self.o_list.s_id.substr(0, 8)}.json`;
        document.body.appendChild(a);
        a.click();

        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    },
        f_update_colorpicker: function(s_color){
            let o_self = this;
            let o_todoitem = o_self.o_list.a_o_todoitem.find(
                (o_todoitem2, n_index) => {
                    return o_todoitem2.s_uuid == o_self.s_uuid_selected;
                }
            )
            if(!o_todoitem){
                o_self.f_o_toast('could not find item to update color', 'error', 5000);
                return;
            }
            o_todoitem.s_bg_color = s_color;

            o_self.b_show_colorpicker = false;
            o_self.f_update_o_list();
        },
        f_import_list: async function(){
            let o_self = this;
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
                            if(!o_self.f_b_UUIDv4(o_list?.s_id)){
                                alert(`json must have following structure: {s_id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx', a_o_todoitem: [${JSON.stringify(o_self.f_o_todoitem('testitem'))}]}`);
                                throw new Error('s_id is not a valid UUIDv4');
                            }
                            let v_o_list = await o_self.f_v_o_list_from_s_id(s_id);
                            if(v_o_list != null){
                                let b = confirm(`a list with the id ${s_id} already exists. overwrite existing list?`);
                                if(!b){
                                    return;
                                }
                            }
                            o_self.o_list = o_list;
                            o_self.f_update_o_list();
                            window.location.hash = `#${o_list.s_id}`;
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                        }
                    };
                    reader.readAsText(file);
                }
            };
        }, 
        f_sort_a_o_todoitem: function(a_o){
            let o_self = this;
            return a_o.toSorted((a, b) => {
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
        },
        f_filter_a_o_todoitem: function(a_o){
            let o_self = this;
            return a_o.filter(
                o=>{
                    if(o?.b_done_final && o_self.b_show_deleted === false){
                        return false;
                    }
                    if(o_self.b_show_done){
                        return true;
                    }
                    return o.a_n_ts_ms_done?.at(-1) == null;
                }
            )
        }, 

        f_b_done: function(o){
            return o.a_n_ts_ms_done.length % 2 === 1
        }
    },
    computed:{
          a_o_todoitem_sorted_filtered: function() {
                let a_o = this.o_list.a_o_todoitem
                // a_o = this.f_sort_a_o_todoitem(a_o) // keep if you need sorting (objects kept by ref)
                a_o = this.f_filter_a_o_todoitem(a_o)
               
                return a_o
            },
        },
    watch: {
    },
  data() {
    return {
        a_s_color: ['red', 'green', 'blue', 'yellow', 'purple', 'orange'],
        n_ms_delta_max_server_network_connection_test: 1000,
        n_ms_interval_server_network_connection_test: 3333,
        n_id_interval_server_network_connection_test: null,
        n_id_interval_list_autofetch: null, 
        n_ms_interval_list_autofetch: 500,
        b_show_settings: false,
        s_text: '',
        s_bg_color: 'transparent', // default color
        o_todoitem: null,
        b_show_colorpicker: false,
        b_show_deleted: false,
        b_show_done : true, 
        n_ms_autodownload_backup_interval: 24 * 60 * 60 * 1000, // every 24 hours
        n_ms_loaded: new Date().getTime(),
        s_uuid_selected: null,
        o_list: {
            s_id: '',
            // n_ts_ms_last_downloaded_backup: new Date().getTime(),
            a_o_todoitem: [
            ],
        },     
        b_writing: false,   
        // ...o_state_a_o_toast,
    };
  }
})

// Vue.directive('on-render', {
//     inserted(el, binding) {
//       binding.value(el)
//     }
//   })

// Handle both mouse and touch events



app.mount('#app')

globalThis.o_vue = app;


