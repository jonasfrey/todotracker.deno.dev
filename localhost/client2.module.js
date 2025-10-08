
import {
    f_add_css,
    f_s_css_prefixed,
    o_variables, 
    f_s_css_from_o_variables
} from "https://deno.land/x/f_add_css@2.0.0/mod.js"

import {
    f_o_html_from_o_js,
} from "https://deno.land/x/handyhelpers@5.4.2/mod.js"


import { createApp, ref, onUpdated, reactive} from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

let s_fs = '/';
import {
    f_a_s_part_from_s_path,
    f_b_img_file,
    f_b_video_file,
    f_o_thumbnail
} from "./functions.module.js"
let s_css = await fetch('./main.css');
s_css = await s_css.text();
f_add_css(
    s_css
);

import {
    f_o_folderinfo,
    f_o_toast
 } from "./functions.module.js";
import { readableTextColor } from "./color.js";

let f_o_persistantdata = function(
    a_s_path_filteredhistory,
    a_o_filemeta, 
    a_o_tag,
){
    return  {
        a_s_path_filteredhistory,
        a_o_filemeta, 
        a_o_tag,
    }
}
let f_o_timestamp = function(
    n_ms, 
    a_n_id_tag, 
    b_closest = false,
){
    return {
        n_ms,
        a_n_id_tag,
        b_closest
    }
}
let f_o_timestampsection_video = function(
    n_ms_start, 
    n_ms_end,
){
    return {
        n_ms_start, 
        n_ms_end
    }
}
let f_o_tag = function(
    n_id,
    n_idx,
    s_name, 
    s_shortcut, 
    s_color, 
    b_filter = false

){
    return {
        n_id,
        n_idx,
        s_name, 
        s_shortcut, 
        s_color, 
        b_filter
    }
}
let f_o_file = function(
    {
        a_s_name, 
        a_n_id_tag,
    }
){
    return { 
        a_s_name,
        a_n_id_tag
    }
}
let f_o_filemeta = function(
    s_path_file_abs, 
    a_n_id_tag
){
    return {
        s_path_file_abs, 
        a_n_id_tag
    }
}

let a_o_tag_default = [
        f_o_tag(1, 0, 'greenery', 'a', '#00ff00'),
        f_o_tag(2, 1, 'red', 's', '#ff0000'),
        f_o_tag(3, 2, 'water', 'd', '#0000ff')
    ]

let o_persistantdata_default = f_o_persistantdata(
    [], 
    [], 
    a_o_tag_default
);
let f_o_meta = function(){
    return {

    }
}
let o_state = reactive({
    o_persistantdata: o_persistantdata_default,
    b_filter_timestampsection: false,
    o_tag: null,
    a_o_file: [],
    a_o_file_filtered: [],
    a_o_file_thumbnail: [],
    o_file: null,
    n_idx_file: 0, 
    o_timestampsection_video: null,
    o_filemeta: null,
    //overlays
    b_show_settings: false,
    b_show_manipulate_filtered_files: false,
    b_show_searchstring: false,
    s_shortcut_help: '',
    s_shortcut_timestamp: 't', 
    s_path_file_current: '',
    o_folderinfo: null,
    o_folderinfo_prev: null,
    s_path_meta_json : `.gitignored.yaib.o_persistantdata.6d10f80a-7248-4e26-8de6-0513ce36a856.1.json`,
    s_loadingstate_info: '',    
    b_select_folder_overlay: false,
    n_id_timeout_saving: null,
    a_o_toast: [],
    b_playing: false,
    n_id_interval_playing: null,
    n_ms_video: 0,
    n_ms_video_readvalue: 0,
    o_timestamp_closest: null,
    s_path_abs_copy_or_move_to: '',
    s_searchstring: '',
    n_id_timeout_search: null,
    n_ms_timeout_search: 200,
}) 

globalThis.o_state = o_state


let f_s_style = function(o_style){
    let s_style = `{${Object.keys(o_style).map(s=>{
        return `${s}: \`${o_style[s]}\``
    })}}`;
    return s_style;
}


let o = await f_o_html_from_o_js(
    {
        id: "app",
        // "v-on:pointerdown": "f_pointerdown",
        // "v-on:pointerup": "f_pointerup",
        // "v-on:pointermove": "f_pointermove",
        "v-on:keyup": "f_keyup",
        a_o: [
            {
                id: "toast_container",
                a_o: [
                    {
                        s_tag: "div",
                        'v-for': 'o_toast of a_o_toast',
                        ":class": "`toast ${o_toast.s_class}`",
                        innerText: "{{o_toast.s_message}}",
                    }
                ]
            },
            {
                class: "posabs flex_row",
                style: 'z-index:32', 
                a_o: [
                    {
                        id: "loadingstate", 
                        style: "width: 100%;background-color: rgba(0,0,0,0.8); color: white; padding: 0.5rem 1rem; border-radius: 0.5rem;",
                        'v-if': "s_loadingstate_info != ''",
                        innerText: "{{s_loadingstate_info}}",
                    },

                    {
                        a_o: [
                            {
                                s_tag: 'button',
                                innerText: '📂',
                                'v-on:click':"b_select_folder_overlay = true;", 
                            }, 
                        ]
                    },
                    {
                        a_o: [
                            {
                                s_tag: 'button',
                                //icon that symoblizes that the files that are in the filtered list can be edited or manipulated
                                innerText: '🛠️',
                                'v-on:click':"b_show_manipulate_filtered_files = true;",//move or copy the filtered files 
                            }, 
                        ]
                    },
                    {
                        class: "overlay select_folder",
                        'v-if': "b_show_manipulate_filtered_files",
                        a_o: [
                            {
                                s_tag: "input", 
                                "v-model": "s_path_abs_copy_or_move_to"
                            },
                            {
                                s_tag: "button",
                                innerText: "Copy files to folder",
                                'v-on:click': `f_move_or_copy_files_to_folder(false);b_show_manipulate_filtered_files = false;`,
                            }
                        ]
                    },
                    {
                        class: "overlay select_folder",
                        'v-if': "b_select_folder_overlay",  
                        a_o: [
                            {
                                'v-on:click': "b_select_folder_overlay = false;f_load_files();",
                                s_tag: "button",
                                innerText: "Load files"
                            },
                            {
                                'v-on:click': "b_select_folder_overlay = false;f_load_files_recursive();",
                                s_tag: "button",
                                innerText: "Load files recursively"
                            },
                            {
                                class: 'flex_row path_navigation',
                                a_o: [
                                    // {
                                    //     s_tag: "button", 
                                    //     innerText: "⬅️",
                                    //     'v-on:click': 'f_update_o_folderinfo(o_folderinfo_prev.s_path_abs);',
                                    // },
                                    {
                                        s_tag: "span",
                                        "v-for": "(s_part, n_idx) in a_s_part_from_s_path",
                                        class: "flex_row",
                                        a_o: [
                                            {
                                                s_tag: "a",
                                                "v-on:click": "f_update_o_folderinfo_uptopart(n_idx)",
                                                // innerText: "{{o_folderinfo?.s_path_abs}}"
                                                innerText: "{{s_part}}"
                                            },
                                            {
                                                class: "ds",
                                                "v-if": "n_idx > 0",
                                                innerText: "/"
                                            }

                                        ]
                                    }
                                ]
                            },
 
                            {
                                s_tag: "span", 
                                innerText: "{{o_folderinfo?.a_o_entry_image?.length}} images | {{o_folderinfo?.a_o_entry_video?.length}} videos"
                            },
                            {
                                class: "folder_list flex_col",
                                a_o: [
                                    {
                                        'v-for': 'o_folder of f_a_o_entry_with_stat_sorted(o_folderinfo?.a_o_entry_folder)',
                                        s_tag: "a",
                                        href: "#",
                                        innerText: "📂{{o_folder.name}}",
                                        'v-on:click': 'f_update_o_folderinfo(o_folder.s_path_file);'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        s_tag: "button", 
                        'v-on:click': "b_show_settings = !b_show_settings;",
                        innerText: "⚙️",
                    },
                    {
                        s_tag: "button", 
                        'v-on:click': "f_export_video()",
                        innerText: "📤",
                    },
                    {
                        s_tag: "button", 
                        'v-on:click': "f_filter_timestampsection()",
                        innerText: "🔍",
                    },
                    {
                        s_tag: "button", 
                        'v-on:click': "b_show_searchstring = true;",
                        innerText: "🚰",
                    },
                    {
                        s_tag: "input", 
                        'v-if': 'b_show_searchstring',
                        "v-model": "s_searchstring", 
                    }
                    
                ]
            },
            {
                style: 'position:absolute;right: 0;',
                a_o: [
                    {
                        id: "file_info", 
                        a_o: [
                            {
                                s_tag: "span", 
                                innerText: '{{o_file?.name}} | {{n_idx_file+1}}/{{a_o_file_filtered?.length}}',
                            }
                        ]
                    },
                    {
                        class: "tag flex_row", 
                        'v-for': 'o_tag2 in o_persistantdata.a_o_tag',
                        a_o: [
                            {
                                s_tag: "span", 
                                innerText: '🔍',
                                ":style": `(o_tag2.b_filter) ? 'opacity: 1;' : 'opacity: 0.3;'`,
                                'v-on:click': `f_update_tag_filter(o_tag2)`,
                            },
                            {
                                s_tag: "span", 
                                ":style": f_s_style({
                                    display: 'inline-block',
                                    padding: '0.2rem 0.5rem',
                                    backgroundColor: '${o_tag2.s_color}',
                                    font: 'readableTextColor(o_tag2.s_color)',
                                    opacity: '${o_filemeta?.a_n_id_tag.includes(o_tag2.n_id) ? 1 : 0.3}',
                                }), 
                                innerText: '{{o_tag2.s_name}}({{o_tag2.s_shortcut}})',
                            }
                        ]
                    },
                ]
            },
            {
                id: "settings",
                'v-if': "b_show_settings",
                a_o: [
                    {
                        s_tag: "label", 
                        innerText: 'Tags'
                    }, 
                    {
                        'v-for': 'o_tag2 in o_meta.a_o_tag',
                        a_o: [
                            {
                                s_tag: "input", 
                                type: "text", 
                                "v-model": "o_tag2.s_name",
                            }, 
                            {
                                s_tag: "input", 
                                type: "button",
                                "v-model": "o_tag2.s_shortcut",
                                placeholder: 'Shortcut',
                                'v-on:click':'s_shortcut_help = `Enter Key(combination) for ${o_tag2.s_name}`;o_tag = o_tag2;',
                            }, 
                            {
                                s_tag: 'input', 
                                type: "color",
                                "v-model": "o_tag2.s_color",
                            }, 
                            {
                                s_tag: "button", 
                                innerText: "🗑️",
                                'v-on:click': `o_meta.a_o_tag.splice(o_meta.a_o_tag.indexOf(o_tag2), 1);`,
                            }
                        ]
                    }, 
                    {
                        s_tag: "label", 
                        innerText: "timestamp shortcut:"
                    },
                    {
                        s_tag: "input", 
                        type: "button",
                        "v-model": "s_shortcut_timestamp",
                        placeholder: 'Shortcut',
                        'v-on:click': 's_shortcut_help = `Enter Key(combination) for timestamp`'
                    }, 
                    {
                        class: "shortcut_help",
                        'v-if': "s_shortcut_help !== ''",
                        a_o: [
                            {
                                s_tag: "p",
                                innerText: "{{s_shortcut_help}}"
                            }
                        ]
                    },
                    {
                        s_tag: 'button', 
                        class: 'w100',
                        'innerText': '+ Add tag',
                        'v-on:click': `f_add_tag()`,
                    }
                ]
            },
            {
                class: "file_container", 

                a_o: [
                    {
                        s_tag: "img", 
                        "v-if": "o_file && f_b_img_file(o_file.s_path_file)",
                        ":src": "s_path_file_current",
                    },
                    {
                        class: "thumbnails", 
                        a_o: [
                            {
                                s_tag: "div",
                                class: "thumbnail", 
                                // 5 thumbnails in a row 
                                'v-for': 'o_file2 of a_o_file_thumbnail',
                                ':style': "{ backgroundImage: `url(${o_file2?.o_filemeta?.s_dataurl_thumbnail})` }"
                            },
                        ]
                    },
                    
                    {
                        "v-if": "o_file && f_b_video_file(o_file.s_path_file)",
                        class: "pos_abs_100_100 video_container",
                        a_o: [
                            {
                                s_tag: "video", 
                                // 'controls': "true",
                                "preload" : "auto",
                                ":src": "s_path_file_current",
                            }, 
                            {
                                class: "video_controls",
                                "v-if": "o_video != null",
                                a_o: [
                                    {
                                        class: "w100", 
                                        a_o: [
                                            {
                                                s_tag: 'button', 
                                                innerText: '{{(b_playing == false) ? "Play" : "Pause"}}', 
                                                'v-on:click': `f_toggle_play_pause()`,
                                            },
                                            {
                                                s_tag: 'button', 
                                                innerText: '<<3', 
                                                'v-on:click': `f_add_current_time_ms(-3333)`,
                                            },
                                            {
                                                s_tag: 'button', 
                                                innerText: '3>>', 
                                                'v-on:click': `f_add_current_time_ms(3333)`,
                                            },
                                        ]
                                    },
                                    {
                                        class: "w100 o_progress_bar",
                                        a_o: [
                                            
                                            {
                                                class: "o_progress_bar_fill",
                                                ":style": 'f_style_progress_bar_fill()'
                                            }, 
                                            {
                                                "v-if": "o_file && f_b_video_file(o_file.s_path_file)",
                                                class: "posabs w100",
                                                style: 'height: 50%',
                                                a_o: [
                                                    {
                                                        class: "o_timestampsection_video posabs",
                                                        "v-for": 'o_timestampsection_video of a_o_timestampsection_video',
                                                        ":style": `f_s_css_from_o_timestampsection_video(o_timestampsection_video)`, 
                                                        "a_o": [
                                                            {
                                                                // a_o: [
                                                                //     {
                                                                //         "v-for": "n_id_tag of o_timestampsection_video.a_n_id_tag",
                                                                //         ":style": '`background: ${a_o_tag.find(o=>{return o.n_id == n_id_tag}).s_color}`',
                                                                //     }
                                                                // ]
                                                            }
                                                        
                                                        ]
                                                    },
                                                    {
                                                        class: "o_timestampsection_video posabs",
                                                        "v-for": 'o_timestamp of o_filemeta.a_o_timestamp',
                                                        ":style": `f_s_css_from_o_timestamp(o_timestamp)`, 
                                                    }
                                                ]
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }, 
    o_state
)

window.onmouseup = function(o_event){
    if(o_event.button == 0){o_state.b_pointer_down_left = false;} 
    if(o_event.button == 1){o_state.b_pointer_down_middle = false;} 
    if(o_event.button == 2){o_state.b_pointer_down_right = false;} 
}
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
            o_self.o_video = null;
            


            // Add window event listeners
            // window.addEventListener('pointerdown', this.f_pointerdown);
            document.addEventListener('pointerup', this.f_pointerup);
            // window.addEventListener('pointermove', this.f_pointermove);
            document.addEventListener('keyup', this.f_keyup);
            document.addEventListener('keydown', this.f_keydown);

            // window keydown event is not triggered when video elemetn is in focus (after there was a seek event)

            
            await o_self.$nextTick(); 

            o_self.f_update_o_folderinfo('/');
            // console.log(o_folderinfo__populated);

            let o_resp = await this.f_o_server_response(
                '/readtextfile',
                {
                    s_path_abs: o_self.s_path_meta_json
                },
                null
            );
            if(
                o_resp?.o_server_error?.s != ''
            ){ 
                // error specific things
            }else{
                o_self.o_persistantdata = JSON.parse(o_resp.o_meta.s_text);
            }
            for(let s of o_self.o_persistantdata.a_s_path_filteredhistory){
                if(s == null){continue;}
            }
            // we cannot simply filtter out duplicated entries since they can appear twice in the history
            // o_self.o_persistantdata.a_s_path_filteredhistory = Array.from(new Set(o_self.o_persistantdata.a_s_path_filteredhistory));


            
            for(let s_path of o_self.o_persistantdata.a_s_path_filteredhistory.reverse()){
                // find the last visited and available folder
                let b_nosuchfolder_or_no_permission = await o_self.f_update_o_folderinfo(s_path);
                if(!b_nosuchfolder_or_no_permission){
                    break;
                }
            }
            
            o_self.n_id_interval_playing = setInterval(function(){
                if(o_self.o_video!=null){
                    o_self.n_ms_video_readvalue = o_self.o_video.currentTime * 1000;
                }
                o_self.o_timestamp_closest = o_self.f_o_timestamp_closest();
                if(o_self.o_timestamp_closest){
                    o_self.o_timestamp_closest.b_closest = true;
                }
                // o_self.n_ms_video = o_self.o_video.currentTime * 1000;
            }, 111);

    },
    beforeUnmount() {
        // Clean up event listeners when component is destroyed
        window.removeEventListener('pointerdown', this.f_pointerdown);
        window.removeEventListener('pointerup', this.f_pointerup);
        window.removeEventListener('pointermove', this.f_pointermove);
    },
  methods: {
    f_move_or_copy_files_to_folder: async function(b_move){
        let o_self = this;
        let s_path_abs_copy_or_move_to = o_self.s_path_abs_copy_or_move_to.trim();
        let o_resp = await this.f_o_server_response(
            '/moveorcopyfilestofolder',
            {
                b_move, 
                a_s_path_file: o_self.a_o_file_filtered.map(o=>{
                    return o.o_filemeta.s_path_file_abs;
                }), 
                s_path_abs_copy_or_move_to
            },
            null
        );
        if(
            o_resp?.o_server_error?.s.toLowerCase().includes('any specific error')
        ){ 
            // error specific things
        }else{
            console.log(o_resp)
        }
    },
    f_a_o_entry_with_stat_sorted: function(a_o){
        if(Array.isArray(a_o) == false){return [];}
        return a_o.sort((o1,o2)=>{
            return o2?.o_stat?.n_ts_ms_mod - o1?.o_stat?.n_ts_ms_mod
        }) || [];
    },
    f_a_s_part_from_s_path: f_a_s_part_from_s_path,
    f_filter_timestampsection: function(){
        let o_self = this;
        o_self.b_filter_timestampsection = !o_self.b_filter_timestampsection;
        o_self.f_update_a_o_file_filtered();

    },
    f_o_timestamp_closest: function(){
        let ndelta1 = 0;
        let o_self = this;
        let o_filemeta = o_self.o_filemeta;
        if(o_filemeta?.a_o_timestamp == undefined || o_filemeta?.a_o_timestamp.length == 0 || o_filemeta?.a_o_timestamp == null){
            return null;
        }
        let o_timestamp_closest = o_filemeta.a_o_timestamp.sort((o1,o2)=>{
            o1.b_closest = false;
            return Math.abs(o1.n_ms - o_self.n_ms_video) - Math.abs(o2.n_ms - o_self.n_ms_video_readvalue);
        })?.at(0);
        return o_timestamp_closest;
    },
    f_add_current_time_ms: function(n_ms){
        let o_self =this;
        o_self.n_ms_video = Math.min(o_self.o_video.duration*1000, Math.max(0,(o_self.n_ms_video + n_ms)));
    },
    f_export_video: async function(){
        let o_self = this;
        if(o_self.o_video != null){
            let o_resp = await this.f_o_server_response(
                '/exportvideo',
                o_self.o_filemeta,
                null
            );
            if(
                o_resp?.o_server_error?.s.toLowerCase().includes('any specific error')
            ){ 
                // error specific things
            }else{
                console.log(o_resp)
            }
        }
    },
    f_style_progress_bar_fill: function(){
        let o_self = this;
        return {
            width: `${(o_self.n_ms_video_readvalue/(o_self.o_video.duration * 1000))*100}%`
        }
    },
    f_s_readable_foreground_text_color: function(s_color_hex){
        // if the color is a bright, we need a dark font , if it is dark we need a bright font
        readableTextColor(s_color_hex);
    },
    f_toggle_play_pause: function(){
        let o_self = this;
        if(o_self.b_playing == true){
            o_self.o_video.pause();
            o_self.b_playing = false;
        }else{
            o_self.o_video.play();
            o_self.b_playing = true;
        }
    },
    f_s_css_from_o_timestamp: function(o_timestamp){
        let o_self = this;
        //'`background: ${o_timestamp.o_tag.s_color};left: ${((o_timestamp.n_ms/1000)/o_video.duration)*100}%`', 
        let s_width = "2px";

        let n_opacity = 0.2;
        if(o_timestamp.b_closest){
            n_opacity = 1.0;
        }
        let s =  [
            // `backgro/und: ${o_timestamp.o_tag.s_color}`,
            `left: ${((o_timestamp.n_ms/1000)/o_self.o_video.duration)*100}%`, 
            `width: ${s_width}`, 
            `height:100%`, 
            `background: rgba(6, 224, 24, ${n_opacity})`,
            `border: 1px solid rgba(17, 0, 255, ${n_opacity})`,
        ].join(';')
        return s
    },
    f_s_css_from_o_timestampsection_video: function(o_timestampsection_video){
        let o_self = this;
        //'`background: ${o_timestampsection_video.o_tag.s_color};left: ${((o_timestampsection_video.n_ms/1000)/o_video.duration)*100}%`', 
        let s_width = "10px";
        if(o_timestampsection_video.n_ms_end > o_timestampsection_video.n_ms_start) {
            s_width = `${((o_timestampsection_video.n_ms_end/1000)/o_self.o_video.duration)*100 - ((o_timestampsection_video.n_ms_start/1000)/o_self.o_video.duration)*100}%`;
        }
        let s =  [
            // `backgro/und: ${o_timestampsection_video.o_tag.s_color}`,
            `left: ${((o_timestampsection_video.n_ms_start/1000)/o_self.o_video.duration)*100}%`, 
            `width: ${s_width}`, 
            `height:100%`, 
            `background: rgba(255,0,0,0.5)`,
            `border: 1px solid rgba(255,255,0,0.5)`,
        ].join(';')

        return s
    },
    f_b_img_file: function(s_path_file){
        return f_b_img_file(s_path_file);
    },
    f_b_video_file: function(s_path_file){
        return f_b_video_file(s_path_file);
    },
    f_load_files_recursive: async function(){
        let o_self = this;
        await this.f_update_o_folderinfo(o_self.o_folderinfo.s_path_abs, true);
        await this.f_load_files();
    },
    f_load_files: async function(){
        //check if json with metadata exists in folder
        
        let o_self = this;

        await o_self.$nextTick();

        o_self.a_o_file = o_self.o_folderinfo.a_o_entry_image.concat(o_self.o_folderinfo.a_o_entry_video);
        o_self.a_o_file_filtered = o_self.a_o_file;
        o_self.f_next_file();
        o_self.o_persistantdata.a_s_path_filteredhistory.push(
            o_self.o_folderinfo.s_path_abs
        )
        o_self.f_try_to_save();

    },
    f_update_o_folderinfo_uptopart: async function(n_idx){
        
        let o_self = this;

        let s_path_abs = o_self.a_s_part_from_s_path.slice(0,n_idx+1).join(s_fs);
        
        return o_self.f_update_o_folderinfo(s_path_abs);

    },
    f_update_o_folderinfo: async function(s_path_abs, b_recursive = false){
        let o_self = this;
        o_self.o_folderinfo_prev = o_self.o_folderinfo;
        o_self.o_folderinfo = f_o_folderinfo(
            s_path_abs,
        );
        o_self.o_folderinfo.b_recursive = b_recursive;
        let o = await o_self.f_o_server_response(
            '/folderinfo',
            o_self.o_folderinfo
        );
        if(o?.o_server_error.s != ''){
            //cannot find folder or no permission...
            return true;
        }
        let o_folderinfo__populated =  o?.o_meta;
        o_self.o_folderinfo = o_folderinfo__populated;
    },
    f_try_to_save: function(){
        let o_self = this;
        clearTimeout(o_self.n_id_timeout_saving);
        o_self.n_id_timeout_saving = setTimeout(async function(){
            o_self.f_o_server_response('/writetextfile',
                {
                    s_path_abs: o_self.s_path_meta_json,
                    s_text: JSON.stringify(o_self.o_persistantdata, null, 4)
                }
            )
            
        }, 1000)
    },
    f_next_timestamp: function(){

    },
    f_prev_timestamp: function(){

    },
    f_update_thumbnails: async function(){
        let o_self = this;
        await o_self.$nextTick();
        // update thumbnails 
        let n_idx_file = o_self.a_o_file_filtered.indexOf(o_self.o_file);
        if(n_idx_file == -1){
            return [];
        }
        let n_images = 10;
        o_self.a_o_file_thumbnail = o_self.a_o_file_filtered.slice(n_idx_file-parseInt(n_images/2), n_idx_file+parseInt(n_images/2));    
        
    },
    f_next_file: function(){
        this.f_nextprev_file(+1);
    },
    f_prev_file: function(){
        this.f_nextprev_file(-1);
    },
    f_nextprev_file: function(n_direction){
        let o_self = this;
        let n_idx_new = (o_self.a_o_file_filtered.indexOf(o_self.o_file) + n_direction)% o_self.a_o_file_filtered.length;
        if(n_idx_new <0){
            n_idx_new += o_self.a_o_file_filtered.length;
        }

        let o = o_self.a_o_file_filtered[n_idx_new];
        o_self.o_file = o;   
        o_self.f_update_thumbnails();

    },
    f_prev_file_next_not_starting_with_same_name: function(){
        return this.f_nexprev_file_next_not_starting_with_same_name(-1);
    },
    f_next_file_next_not_starting_with_same_name: function(){
        return this.f_nexprev_file_next_not_starting_with_same_name(+1);
    },
    f_nexprev_file_next_not_starting_with_same_name: function(n_direction){
        let o_self = this;
        
        let b_starts_with_same_characters = true;
        let n = 0;
        let o = null;
        while(b_starts_with_same_characters){
            n+=n_direction;
            let n_idx_new = (o_self.a_o_file_filtered.indexOf(o_self.o_file) + n)% o_self.a_o_file_filtered.length;
            if(n_idx_new <0){
                n_idx_new += o_self.a_o_file_filtered.length;
            }
            
            o = o_self.a_o_file_filtered[n_idx_new];
            b_starts_with_same_characters = o.name.substring(0,3)  == o_self.o_file.name.substring(0,3);

            if(n > 3000){ //safety break
                break;
            }
        }
        o_self.o_file = o;
        o_self.f_update_thumbnails();
    },

    f_s_path_from_o_file: function(o_file){
        return `filerequest${o_file?.s_path_file}`;
    },
    f_pointerup: function(o_event){
        let o_self = this;
        o_self.b_show_shortcut_help = false;

        //if click is outside #settings div
        let o_settings = document.getElementById('settings');
        if(o_settings && !o_settings.contains(o_event.target)){     
            o_self.b_show_settings = false;
        }
        let n_x_nor = o_event.clientX/window.innerWidth;


        if (o_event.target.closest('.o_progress_bar')) {
            o_self.n_ms_video = n_x_nor * o_self.o_video.duration * 1000;
        }
    },
    f_update_a_o_file_filtered: function(){
        let o_self = this;
        let a_n_id_tag_filter = o_self.o_persistantdata.a_o_tag.filter(o=>o.b_filter).map(o=>o.n_id);
        let a_o = o_self.a_o_file.filter(o_file=>{

            const b_matches_tag_filter = o_self.f_o_file_matches_tags(o_file, a_n_id_tag_filter);
            // console.log({b_has_image_ending, b_matches_tag_filter})
            let b_timestampsection = true;
            if(o_self.b_filter_timestampsection){
                b_timestampsection = 
                    o_file.o_filemeta.a_o_timestampsection_video?.length == 0 || o_file.o_filemeta.a_o_timestampsection_video == undefined;
            }
            let b_matches_name = true;
            if(o_self.s_searchstring != ''){
                b_matches_name = o_file.name.includes(o_self.s_searchstring)
            }

            return b_matches_tag_filter && b_timestampsection && b_matches_name;
        })
        
        // console.log(a_n_id_tag_filter)
        if(!o_self.o_file){
            o_self.o_file = a_o[0];
        }
        if(!o_self.f_o_file_matches_tags(o_self.o_file, a_n_id_tag_filter)){
            o_self.o_file = a_o[0];
            
        }
        o_self.a_o_file_filtered = a_o;



    },
    f_o_file_matches_tags: function(o_file, a_n_id_tag_filter){
        if(a_n_id_tag_filter.length === 0){return true;}
        return o_file?.o_filemeta?.a_n_id_tag.some(n_id => a_n_id_tag_filter.includes(n_id));
    },
    f_update_tag_filter: function(o_tag2){
        o_tag2.b_filter = !o_tag2.b_filter;
        // check if current o_file is still in filtered list
        let o_self = this;
        o_self.a_o_tag = o_self.a_o_tag; 
        o_self.f_update_a_o_file_filtered();
    },
    f_o_server_response : async function(
        s_path,
        o_request_data = {}, 
        f_error_handler = null
    ){
        let o_resp = await fetch(s_path, {
            method: o_request_data ? 'POST' : 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(o_request_data)
        });
        let o_data = await o_resp.json();
        if(o_data?.o_server_error?.s != ''){

            console.error(`fetchresperror: ${o_data.o_server_error.s}`);
            console.error(`fetchresperror: ${o_data.o_server_error.n}`);

        }

        return o_data;
    },


    f_add_tag: function(){
        let o_self = this;
        let n_id_tag_hightest = o_self.o_persistantdata.a_o_tag.reduce((n_acc, o_tag)=>{
            return Math.max(n_acc, o_tag.n_id);
        }, 0);
        let o_tag = f_o_tag(
            n_id_tag_hightest+1, 
            o_self.o_persistantdata.a_o_tag.length, 
            'new tag',
            '',
            '#ff0000'
        )
        o_self.o_persistantdata.a_o_tag.push(o_tag);
    },

    f_keydown: function(o_event){
        // if right arrow key
        if(o_event.key === "ArrowRight"){
            o_self.f_next_file();

        }
        //if left arrow key
        if(o_event.key === "ArrowLeft"){
            o_self.f_prev_file();
        }

        if(o_event.key === "j"){
            o_self.f_prev_file_next_not_starting_with_same_name();
        }
        if(o_event.key === "l"){
            o_self.f_next_file_next_not_starting_with_same_name();
        }
    },
    f_keyup: function(o_event){
        let o_self = this;
        let o_filemeta = o_self.o_filemeta;

        // // if right arrow key
        // if(o_event.key === "ArrowRight"){
        //     o_self.f_next_file();

        // }
        // //if left arrow key
        // if(o_event.key === "ArrowLeft"){
        //     o_self.f_prev_file();
        // }
        //escape key
        if(o_event.key === "Escape"){
            o_self.s_shortcut_help = '';
            o_self.b_show_settings = false;
            o_self.b_show_manipulate_filtered_files = false;
        }
        if(o_self.b_show_shortcut_help){
            let o_tag = o_self.o_tag;
            if(!o_tag){return;}
            let s_key = o_event.key.toLowerCase();
            if(o_event.ctrlKey){s_key = 'ctrl+' + s_key;}
            if(o_event.shiftKey){s_key = 'shift+' + s_key;}
            if(o_event.altKey){s_key = 'alt+' + s_key;}
            o_tag.s_shortcut = s_key;
            o_self.s_shortcut_help = '';
        }
        if(o_self.s_shortcut_help == '' && !o_self.b_show_settings){
            //check if key matches any tag shortcut
            let o_tag = o_self.o_persistantdata.a_o_tag.find(o=>{
                return o.s_shortcut.toLowerCase() == (o_event.ctrlKey ? 'ctrl+' : '') + (o_event.shiftKey ? 'shift+' : '') + (o_event.altKey ? 'alt+' : '') + o_event.key.toLowerCase();
            })
            if(o_tag){
                //add tag
                if(o_self.f_b_img_file(o_filemeta.s_path_file_abs)){
                    if(!o_filemeta.a_n_id_tag.includes(o_tag.n_id)){
                        o_filemeta.a_n_id_tag.push(o_tag.n_id);
                    }else{
                        o_filemeta.a_n_id_tag = o_filemeta.a_n_id_tag.filter(n_id=>{n_id != o_tag.n_id})
                    }
                }
                // if video file, check if current time is inside of two timestamps, if so 
                // add the tag to the timestamp
                o_self.f_try_to_save();

            }
            
        }
        if(o_event.key == " "){
            // Spacebar pressed
            if(o_self.o_video && o_self.f_b_video_file(o_filemeta.s_path_file_abs)){
                o_self.o_video.paused ? o_self.o_video.play() : o_self.o_video.pause();
            }
        }
        if(o_event.key === "t"){
            // keydown event not triggered when video is in focus
         
            // add timestamp
            if(o_self.o_video && o_self.f_b_video_file(o_filemeta.s_path_file_abs)){
                if(o_filemeta.a_o_timestamp == undefined){
                    o_filemeta.a_o_timestamp = [];
                }
                o_filemeta.a_o_timestamp.push(
                    f_o_timestamp(
                        o_self.n_ms_video_readvalue,
                        []
                    )
                );             
            }
            o_self.f_try_to_save();

        }
        if(o_event.key === "r"){
            // keydown event not triggered when video is in focus
         
            let o_timestamp_closest = o_self.f_o_timestamp_closest();
            if(o_timestamp_closest){
                let n_idx = o_filemeta.a_o_timestamp.indexOf(o_timestamp_closest);
                o_self.o_filemeta.a_o_timestamp.splice(n_idx, 1);
            }

            o_self.f_try_to_save();

        }
        if(o_event.key === "Escape"){
            o_self.b_select_folder_overlay = false;
            o_self.b_show_settings = false;
        }

    },

    f_o_and_handle_server_response: async function(o_resp){
        let o_data = await o_resp.json();
        if(o_data?.o_error?.s != ''){
            console.error(o_data.o_error.s);
        }
        return o_data;
    },

    },
    computed: {

        'a_o_timestampsection_video': function(){
            let o_self = this;
            if( o_self.o_filemeta?.a_o_timestamp == undefined){
                return []
            }
            //sort timestamps by n_ms
            o_self.o_filemeta.a_o_timestamp = o_self.o_filemeta.a_o_timestamp.sort((o1,o2)=>{
                return o1.n_ms - o2.n_ms;
            });
            let a_o = [];
            //group all timestamps by two 
            for(let n_idx = 0; n_idx < o_self.o_filemeta.a_o_timestamp.length; n_idx+=2){
                let n_ms1 = o_self.o_filemeta.a_o_timestamp[n_idx]?.n_ms;
                let n_ms2 = o_self.o_filemeta.a_o_timestamp?.[n_idx+1]?.n_ms;
                if(n_ms2 == undefined){
                    break;
                }
                let o_timestampsection_video = f_o_timestampsection_video(
                    n_ms1,
                    n_ms2,
                );
                a_o.push(o_timestampsection_video);
            }
      
            o_self.o_filemeta.a_o_timestampsection_video = a_o
            
            return a_o
        },
        'a_s_part_from_s_path': function(){
            let o_self = this;
            return [
                '/',
                ...f_a_s_part_from_s_path(o_self.o_folderinfo?.s_path_abs)
            ]
        }
    },
    watch: {
        's_searchstring': function(){
            let o_self = this;
            clearTimeout(o_self.n_id_timeout_search);
            o_self.n_id_timeout_search = setTimeout(()=>{
                if(o_self.s_searchstring == ''){
                    o_self.b_show_searchstring = false;
                }
                o_self.f_update_a_o_file_filtered();
            }, o_self.n_ms_timeout_search)

        },
        'n_ms_video': function(){
            if(o_self?.o_video?.currentTime != undefined){
                o_self.o_video.currentTime = o_self.n_ms_video / 1000;
            }
        },
        'a_o_file': function(newVal, oldVal) {
            let o_self = this;
            
            console.log('a_o_file changed:', newVal);
            o_self.s_loadingstate_info = `Updating metadata for ${o_self.a_o_file.length} files...`
            for(let o of o_self.a_o_file){
                let o_filemeta = o_self.o_persistantdata.a_o_filemeta.find(o2=>o2.s_path_file_abs == o?.s_path_file);
                if(!o_filemeta){
                        o_filemeta = f_o_filemeta(
                            o?.s_path_file,
                            []
                        );
                }
                o.o_filemeta = o_filemeta;
                o_self.o_persistantdata.a_o_filemeta.push(o.o_filemeta);

            }
            o_self.s_loadingstate_info = ''
            o_self.f_update_a_o_file_filtered();
        }, 
        'o_file': function(newVal, oldVal) {
            let o_self = this;
            o_self.s_path_file_current = o_self.f_s_path_from_o_file(o_self.o_file);

            // add tag 
            o_self.o_filemeta = o_self.o_persistantdata.a_o_filemeta.find(o=>o.s_path_file_abs == o_self.o_file?.s_path_file);
            

            console.log('o_file changed:', newVal);
            let n_idx = o_self.a_o_file.indexOf(o_self.o_file);
            let n_load_before_and_after = 5;        
            // load images before and after
            for(let i = Math.max(0, n_idx - n_load_before_and_after); i <= Math.min(o_self.a_o_file.length - 1, n_idx + n_load_before_and_after); i++){
                let o_file = o_self.a_o_file_filtered[i];
                let img = new Image();
                img.src = o_self.f_s_path_from_o_file(o_file)
                img.onload = async function(){
                    let o_thumbnail = await f_o_thumbnail(img);
                    o_file.o_filemeta.s_dataurl_thumbnail = o_thumbnail.dataUrl;
                }
            }
            o_self.n_idx_file = o_self.a_o_file_filtered.indexOf(o_self.o_file);

            o_self.b_playing = false;

        },
        
        's_path_file_current': async function(){
            let o_self = this;
            if(o_self.f_b_video_file(o_self.s_path_file_current)){
                await o_self.$nextTick();
                await o_self.$forceUpdate();
                o_self.o_video = document.querySelector('video');
                this.b_playing = true; 
                this.o_video.play();
                await o_self.$nextTick();
                await o_self.$forceUpdate();
            }

        } 
    },
  data() {
    return o_state
  }
})


// Vue.directive('on-render', {
//     inserted(el, binding) {
//       binding.value(el)
//     }
//   })

// Handle both mouse and touch events



app.mount('#app')



