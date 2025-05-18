# todolist.deno.dev
# 🚀 Todolist-Tracker – Simple, Encrypted Todo Lists  

**🔗 Live Demo:** [https://todotracker.deno.dev/](https://todotracker.deno.dev/)  

A minimalist, privacy-focused todo list app built with:  
- **Deno** 🦕 (runtime)  
- **Deno KV** 💾 (database)  
- Custom frontend rendering  

No logins, no tracking—just **encrypted tasks** tied to a URL.  

## ✨ Features  

✅ **Instant Start**  
- Generates a new todo list on first visit (UUID in URL).  
- Return anytime with the same link.  

🔒 **End-to-End Encryption**  
- Tasks are encrypted—even the server can’t read them.  

🔄 **CRUD Made Simple**  
- Add, edit, delete, and check off tasks.  

⚡ **Blazing Fast**  
- Hosted on Deno Deploy (edge network).  

## 🛠️ How It Works  

1. **New User?**  
   - Visit the site, and a unique URL (with hash) is created.  
   - Your todo list is automatically saved (encrypted) in Deno KV.  

2. **Existing User?**  
   - Access your list via the same URL—no accounts needed.  

3. **Privacy First**  
   - Data is encrypted client-side before storage.  


## Buy me a coffee
If this app helped you out you can show your appreciation by buying me a coffee :)
![https://buymeacoffee.com/jonasimmanuelfrey](./localhost/bmc-button.png)
[https://buymeacoffee.com/jonasimmanuelfrey](https://buymeacoffee.com/jonasimmanuelfrey)


## Backup your data regularly
I do not have much time left to invest in this small side project so please backup your data regularly if it is important to you. 
Use the functionality settings-> export json. 

## Versions
There could be major version changes. If you like to stay on one version please maintain it yourself all source code data of every version is available in this gituhub repo. 
## 📜 License

MIT © JONAS IMMANUEL FREY

## Legal disclaimer 

Data Responsibility:
This app stores encrypted user data in Deno KV, but the developer:

    Cannot access, recover, or decrypt your tasks (encryption is client-side).

    Is not responsible for data loss, leaks, or misuse of shared URLs.

    Provides no warranties — use at your own risk.

By using this app, you agree that your data is your responsibility.


