// here should be functions that really are only functions
// they take arguments do something and return something
// they should not depend on runtime data from the runtime scope
// for example
// do 
// let f_n_sum = function(n_1, n_2){
//     return n_1 + n_2
// }
// // don't 
// let n_base = 10
// let f_n_sum_dont = function(n_1){
//     return n_base + n_1
// }
// export {
//     f_n_sum
// }

 // Convert UUID string to ArrayBuffer
        let uuidToArrayBuffer = function(uuid) {
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

let f_s_hashed_sha256 = async function (s) {
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



let f_o_todoitem = function(
    s_text,
    n_ts_ms_created = Date.now(), 
    b_done_final = false,
    s_bg_color = 'rgba(0,0,0,1.0)',
    a_n_ts_ms_done = []
){

    return f_o_check_types_and_potentially_throw_error({
        s_uuid: crypto.randomUUID(),
        s_text, 
        n_ts_ms_created, 
        s_bg_color,
        a_n_ts_ms_done
    });

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
let f_a_o_error_type = function(
            o
        ){
            let o_self = this;
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

let f_s_error_from_s_prop_value =  function(s_prop, value) {
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
export {
    uuidToArrayBuffer,
    f_s_hashed_sha256,
    f_a_n_u8_encrypted_from_string,
    f_s_dectrypted_from_a_n_u8,
    f_o_todoitem
}