
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
from "./tmp.js"
// from "https://deno.land/x/handyhelpers@5.2.4/mod.js"


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
if(s_id != ``){
    b_new = false;
    let o_resp = await fetch(
        '/read', 
        {
            method: 'POST',
            body: JSON.stringify(
                {s_id}
            )
        }
    );
    let o_data = await o_resp.json();
    if(o_data.value != null){
        o_state.o_list.s_id = s_id;    
        o_state.o_list.a_o_todoitem = o_data.value.a_o_todoitem;
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

let f_update_o_list = async function(){
    let o_resp = await fetch(
        '/write', 
        {
            method: 'POST',
            body: JSON.stringify(
                o_state.o_list
            )
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
                    a_s_prop_sync: ['b_show_done', 'o_list.a_o_todoitem.[n]'],
                    class: 'a_o_todoitem',
                    f_a_o: ()=>{
                        console.log('asdfrender')
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
                                if(o_state.b_show_done){
                                    return true;
                                }
                                return o.a_n_ts_ms_done?.at(-1) == null;
                            }
                        )
                        .map(o_todoitem=>{
                            console.log(o_todoitem)
                            return {
                                class: 'o_todoitem',
                                a_s_prop_sync: ['o_list.a_o_todoitem'],
                                f_a_o: ()=>{
                                    return [
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
                                            }
                                        },
                                        {
                                            innerText: o_todoitem.s_text,
                                            style: `${(o_todoitem.a_n_ts_ms_done.length%2 == 1) ? 'text-decoration: line-through;': ''}`
                                        },
                                        {
                                            s_tag: 'button',
                                            class: 'o_button',
                                            style: `background: ${o_todoitem.s_bg_color};`,
                                            onclick: ()=>{
                                                o_state.o_todoitem = o_todoitem;
                                                o_state.b_show_colorpicker = true;
                                                console.log(o_todoitem)
                                                
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


document.addEventListener('keydown', (event) => {
        
    if (event.key === 'Escape') {
        if(o_state.b_show_colorpicker){
            o_state.b_show_colorpicker = false;
        }
    }
});