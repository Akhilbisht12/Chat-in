const socket = io();
const userPanel = document.getElementById('userPanel');
const chatPanel = document.getElementById('chatPanel');
const chatForm = document.getElementById('chat-message');
const chatMessages = document.getElementById('chatMessages');
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

if(username){
    socket.emit("joinUser", {username, room});
}

socket.on('roomUsers', (users)=>{
    userPanel.innerHTML='';
    console.log(users)
    users.forEach(user => {
    var div = document.createElement('div');
    div.classList.add('list-group', 'rounded-0', 'p-2');
    div.innerHTML = `
     <a class="list-group-item list-group-item-action  text-black rounded-0">
        <div class="media">
        <img src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg" alt="user" width="50" class="rounded-circle">
            <div class="media-body ml-4">
                <div class="d-flex align-items-center justify-content-between mb-1">
                    <h5 class="mb-0">
                    ${user.username}
                    </h5>
                </div>
            </div>
        </div>  
    </a>`
    userPanel.appendChild(div)
    });
    const share = document.createElement('a');
    share.classList.add('btn','bg-dark', 'text-white', 'fixed-bottom');
    share.setAttribute("href", `whatsapp://send?text=Join Me On Chat-in. Room : ${users[0].room}
    <<https://upgrate-chat-in.herokuapp.com>>`);
    share.setAttribute('data-action', `share/whatsapp/share`);
    share.innerHTML=`Invite To Chat`
    userPanel.appendChild(share);
})

socket.on('welcome', (username)=>{
    const div = document.createElement('div');
    div.classList.add('media', 'w-100', 'ml-auto', 'mb-3');
    div.innerHTML = `
    <div class="media-body">
        <div class="bg-dark rounded py-2 px-3 mb-2">
            <p class="text-small mb-0 text-white">Hello! ${username}. Welcome to Chat-In. Chat-In is an demo chatting app developed by Upgrate.in,
            to customize it as per your requirements <a class'badge badge-success' href='https://www.upgrate.in/contact'>Click Here</a></p>
        </div>
    </div>
    `
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('userJoin', (username)=>{
    const div = document.createElement('div');
    div.classList.add('media', 'w-100', 'ml-auto', 'mb-3');
    div.innerHTML = `
    <div class="media-body text-center">
        <div class="bg-light rounded py-1 px-3 mb-2">
            <p class="text-small mb-0 text-muted">${username} Joined the Chat.</p>
        </div>
    </div>
    `
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('userLeft', (username)=>{
    const div = document.createElement('div');
    div.classList.add('media', 'w-100', 'ml-auto', 'mb-3');
    div.innerHTML = `
    <div class="media-body text-center">
        <div class="bg-light rounded py-1 px-3 mb-2">
            <p class="text-small mb-0 text-muted">${username} Left the Chat.</p>
        </div>
    </div>
    `
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})


socket.on('messageSelf', (message)=>{
    const div = document.createElement('div');
    div.classList.add('media', 'w-75', 'ml-auto', 'mb-3');
    div.innerHTML = `
    <div class="media-body">
        <div class="bg-primary rounded py-2 px-3 mb-2">
            <p class="text-small mb-0 text-white">${message.msg}</p>
        </div>
        <p class="small text-muted">${message.time}</p>
    </div>
    `
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('messageRest', (message)=>{
    const div = document.createElement('div');
    div.classList.add('media', 'w-75', 'mb-3');
    div.innerHTML = `
    <img src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg" alt="user" width="50" class="rounded-circle">
    <div class="media-body ml-3">
        <div class="bg-light rounded py-2 px-3 mb-2">
            <strong>${message.username}</strong>
            <p class="text-small mb-0 text-muted">${message.msg}</p>
        </div>
        <p class="small text-muted">${message.time}</p>
    </div>
    `
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', e=>{
    e.preventDefault();
    const msg = e.target.elements.messages.value;
    socket.emit('message', msg);
    e.target.elements.messages.value = '';
    e.target.elements.messages.focus();
})

const handleUserPanel = ()=>{
    userPanel.classList.toggle('d-none');
    chatPanel.classList.toggle('d-none');
}

