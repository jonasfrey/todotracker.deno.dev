
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
} from "https://deno.land/x/handyhelpers@5.2.4/mod.js"


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
    n_ts_ms_created = Date.now()
){
    return f_o_check_types_and_potentially_throw_error({
        s_text, 
        n_ts_ms_created
    });

}

let o_state = f_o_proxified_and_add_listeners(
    {
        s_id: '',
        a_o_todoitem: [
            f_o_todoitem('Wash the dishes'),
            f_o_todoitem('Do the laundry'),
            f_o_todoitem('Go grocery shopping'),
        ],
        ...o_state_a_o_toast,
    }, 
    f_callback_beforevaluechange,
    f_callback_aftervaluechange, 
    o_div
)
let s_id = window.location.hash.replace('#', '');
if(s_id != ``){
    let o_resp = await fetch(
        '/read', 
        {
            method: 'POST',
            body: JSON.stringify(
                {s_id}
            )
        }
    );
    let o_list = await o_resp.json();
    o_state.s_id = s_id;    
    o_state.a_o_todoitem = o_list.a_o_todoitem;
}else{
    o_state.s_id = crypto.randomUUID();
    window.location.hash = o_state.s_id;
}


globalThis.o_state = o_state

globalThis.f_o_toast = f_o_toast
let o_el_svg = null;
// then we build the html
f_o_toast('this is info', 'info', 5000)
f_o_toast('this is warning','warning', 5000)
f_o_toast('this is error','error', 5000)
f_o_toast('this will take a while','loading', 5000)

let f_update_o_list = async function(){
    let o_resp = await fetch(
        '/write', 
        {
            method: 'POST',
            body: JSON.stringify(
                {
                    s_id
                }
            )
        }
    );
    f_o_toast('saved', 'success', 5000)
}

let o = await f_o_html_from_o_js(
    {
        class: "app",
        f_a_o: ()=>{
            return [
                {
                    s_tag: "input", 
                    type: 'text', 
                    onkeydown: (o_event)=>{
                        let s_text = o_event.target.value;
                        //if key is entered, add todoitem
                        if(o_event.key == 'Enter'){
                            if(s_text != ''){
                                o_state.a_o_todoitem.push(
                                    f_o_todoitem(s_text)
                                );
                                o_event.target.value = '';
                                f_update_o_list();
                            }
                        }
                    }
                },
                {
                    a_s_prop_sync: 'a_o_todoitem',
                    class: 'a_o_todoitem',
                    f_a_o: ()=>{
                        return o_state.a_o_todoitem.map(o_todoitem=>{
                            return {
                                innerText: o_todoitem.s_text,
                                class: 'o_todoitem',
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
