const o_kv = await Deno.openKv();

let a_s_path = ['a', 'c'];
let v = o_kv.get(a_s_path);
console.log({v});

await o_kv.set(a_s_path.slice(0,1), 'first value');


await o_kv.set(a_s_path, 'value text max 65535 characters');
v = await o_kv.get(a_s_path);
console.log({v});

let entries = await o_kv.list({prefix: 'a'});
for await (const entry of entries) {
    console.log(entry.key); // ["preferences", "ada"]
    console.log(entry.value); // { ... }
    console.log(entry.versionstamp); // "00000000000000010000"
}
let o_entr  = await o_kv.get(['a']);
console.log({o_entr});