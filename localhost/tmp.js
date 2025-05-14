let s_name_attr_prop_sync = 'a_s_prop_sync'; 
let o_el_global_event = null;
let f_b_denojs = function(){
    return 'Deno' in globalThis
 }
 // Helper function with path traversal
const f_v_from_path = function(o_state, a_s_path_part) {
    let o_current = o_state;
    
    for (const s_part of a_s_path_part) {
        if (typeof o_current !== 'object' || o_current === null || !(s_part in o_current)) {
            return undefined;
        }
        o_current = o_current[s_part];
    }
    
    return o_current;
};
let f_o_html_element__from_s_tag = async function(s_tag){
   
    let o_doc;
    if(f_b_denojs()){
 
        let o_DOMParser = (await import("https://deno.land/x/deno_dom@v0.1.42/deno-dom-wasm.ts")).DOMParser;
        o_doc = new o_DOMParser().parseFromString(
            '<div></div>',
            'text/html'
        );
    }else{
        o_doc = document;
    }
    return o_doc.createElement(s_tag);
 
 }

 let f_update_element_to_match = function(o_el_to_copy_attributes_from, o_el_to_update) {

    // Copy all attributes from the new element to the existing element
    for (const attr of o_el_to_copy_attributes_from.attributes) {
        o_el_to_update.setAttribute(attr.name, attr.value);
    }
    
    // Remove any attributes on the existing element that are not on the new element
    for (const attr of o_el_to_update.attributes) {
        if (!o_el_to_copy_attributes_from.hasAttribute(attr.name)) {
        o_el_to_update.removeAttribute(attr.name);
        }
    }
    
    // Replace the inner content of the existing element with the new element's content
    o_el_to_update.innerHTML = o_el_to_copy_attributes_from.innerHTML;
    
    // If you need to copy other properties (e.g., event listeners), you can do so here
    // Example: existingElement.onclick = newElement.onclick;
 
 }
 
let f_o_html_from_o_js = async function(
    o_js,
    o_state = {}
    ){
     o_js = await o_js;
 
     if(o_state == undefined || o_state == null){
         throw Error('please pass a state object (o_state) to the function "f_o_html_from_o_js" as a second argument ')
     }
    // debugger
    let s_tag = 'div';
    if(o_js?.s_tag){
        s_tag = o_js.s_tag
    }
    if(typeof o_js?.[s_name_attr_prop_sync] == 'string'){
         o_js[s_name_attr_prop_sync] = [o_js?.[s_name_attr_prop_sync]];
    }
    let o_html = await f_o_html_element__from_s_tag(s_tag);
    for(let s_prop in o_js){
        let v = o_js[s_prop];
        
 
        let s_type_v = typeof v;
        if(s_type_v == "function"){
            let f_event_handler = function(){
                v.call(this, ...arguments, o_js);
            }
 
 
            o_html[s_prop] = f_event_handler
            if(!o_html.o_meta){
                o_html.o_meta = {o_js, o_state}
            }
            o_html.o_meta[s_prop] = v
           
        }
        if(typeof v != 'function'){
            // some attributes such as 'datalist' do only have a getter
 
             try {
                 o_html.setAttribute(s_prop, v);
             } catch (error) {
                 console.warn(error)
             }
            try {
                o_html[s_prop] = v;
            } catch (error) {
                console.warn(error)
            }
 
        }
        if(v == 'hello'){
         window.o_el = o_html
        }
 
    }
    
    if(o_js?.f_s_innerText){
        o_html.innerText = o_js?.f_s_innerText()
    }
    if(o_js?.f_s_innerHTML){
        o_html.innerHTML = o_js?.f_s_innerHTML()
    }
    
    if(o_js?.f_a_o){
        let a_o = await o_js?.f_a_o();
        a_o = await Promise.all(a_o);
        for(let o_js2 of a_o){
            let n_idx = a_o.indexOf(o_js2);
            let o_html2 = await f_o_html_from_o_js(o_js2, o_state);
            o_html.appendChild(o_html2)
 
        }
    }
 
    let s_path = o_js?.[s_name_attr_prop_sync]?.[0];
    if(!o_html.o_meta){
     o_html.o_meta = {
         o_js, 
         o_state
     }
    }
    if(s_path){
        let o_state = o_html?.o_meta?.o_state;
        f_try_to_update_element_from_params(
         o_html, 
         o_state, 
         s_path
        );
    }
 
 
    if(o_js?.f_b_render?.() === false){
         // let o_html2 = document.createComment('b_render')
         let o_html2 = await f_o_html_element__from_s_tag('div');
         o_html2.style.display = 'none';
         // let o_html2 = await f_o_html_element__from_s_tag('div')
         // // just let the content be empty, but the attributes are still required like 'a_s_prop_sync'
         // debugger
         f_update_element_to_match(o_html,o_html2)
         o_html2.innerHTML = ''
         o_html2.o_meta = {o_js, o_state}
         return o_html2;
     }
     if(o_js?.f_after_render){
         o_js.f_after_render(o_html)
     }
 
    return o_html;
 }
 const f_b_object_or_array = (value) => {
     return (value !== null && typeof value === 'object'&& !Array.isArray(value)) || Array.isArray(value);
   };
 let f_set_by_path_with_type = function(obj, s_prop_path, value) {
    const a_s_prop_path_part = s_prop_path.split('.');
    let o_current = obj;
  
    // Traverse to the parent of the target property
    for (let i = 0; i < a_s_prop_path_part.length - 1; i++) {
      const s_prop_path_part = a_s_prop_path_part[i];
      if (o_current && typeof o_current === 'object' && s_prop_path_part in o_current) {
        o_current = o_current[s_prop_path_part]; // Move deeper into the object
      } else {
        throw new Error(`Invalid s_prop_path: ${s_prop_path}`); // If any part of the path is invalid, throw an error
      }
    }
  
    // Get the target property name (last part of the path)
    const s_prop_path_part_target = a_s_prop_path_part[a_s_prop_path_part.length - 1];
  
    // Check if the target property exists
    if (o_current && typeof o_current === 'object' && s_prop_path_part_target in o_current) {
      const v_current = o_current[s_prop_path_part_target];
      const s_type_current = typeof v_current;
  
      // Convert the new value to the same type as the current value
      let v_new;
      switch (s_type_current) {
        case 'number':
          v_new = Number(value);
          if (isNaN(v_new)) {
            throw new Error(`Cannot convert "${value}" to a number.`);
          }
          break;
        case 'string':
          v_new = String(value);
          break;
        case 'boolean':
          v_new = Boolean(value);
          break;
        default:
          throw new Error(`Unsupported type: ${v_current}`);
      }
  
      // Set the new value
      o_current[s_prop_path_part_target] = v_new;
    //   console.log(`Value set successfully at path "${s_prop_path}". New value:`, v_new);
    } else {
      throw new Error(`Property at path "${s_prop_path}" does not exist.`);
    }
  }
 
  let f_handle_input_change = function(o_ev, o_state) {
    o_el_global_event = o_ev.target;
 
    // console.log(`Event "${event.type}" triggered on:`, event.target);
    let a_s_prop_sync = o_ev.target.getAttribute(s_name_attr_prop_sync)?.split(',');
 
    if(a_s_prop_sync){
        for(let s_prop_sync of a_s_prop_sync){
            let a_s = s_prop_sync.split('.');
            let value;
            // Check if the input is a checkbox
            if (o_ev.target.type === 'checkbox') {
                value = o_ev.target.checked; // Use the checked property for checkboxes
            } else {
                value = o_ev.target.value; // Use the value property for other input types
            }
            f_set_by_path_with_type(o_state, s_prop_sync,value)
        }
    }
    o_el_global_event = null;
 
    // console.log('Input value changed:', o_ev.target.value);
  }
 
  let s_cancel_msg = 'Cancelled_by_f_cancel_call'
  let f_o_promise_and_cancelfunction = function(f_executor) {
     let f_cancel;
     const o_promise = new Promise((resolve, reject) => {
       f_cancel = () => {
         reject(new Error(s_cancel_msg));
       };
       f_executor(resolve, reject, f_cancel);
     });
     
     return { o_promise, f_cancel };
   }
   const getLastNumberPart = (path) => {
     // Match the last number and optionally the string after it
     const match = path.match(/(\d+)(\.[^\.]+)?$/);
     if (!match) return null; // No number found
   
     // Return the number and the optional string after it
     return match[1] + (match[2] || '');
   };
 
 
 const f_o_proxified = function (
    v_target, 
    f_callback_beforevaluechange = (a_s_path, v_old, v_new)=>{},
    f_callback_aftervaluechange = (a_s_path, v_old, v_new)=>{},
    o_div = document,
    a_s_prop_path_part = []
 
 ) {
     let o_state_readable = {}
 
     let f_async_callback = async function(
         v_target,
         a_s_path,
         v_old,
         v_new,
         a_n_idx_array_item__removed,
         a_n_idx_array_item__added,
         n_idx_array_item__modified,
         signal, 
         o_div = document
      ){
 
         let s_path = a_s_path.join('.')
         let a_s_path_with_n = a_s_path.map(v => {
            // Check if the v is a number (either as a number or a string that can be parsed to an integer)
            if (typeof v === 'number' && Number.isInteger(v)) {
              return '[n]';
            } else if (typeof v === 'string' && !isNaN(v) && Number.isInteger(Number(v))) {
              return '[n]';
            } else {
              return v;
            }
          });
          let a_o_el_original = Array.from(document.querySelectorAll(`[${s_name_attr_prop_sync}]`)).map(o_el => {
            let a_s_path = o_el.getAttribute(s_name_attr_prop_sync)?.split(','); 
            return {
                o_el, 
                a_s_path,
            }
          }); 

        let a_o_el = []
         let b_object_or_array = f_b_object_or_array(v_new);
         if(b_object_or_array){
            a_o_el = a_o_el_original.filter(o=>{
                return o?.a_s_path.find(s_path2 =>{
                    return s_path2.startsWith(s_path)
                }) != undefined
            })
         }else{
            a_o_el = a_o_el_original.filter(o=>{
                return o.a_s_path.find(s_path2 =>{
                    return s_path2 == (s_path)
                }) != undefined
            })
         }
         let a_tmp = a_s_path_with_n.slice(); // clone a_s_path_with_n
         while(a_tmp.length > 0 && a_tmp.includes('[n]')){
            let s_path3 = a_tmp.join('.');
            a_o_el.push(
                ...a_o_el_original.filter(o=>{
                    return o?.a_s_path.find(s_path2 =>{
                        return s_path2.startsWith(s_path3)
                    }) != undefined
                })
            )
            a_tmp.pop();
         }

         a_o_el = a_o_el.filter(o=>{
             return o != o_el_global_event
         });
         
         for(let o2 of a_o_el){
            let o_el = o2.o_el;
             // console.log(`o_el.o_meta.b_rendering: ${o_el.o_meta.b_rendering}`)
             if(o_el.o_meta?.f_cancel_rendering && o_el.o_meta.b_rendering === true){
                 await o_el.o_meta?.f_cancel_rendering();
                 o_el.o_meta.b_rendering = false;
             }else{
                 let o = f_o_promise_and_cancelfunction(
                     async (f_resolve, f_reject, f_onCancel)=>{
 
                         o_el.o_meta.b_rendering = true;
                         let b_render = o_el?.o_meta?.o_js?.f_b_render?.();
                         if(b_render === false){
                             // o_el.style.display = 'none';
                             let o_el2 = await f_o_html_from_o_js(o_el?.o_meta?.o_js, o_el?.o_meta?.o_state); 
                             o_el.replaceWith(o_el2)
                             f_resolve(true);
                         }
                         if(b_render === true){
                             let o_el2 = await f_o_html_from_o_js(o_el?.o_meta?.o_js, o_el?.o_meta?.o_state); 
                             o_el.replaceWith(o_el2)
                             f_resolve(true);
                             
                         }
                         if(o_el == o_el_global_event){
                             f_resolve(true);
                             
                         }
                         f_try_to_update_input_select_or_checkbox_element(
                             o_el, 
                             v_new
                         )
                         if(o_el?.o_meta?.f_s_innerText){
                             let s = o_el.o_meta.f_s_innerText();
                             o_el.innerText = s;
                         }
                         if(o_el?.o_meta?.f_s_innerHTML){
                             let s = o_el.o_meta.f_s_innerHTML();
                             o_el.innerHTML = s;
                         }
                         if(o_el?.o_meta?.f_a_o){
                             // console.log(o.o_meta)
                             // debugger
                  
                             // console.log(`starting: ${new Date().getTime()}`)
                             // console.log(o_el.o_meta.b_done)
                  
                             let a_o_js = await o_el?.o_meta?.f_a_o();
                             // console.log('a_o_js')
                             // console.log(a_o_js)
                  
                             // we always have to render the full array
                             // since there could also be a 'static' html object in f_a_o that is not part of the array of the proxy. 
             
                             // for(let n_idx_array_item__removed of a_n_idx_array_item__removed){
                             //      o_el.removeChild(o_el.children[n_idx_array_item__removed]);
                             // }
                             // for(let n_idx_array_item__added of a_n_idx_array_item__added){
                             //      let o_el2 = await f_o_html_from_o_js(a_o_js[n_idx_array_item__added], o_el?.o_meta?.o_state);
                             //      o_el.insertBefore(o_el2, o_el.childNodes[n_idx_array_item__added+1]);
                             // }
                             // if(!isNaN(n_idx_array_item__modified)){
                             //      let o_el2 = await f_o_html_from_o_js(a_o_js[n_idx_array_item__modified], o_el?.o_meta?.o_state);
                             //      f_update_element_to_match(
                             //          o_el2,
                             //          o_el.childNodes[n_idx_array_item__modified]
                             //      )
                             // }
                             
                             // if(
                             //      (
                             //         //  Array.isArray(v_old) && Array.isArray(v_new)
                             //         //  &&
                             //          a_n_idx_array_item__removed.length == 0
                             //          && 
                             //          a_n_idx_array_item__added.length == 0
                             //          &&
                             //          isNaN(n_idx_array_item__modified)
                             //      )
                             //     ){
                                     o_el.innerHTML = ''
                                     for(let n_idx in a_o_js){
                                         let o_js2 = a_o_js[n_idx];
                                         let o_html2 = await f_o_html_from_o_js(o_js2, o_el?.o_meta?.o_state);
                                         o_el.appendChild(o_html2)
                                         if(o_js2?.f_after_render){
                                             await o_js2?.f_after_render(o_html2);
                                         }
                                         // console.log('appending child')
                                         // console.log(o_html2)
                                     }
                             // }
             
                  
                         }
                         
                         f_resolve(true);
 
                     }
                 )
                 o_el.o_meta.f_cancel_rendering = o.f_cancel
                 try {
                     await o.o_promise;
                     // if(o_el?.o_meta?.o_js?.f_after_render){
                     //     await o_el?.o_meta?.o_js?.f_after_render(o_el);
                     // }
 
                 } catch (error) {
                     if (error.message === s_cancel_msg) {
                         console.warn('it may be that your element is trying to be rendered before it has finished rendering!')
                         // Ignore the 'Cancelled' error
                         return;
                     }
                 }
                 o_el.o_meta.b_rendering = false;
 
             }
 
         }
      }
      
    // i want to be able to trigger a async function 'f_async_callback' when a possibly nested object gets manipulated in any way. 
    // the function should receive the following parameters.
    // also if f_async_callback has already called and has not yet ended (can take up to 2 sec) 
    // if it will get called again the last call of it should be canceled
    // remember that i want to be able to monitor all changes on the object which could be 
    // example: 
 
    // o = f_o_proxified({n:2});
 
    // o.n = 3 // this change should trigger the 'f_async_callback'
    // o.o_nested = {n:1} // this should also add a proxy on o.o_nested  
    // o.o_nested.n = 55 // this should also trigger the 'f_async_callback'
    
    // o.a = [1,2,3,4,{n:9}] 
    // now for arrays those are a bit special in javascript i guess
    // so a normal change would be 
    // o.a[2] = 22
    // but also those functions should trigger the callback 'f_async_callback' but only once !
    // o.a.push(99)
    // o.a.pop()
    // o.a.splice(2, 0, "Lemon", "Kiwi"); // At position 2, add "Lemon" and "Kiwi":
    // o.a = o.a.filter((v)=>{return !isNaN(v)})
    // when any array manipulation happens the according parameters should be 
    // built, the possible parameters are 
    // a_n_idx_array_item_removed // an array with the indices of the removed elements 
    // a_n_idx_array_item_added // an array with the indices of the added elements
    // n_idx_array_item_modified // the index of the array item that has been modified
    // so for example 
    // o.a[3] = 11 // n_idx_array_item_modified would be 3
    // o.a[3] = {n:9} // n_idx_array_item_modified would be also 3
    // o.a.push() // a_n_idx_array_item_added would be [{last_index_of_array_depending_on_array_size}]
    // o.a.splice(5, 0, item);// a_n_idx_array_item_added would be [5]
    // i dont know if this is even possible  
    // but i assume one can not find out what indices are removed if for example 
    // a .map  function is used on the array, it is not possible
    // to know what of the new items are the same as the old items
    // but this is ok. in this case a_n_idx_array_item_removed and a_n_idx_array_item_added 
    // would just be an empty array 
    // o.a = o.a.filter((v)=>{return isNaN(v)})
 
 
 
    // so basically there are three ways to manipulate an array
    // 1. directly manipulate an item by using an index, a[n_idx] = 2
    // 2. using 'helper?' functions like .pop() .shift() .splice() etc. 
    // 3. reassigning by using filter or map like a = a.filter(...)
 
 
    // so in the 'f_async_callback' there should be the following parameters passed to it
    // 'v_target' // the target if for example o.o2.n = 2 the target would be the object o.o2
    // 'a_s_prop_path_part' an array containing strings that represent the path of manipulated object
    //        so for example o.o2.o_nested.a[5] = {n:9} , would be ['o','o2','o_nested','a','5']
    //           for example o.o2.o_nested.a.splice(2, 0, "Lemon", "Kiwi");, would be ['o','o2','o_nested','a']
    // 'v_old' // the old value 
    // 'v_new' // the new value
 
    // are there more edge cases i did not consider?
 
    // stick to the following coding conventions  
    // variable names all have prefixes
    // v_ => 'value' a variable with a 'unknown' type
    // n_ => numnbers , eg. a.map((n_idx, v)=>{...})
    // b_ => boolean 
    // o_ => object
    // a_ => array
    // f_ => functions, yes also functions are variables, like let f_test = ()=>{return 'test'}
    // define all functions with a variable declaration keyword for example 
    // let f_test = function(){return 'test'}
    // a_n_ => an array containing numbers eg. [1,2,3]
    // a_o_ => an array containing objects eg. [{},{},{}]
    // s_f_ => a string that is a function that then could be used in 
    // new Function or eval 
    // s_f_test = `return 'test'`, ->new Function(s_f_test);
    // s_json__o_person = JSON.stringify(o_person), would be a object o_person in json / string format
    // an exeption: if objects with same structure are needed ofen times classes are used, 
    // but instead of having classes we have functions in this style 
    // f_O_person = function(s_name, n_age){return {s_name, n_age}}
    // this would return an object that represents a person. the equivalent of a class would be 
    //   class O_person {
    //     constructor(s_name, n_age) {
    //       this.s_name = s_name;
    //       this.n_age = n_age;
    //     }
    //   }
    // but like i said a simple function is preferred!
    // if a function returns a certain type this prefix comes at second place for example
    // f_a_n_=> a function that returns an array of numbers like let f_a_n_test = () =>{return [1,2,3]}
    
 
    // another important this is , the plural form of words has to be omitted completly
    // example: 'hans' would be the value, we could use 's_name' as a variable name
    // ['hans', 'gretel', 'ueli', 'jasmin'] would be the value 
    // 'a_s_name' would be the variable name, since this is an array of names, 
    // so 'a_s_names' is wrong, it is an array 'a_', containing 's_name' variables, so 'a_s_name'! 
 
    // the last thing: try to always 'group' variable names, so if the values are similar but the variable names 
    // have to be distinguished always use the basic / more general variable name in front of it , for example 
 
    // let o_person__hans = new O_person('hans', 20);
    // let o_person__gretel = new O_person('gretel', '19'); 
 
    // more exmaples
    // for example an id is a very generic term so it comes first
    // n_timeout_id wrong, correct: n_id__timeout
    // n_frame_id wrong, correct: n_id__frame
    // n_start_index wrong, correct: n_idx__start, respectively n_idx__end 
    // n_timestamp_ms wrong, correct: n_ms__timestamp, or n_sec__timestamp or n_min__timestamp
    
 
    // thats all, now solve my problem
    if (typeof v_target !== 'object' || v_target === null) return v_target;
 
    
    const a_s_array_methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    const o_map_proxies = new WeakMap();
    let o_pending_async_callback = null;
 
    const f_wrap_array_method = function (
        o_array_target, 
        s_method_name, 
        a_args, 
        a_s_prop_path_part, 
    ) {
        const f_original_method = Array.prototype[s_method_name];
        const a_v_array_old = [...o_array_target];
        const n_array_length_old = a_v_array_old.length;
        const v_result = f_original_method.apply(o_array_target, a_args);
        const a_v_array_new = [...o_array_target];
        const n_array_length_new = a_v_array_new.length;
 
        let a_n_idx_array_item__removed = [];
        let a_n_idx_array_item__added = [];
        let n_idx_array_item__modified = undefined;
 
        switch (s_method_name) {
            case 'push':
                a_n_idx_array_item__added = Array.from(
                    { length: a_args.length }, 
                    (_, n_idx) => n_array_length_old + n_idx
                );
                break;
            case 'pop':
                if (n_array_length_old > 0) a_n_idx_array_item__removed = [n_array_length_old - 1];
                break;
            case 'shift':
                if (n_array_length_old > 0) a_n_idx_array_item__removed = [0];
                break;
            case 'unshift':
                a_n_idx_array_item__added = Array.from({ length: a_args.length }, (_, n_idx) => n_idx);
                break;
            case 'splice': {
                const n_start_idx = a_args[0] < 0 
                    ? Math.max(n_array_length_old + a_args[0], 0) 
                    : Math.min(a_args[0], n_array_length_old);
                const n_delete_count = a_args[1] || 0;
                a_n_idx_array_item__removed = Array.from(
                    { length: Math.min(n_delete_count, n_array_length_old - n_start_idx) },
                    (_, n_idx) => n_start_idx + n_idx
                );
                a_n_idx_array_item__added = Array.from(
                    { length: a_args.length - 2 },
                    (_, n_idx) => n_start_idx + n_idx
                );
                break;
            }
            default: {
                const a_n_idx_modified = [];
                for (let n_idx = 0; n_idx < Math.max(n_array_length_old, n_array_length_new); n_idx++) {
                    if (a_v_array_old[n_idx] !== a_v_array_new[n_idx]) {
                        a_n_idx_modified.push(n_idx);
                    }
                }
                if (a_n_idx_modified.length > 0) n_idx_array_item__modified = a_n_idx_modified[0];
                break;
            }
        }
 
        f_async_callback(
            o_array_target,
            a_s_prop_path_part,
            a_v_array_old,
            a_v_array_new,
            a_n_idx_array_item__removed,
            a_n_idx_array_item__added,
            n_idx_array_item__modified, 
        );
 
        return v_result;
    };
 
    const f_create_proxy_handler = function (a_s_prop_path_part, o_div = document) {
        return {
            get: function (o_target, s_prop) {
                const v_value = Reflect.get(...arguments);
 
                if (Array.isArray(o_target) && a_s_array_methods.includes(s_prop)) {
                    return (...a_args) => f_wrap_array_method(o_target, s_prop, a_args, a_s_prop_path_part, o_div);
                }
 
                if (typeof v_value === 'object' && v_value !== null) {
                    return f_o_proxified(
                        v_value,
                        f_callback_beforevaluechange,
                        f_callback_aftervaluechange, 
                        o_div,
                        a_s_prop_path_part.concat(s_prop), 
                    );
                }
 
                return v_value;
            },
            set: function (o_target, s_prop, v_value) {
                const v_old_value = o_target[s_prop];
                const a_s_full_prop_path = a_s_prop_path_part.concat(s_prop);
 
                const v_new_proxified = f_o_proxified(
                    v_value,
                    f_callback_beforevaluechange,
                    f_callback_aftervaluechange,
                    o_div,
                    a_s_full_prop_path
                );
 
                f_callback_beforevaluechange(a_s_full_prop_path, v_old_value, v_new_proxified);
                const b_success = Reflect.set(o_target, s_prop, v_new_proxified);
                f_callback_aftervaluechange(a_s_full_prop_path, v_old_value, v_new_proxified);
 
                if (b_success) {
                    const a_n_idx_array_item__removed = [];
                    const a_n_idx_array_item__added = [];
                    let n_idx_array_item__modified = undefined;
 
                    if (Array.isArray(o_target) && typeof s_prop === 'string' && !isNaN(s_prop)) {
                        n_idx_array_item__modified = parseInt(s_prop, 10);
                    }
 
                    let s_prop2 = a_s_full_prop_path?.at(-2);
                     if(!isNaN(s_prop2)){
                         n_idx_array_item__modified = Number(s_prop2)
                     }
 
                    f_async_callback(
                        o_target,
                        a_s_full_prop_path,
                        v_old_value,
                        v_new_proxified,
                        a_n_idx_array_item__removed,
                        a_n_idx_array_item__added,
                        n_idx_array_item__modified, 
                    );
                }
 
                return b_success;
            }
        };
    };
 
    if (o_map_proxies.has(v_target)) return o_map_proxies.get(v_target);
 
    const o_proxy_handler = f_create_proxy_handler(a_s_prop_path_part);
    const o_proxy = new Proxy(v_target, o_proxy_handler);
    o_map_proxies.set(v_target, o_proxy);
    o_state_readable = o_proxy
    return o_proxy
 
 };
 let f_try_to_update_input_select_or_checkbox_element = function(
    o_el_html, 
    v_value
 ){
    // 4. Update element based on type
    if (o_el_html.type === 'checkbox' || o_el_html.type === 'radio') {
        o_el_html.checked = !!v_value;
    } else {
        o_el_html.value = v_value != null ? v_value.toString() : '';
    }
 }
 const f_try_to_update_element_from_params = function(
    o_el_html, 
    o_state,
    s_path
) {
    
    // 1. Check if element is input
    // if (!(o_el_html instanceof HTMdLInputElement)) return;

    // 2. Split path into components
    const a_s_path_part = s_path.split('.');
    
    // 3. Get value from state
    const v_value = f_v_from_path(o_state, a_s_path_part);
    // 4. Update element based on type
    if (o_el_html.type === 'checkbox' || o_el_html.type === 'radio') {
        o_el_html.checked = !!v_value;
    } else {
        o_el_html.value = v_value != null ? v_value.toString() : '';
    }
};



 let f_v_from_path_dotnotation = function(path, obj) {
     if(path.trim()==''){return obj}
     // Split the path by dots to get the individual keys
     const keys = path.split('.');
 
     // Iterate through the keys to traverse the object
     let current = obj;
     for (const key of keys) {
         // Check if the current value is an array and the key is a number (array index)
         if (Array.isArray(current) && !isNaN(key)) {
             current = current[parseInt(key)]; // Access the array index
         } else if (current && typeof current === 'object' && key in current) {
             current = current[key]; // Access the object property
         } else {
             // If the key doesn't exist or the path is invalid, return undefined
             return undefined;
         }
     }
 
     // Return the final value
     return current;
 }
 
 // let f_traverse_nested_object = function(
 //     o_target,
 //     a_s_prop_path_part = [],
 //     f_callback = (a_s_prop_path_part, v_value) => {}
 // ) {
 //     // First call callback for current node
 //     f_callback(a_s_prop_path_part, o_target);
 
 //     // Process object/array children recursively
 //     if (typeof o_target === 'object' && o_target !== null) {
 //         for (const s_key of Object.keys(o_target)) {
 //             const a_s_path_new = [...a_s_prop_path_part, s_key];
 //             const v_child_value = o_target[s_key];
             
 //             f_traverse_nested_object(
 //                 v_child_value,
 //                 a_s_path_new,
 //                 f_callback
 //             );
 //         }
 //     }
 // };
 // let f_traverse_nested_object_and_initialize_values = function(
 //     o, 
 // ){
 //     f_traverse_nested_object(
 //         o, 
 //         [], 
 //         (a_s_path_tmp, v_value)=>{
 //             let s_path = a_s_path_tmp.join('.')
 //             const a_o_el2 = document.querySelectorAll(`[${s_name_attr_prop_sync}*="${s_path}"]`);
 //             if(s_path == 'a_o_person.0.s_name'){
 //                 debugger
 //             }
 //             const a_o_el__filtered = Array.from(a_o_el2).filter(el => {
 //                 const a_s = el.getAttribute(s_name_attr_prop_sync).split(',');
 //                 return a_s.includes(s_path) && el != o_el_global_event;
 //             });
 //             for(let o_el of a_o_el__filtered){
 //                 if(o_el.value){
 //                     o_el.value = v_value
 //                     console.log('o_el.value');
 //                     console.log(o_el.value);
 //                 }
 //                 if(o_el?.o_meta?.f_s_innerText){
 //                     let s = o_el.o_meta.f_s_innerText();
 //                     o_el.innerText = s;
 //                 }
 //             }
 //         }
 //     )
 // }
 const f_o_proxified_and_add_listeners = function(
     v_target, 
     f_callback_beforevaluechange = (a_s_path, v_old, v_new)=>{},
     f_callback_aftervaluechange = (a_s_path, v_old, v_new)=>{},
     o_div = document,
     a_s_prop_path_part = [], 
 ){
     let o_proxy = f_o_proxified(
         v_target, 
         f_callback_beforevaluechange, 
         f_callback_aftervaluechange,
         o_div,
         a_s_prop_path_part
     )
     // Attach the event listener to the document or a parent element
     o_div.addEventListener('input', (o_ev) => {
         // Check if the event target is an input, textarea, or select
         if (o_ev.target.matches('input, textarea, select')) {
             f_handle_input_change(o_ev, o_proxy);
         }
     });
     return o_proxy;
 }
 
 let  f_s_random_uuid__with_unsecure_fallback = function() {
     if (globalThis.crypto && globalThis.crypto.randomUUID) {
         return globalThis.crypto.randomUUID();
     } else {
         console.warn("âš ï¸ Warning: Using a less secure UUID generator. Consider using HTTPS for better security.");
         return f_s_random_uuid_unsecure();
     }
 }
 
 let f_s_random_uuid_unsecure = function() {
     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
         const r = (Math.random() * 16) | 0;
         const v = c === 'x' ? r : (r & 0x3) | 0x8;
         return v.toString(16);
     });
 }
 
 
 let f_o_mod__notifire = async function(){
     
     let s_class_name = `class_${f_s_random_uuid__with_unsecure_fallback()}`;
     let o_div = document.createElement('div');
     // first we define our data in a state object
     let o_state = f_o_proxified_and_add_listeners(
         {
             a_o_message: []
         }, 
         ()=>{},
         ()=>{}, 
         o_div
     )
     let s_css = `
         .o_mod__notifire.${s_class_name}{
             position:fixed; 
             top:0;
             right:0;
             background: red;
         }
         .success label{
             background: #d4edda; /* Soft green */
             color: #155724 !important; /* Dark green */
             border: 1px solid #c3e6cb;
         }
         
         .error label{
             background: #f8d7da; /* Soft red */
             color: #721c24 !important; /* Dark red */
             border: 1px solid #f5c6cb;
         }
         
         .warning label{
             background: #fff3cd; /* Soft yellow */
             color: #856404 !important; /* Dark yellow */
             border: 1px solid #ffeeba;
         }
         .o_message{
             padding: 0.2rem;
             position:relative;
         }
         .bar{
             position:absolute;
             height: 1px;
             top:0;
             left:0;
             z-index:0;
             background: red;
         }
         .text{
             z-index:1;
             background: transparent;
         }
     `
     let o_html = await f_o_html_from_o_js(
         {
             class: `o_mod__notifire ${s_class_name}`,
             f_a_o: ()=>{
                 return o_state.a_o_message
                     .map(
                         o=>{
                             
                             return {     
                                 class: [`o_message`,o.s_class].join(' '),          
                                 style: `display: ${(o.b_show) ? 'block': 'none'}`,     
                                 f_a_o: ()=>{
                                     return [
                                         {
                                             class: "text",
                                             s_tag: "label",
                                             f_s_innerText:()=>{
                                                 return o.s
                                             }, 
                                         }, 
                                         {
                                             class: 'bar',
                                             style: `width:${parseInt((o.n_ms/o.n_ms__max)*100)}%`
                                         }
 
                                     ]
                                 }
                             }
                         }
                     )
             }, 
             a_s_prop_sync: 'a_o_message'
         }, 
         o_state
     )
     o_div.appendChild(o_html);
     let f_push_message = function(
         s, 
         n_ms__max,
         s_class,
     ){
         let o_message = {
             b_show: true, 
             s: s,
             s_class, 
             n_ms:0,
             n_ms__max, 
             n_id_interval: 0
         };
         o_state.a_o_message.push(o_message)
         o_message = o_state.a_o_message.at(-1);//get the proxy reference
 
         let n_ms_interval = 100;
         // o_message.n_ms = 200;
         // o_message.n_ms__max = 1000;
         o_message.n_id_interval = setInterval(()=>{
             if(o_message.n_ms > o_message.n_ms__max){
                 o_message.b_show = false;
                 clearInterval(o_message.n_id_interval)
             };
             o_message.n_ms+=n_ms_interval
         },n_ms_interval)
 
     }
     let o = {
         o_div, 
         o_state, 
         f_message_success: function(s, n_ms__max = 3000){f_push_message(s,n_ms__max, 'success')}, 
         f_message_error: function(s, n_ms__max = 3000){f_push_message(s,n_ms__max, 'error')}, 
         f_message_warning: function(s, n_ms__max = 3000){f_push_message(s,n_ms__max, 'warning')}, 
         s_css
     }
     return o;
 }
 
 let f_o_img_cached = async function(s_url, a_o_img=[]){
     let s_url_absolute = new URL(s_url, window.location.href).href;
     return new Promise(
         (f_res, f_rej)=>{
 
             let o_img__existing = a_o_img.find(
                 o=>{
                     return o.src == s_url_absolute
                 }
             )
             if(document){
                 let o_img__existing_in_dom = Array.from(document.querySelectorAll('img')).find(o=>{
                     o.src == s_url_absolute
                 });
                 if(o_img__existing_in_dom){
                     return f_res(o_img__existing_in_dom);
                 }
             }
             if(o_img__existing){
                 return f_res(o_img__existing);
             }
             if(!o_img__existing){
                 // Create a new Image object
                 const o_img = new Image();
     
                 // Set the src attribute to load the image
                 o_img.src = s_url_absolute;
     
                 // Optional: Add event listeners for when the image loads or fails
                 o_img.onload = () => {
                     a_o_img.push(o_img)
                     return f_res(o_img)
                     // console.log("Image loaded successfully!");
                     // You can now append the image to the DOM or use it in other ways
                 };
     
                 o_img.onerror = (o_err) => {
                     return f_rej(o_err)
                     console.error("Failed to load the image.");
                 };
             }
         }
     )
 };
 
 let f_o_mod__image_gallery = async function(
     o_state
 ){
     
     let a_o_image = []
 
     let s_class_name = `class_${f_s_random_uuid__with_unsecure_fallback()}`;
     let o_div = document.createElement('div');
     Object.assign(
         o_state, 
         {
             n_render_images: 0,
             a_s_url_image: (o_state.a_s_url_image) ? o_state.a_s_url_image : [
                 //provide an array of image urls here
                 // './images/jonas-frey-1IWoSFH-Oog-unsplash.jpg',
                 // './images/jonas-frey-cqbAPdIs0QA-unsplash.jpg',
                 // './images/jonas-frey-d8AgCj2epJc-unsplash.jpg',
             ],
             n_images_per_x: (o_state.n_images_per_x) ? o_state.n_images_per_x : 3,
             n_scl_x_parent: 0,
         }, 
     );
     o_state = f_o_proxified_and_add_listeners(
         o_state,
         ()=>{
             // debugger
         },
         function(){
             // console.log(...arguments)
             // debugger
         }, 
         o_div
     )
 
     let s_css = `
         .o_mod__image_gallery.${s_class_name}{
             overflow-y: scroll;
             overflow-x:hidden;
             position:relative;
 
         }
         .o_mod__image_gallery.${s_class_name} img{
         }
         
     `
     let f_o_img_info = function(o_img){
         let n_ratio_x_to_y = o_img.naturalWidth / o_img.naturalHeight;
         let o_el_parent = document.querySelector(`.${s_class_name}`)?.parentElement;
         let o_bounds = o_el_parent?.getBoundingClientRect();
         let n_width = (o_bounds?.width) ? o_bounds?.width : 1000;
         console.log(o_bounds)
         let n_scl_x = n_width / o_state.n_images_per_x;
         let n_scl_y = n_scl_x * (1./n_ratio_x_to_y);
 
         return {
             n_scl_x, 
             n_scl_y, 
             n_ratio_x_to_y
         }
     }
     let f_recalculate_images = function(){
         
         
         let a_o_img = Array.from(document.querySelectorAll(`.${s_class_name} img`));
         console.log(a_o_img);
         let n_trn2_y_max = 0;
         for(let n_idx in a_o_img){
             let o = a_o_img[n_idx];
             
             n_idx = parseInt(n_idx);
             let n_idx_above = n_idx-o_state.n_images_per_x;
             let n_trn_y = 0;
             o.o_data = f_o_img_info(o);
             if(n_idx_above >= 0){
                 let o_img_above = a_o_img[n_idx_above];
                 n_trn_y = o_img_above.o_data.n_trn_y +o_img_above.o_data.n_scl_y;
             }
             o.o_data.n_trn_x = (n_idx%o_state.n_images_per_x)*o.o_data.n_scl_x;
             o.o_data.n_trn_y = n_trn_y;
 
             o.style.width = `${o.o_data.n_scl_x}px`
             o.style.height = `${o.o_data.n_scl_y}px`
             o.style.left = `${o.o_data.n_trn_x}px`
             o.style.top = `${o.o_data.n_trn_y}px`
             let n_trn2_y = o.o_data.n_scl_y+o.o_data.n_trn_y;
             if(n_trn2_y > n_trn2_y_max){
                 n_trn2_y_max = n_trn2_y
             }
         }
         let o2 = document.querySelector(`.${s_class_name}`);
         if(o2){
             o2.style.height = n_trn2_y_max + "px";
         }
         // debugger
 
     }
     window.onresize = function(){
         f_recalculate_images();
 
     }
     let o_js = {
         class: `o_mod__image_gallery ${s_class_name}`,
         f_a_o: async ()=>{
 
             return [                    
                 ...o_state.a_s_url_image.map(async (s)=>{
                     // we have to make sure the image is loaded...
                     let o = await f_o_img_cached(s, a_o_image);
                     return {
                         s_tag: "img", 
                         src: s,
                         style: [
                             `position:absolute`,
                         ].join(';')
                     }
                 })
             ]
         },
         f_after_render: ()=>{
             f_recalculate_images();
         },
         a_s_prop_sync: ['a_s_url_image', 'n_render_images']
     };
     let o_html = await f_o_html_from_o_js(
         o_js,
         o_state
     );
     o_div.appendChild(o_html);
     let o = {
         o_div, 
         o_state, 
         o_js,
         s_css, 
         f_recalculate_images
     }
     return o;
 }
 
 let f_a_o_img__gallery_from_a_o_img = function(
     a_o_img, 
     n_scl_x_px_container,
     n_images_per_x,
     n_px_margin_x,
     n_px_margin_y,
 
 ){
     for(let n_idx in a_o_img){
         let o_img = a_o_img[n_idx];
         n_idx = parseInt(n_idx);
         let n_idx_above = n_idx-n_images_per_x;
         let n_trn_y = 0;
 
         let n_ratio_x_to_y = o_img.naturalWidth / o_img.naturalHeight;
         let n_scl_x = (n_scl_x_px_container / n_images_per_x)-n_px_margin_x;
         let n_scl_y = (n_scl_x * (1./n_ratio_x_to_y));
 
         if(n_idx_above >= 0){
             let o_img_above = a_o_img[n_idx_above];
             n_trn_y = o_img_above.o_data_img_gal.n_trn_y + o_img_above.o_data_img_gal.n_scl_y + n_px_margin_y;
         }
         let n_trn_x = (n_idx%n_images_per_x)*(n_scl_x + n_px_margin_x);
 
         o_img.o_data_img_gal = {
             n_scl_x, 
             n_scl_y, 
             n_ratio_x_to_y, 
             n_trn_x, 
             n_trn_y
         }
     }
     return a_o_img
 }
 
 let f_a_o_img__gallery_from_a_s_url = async function(
     a_s_url,
     n_scl_x_px_container,
     n_images_per_x,
     n_px_margin_x,
     n_px_margin_y
 ){
     let a_o_img = await Promise.all(
         a_s_url.map(s_url=>{
             return f_o_img_cached(s_url, [])
         })
     );
     a_o_img = f_a_o_img__gallery_from_a_o_img(
         a_o_img,
         n_scl_x_px_container,
         n_images_per_x,
         n_px_margin_x,
         n_px_margin_y
     );
     return a_o_img;
 
 }
 
 let f_a_o_img__gallery_from_a_s_url_and_resize_images_and_container = async function(
     a_s_url, 
     o_el_container,
     n_images_per_x,
     n_px_margin_x,
     n_px_margin_y,
 ){
 
     let o_bounds = o_el_container?.getBoundingClientRect();
     let n_scl_x_px_container = (o_bounds?.width) ? o_bounds?.width : 1000;
 
     let a_o_img = await f_a_o_img__gallery_from_a_s_url(
         a_s_url, 
         n_scl_x_px_container,
         n_images_per_x,
         n_px_margin_x,
         n_px_margin_y,
     );
     let n_trn_y_max = 0; 
 
     let a_o_img_existing_in_dom = Array.from(o_el_container.querySelectorAll('img'));
     
     for(let o_img of a_o_img){
         let s_url_absolute = o_img.src;//new URL(s_url, window.location.href).href;
         let o_img_in_dom = a_o_img_existing_in_dom.find(o=>o.src == s_url_absolute);
         if(o_img_in_dom){
             o_img = o_img_in_dom;
         }else{
             o_el_container.appendChild(o_img)
         }
         
         o_img.style.position = `absolute`;
         o_img.style.width = `${o_img.o_data_img_gal.n_scl_x}px`
         o_img.style.height = `${o_img.o_data_img_gal.n_scl_y}px`
         o_img.style.left = `${o_img.o_data_img_gal.n_trn_x}px`
         o_img.style.top = `${o_img.o_data_img_gal.n_trn_y}px`
 
         let n_trn_y2 = o_img.o_data_img_gal.n_trn_y+o_img.o_data_img_gal.n_scl_y+n_px_margin_y;
         n_trn_y_max = Math.max(n_trn_y2, n_trn_y_max);
     }
 
     a_o_img.map(o=>{
         o.o_data_img_gal.n_scl_y_px_container = n_trn_y_max;
     })
 
     o_el_container.style.position = `relative`;
     
     o_el_container.style.height = `${n_trn_y_max}px`;
     // o_bounds = o_el_container?.getBoundingClientRect();
     n_scl_x_px_container = (o_bounds?.width) ? o_bounds?.width : 1000;
     let n_scl_y_px_container = (o_bounds?.width) ? o_bounds?.width : 1000;
     // let n_scl_y_px_container = (o_bounds?.width) ? o_bounds?.width : 1000;
     let n_ratio_y_x = n_scl_y_px_container/n_scl_x_px_container;
     o_el_container.style.height = `auto`
     o_el_container.style.aspectRatio = `1/${n_ratio_y_x}`;
     // o_bounds = o_el_container?.getBoundingClientRect();
     // n_scl_x_px_container = (o_bounds?.width) ? o_bounds?.width : 1000;
     // n_scl_y_px_container = (o_bounds?.width) ? o_bounds?.width : 1000;
     for(let o_img of a_o_img){
 
         // o_img.style.position = `absolute`;
         // o_img.style.aspectRatio = `${o_img.o_data_img_gal.n_scl_x/o_img.o_data_img_gal.n_scl_y}/1`
         o_img.style.width = `${(o_img.o_data_img_gal.n_scl_x/n_scl_x_px_container)*100}%`
         o_img.style.height = `${(o_img.o_data_img_gal.n_scl_y/n_scl_x_px_container)*100}%`
         o_img.style.left = `${(o_img.o_data_img_gal.n_trn_x/n_scl_x_px_container)*100}%`
         o_img.style.top = `${(o_img.o_data_img_gal.n_trn_y/n_scl_y_px_container)*100}%`
 
         let n_trn_y2 = o_img.o_data_img_gal.n_trn_y+o_img.o_data_img_gal.n_scl_y+n_px_margin_y;
         n_trn_y_max = Math.max(n_trn_y2, n_trn_y_max);
     }
     return a_o_img;
 
 }
 
 let o_state_a_o_toast = {
     a_o_toast: []
 };      
 let f_o_toast = function(
     s_message, 
     s_class = 'info', 
     n_ms = 5000
 ){
     let s_uuidv4 = f_s_uuidv4();
     let o_toast = {
         s_uuidv4, 
         s_class: `o_toast ${s_class}`,
         s_message_init: s_message, 
         s_message: s_message, 
         b_render: true,
         n_id_interval: 0,
     };
     o_state.a_o_toast.push(o_toast);
 
     let o = o_state.a_o_toast.find(o=>{return o.s_uuidv4 == s_uuidv4})
     o.f_hide = function(){
         o.b_render = false;
         clearInterval(o.n_id_interval);
         o_state.a_o_toast = o_state.a_o_toast.filter((o, n_idx)=>{
             let b = o.s_uuidv4 != s_uuidv4
             return b
         });
     }
     window.setTimeout(()=>{
         o.f_hide();
     },n_ms)
     
     if(s_class == 'loading'){
         o.n_id_interval = window.setInterval(()=>{
             let a_s_char_spinner = ['|', '/', '-', '\\'];
             a_s_char_spinner = ['â—´', 'â—·', 'â—¶', 'â—µ']
             a_s_char_spinner = ['â ‹','â ™','â ¹','â ¸','â ¼','â ´','â ¦','â §','â ‡','â ']
             let n = (parseInt(window.performance.now()*0.007)%a_s_char_spinner.length);
             o.s_message = `${o.s_message_init} ${a_s_char_spinner[n]}`
         }, 100)
     }
     return o
 }
 let s_css_a_o_toast = `
 .a_o_toast {
     position:fixed;
     top: 1rem;
     right: 1rem;
     left: auto;
     width: auto;
     max-width: 90%;
     z-index: 9999;
     display: flex;
     flex-direction: column;
     gap: 0.5rem;
     pointer-events: none;
 }
 
 .o_toast {
     padding: 0.75rem 1.25rem;
     border-radius: 0.5rem;
     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
     font-size: 0.95rem;
     pointer-events: all;
     animation: fadeSlideIn 0.3s ease-out;
 }
 
 .o_toast{
     padding: .5rem;
 }
 .o_toast.info, .o_toast.loading{
     background:rgba(103, 111, 218, 0.6);
     color: #fff;
 }
 .o_toast.warning{
     background:rgba(235, 140, 62, 0.6);
     color: #fff;
 }
 .o_toast.error{
     background:rgba(218, 103, 111, 0.6);
     color: #fff;
 }`
 let f_o_js_a_o_toast = function(o_state){
     let o_js_a_o_toast = {
         f_a_o:async ()=> [
             {
                 innerText: "name is: staticaddedperson"
             },
             {
                 a_s_prop_sync: 'a_o_toast',
                 class: 'a_o_toast',
                 f_a_o: ()=>{
                     return o_state.a_o_toast.map((o, n_idx)=>{
                         
                         // console.log(sp)
                         return {
                             class: o.s_class, 
                             f_s_innerText: ()=>{return o.s_message},
                             f_b_render: ()=>{return o.b_render},
                             onclick: ()=>{
                                 o_state.a_o_toast = o_state.a_o_toast.filter((o2, n_idx2)=>{
                                     return n_idx != n_idx2
                                 })
                             },
                             a_s_prop_sync: [
                                 `a_o_toast.${n_idx}.s_message`,
                             ],
                         }
                     })
                 }
             },
     
         ],
         a_s_prop_sync: 'a_s_name',
     }
     return o_js_a_o_toast
 }
 
 
export {
    f_o_html_from_o_js,
   f_o_proxified_and_add_listeners,
   f_s_random_uuid__with_unsecure_fallback,
   f_s_random_uuid_unsecure, 
   f_o_mod__notifire, 
   f_o_mod__image_gallery,
   f_o_img_cached,
   f_a_o_img__gallery_from_a_s_url_and_resize_images_and_container, 
   o_state_a_o_toast,
   f_o_toast,
   s_css_a_o_toast,
   f_o_js_a_o_toast,
}

