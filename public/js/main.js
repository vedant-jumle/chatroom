const user_message_form = document.getElementById('form-message');
const socket = io()
const current_user = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
}).user;

socket.emit('join', current_user);

socket.on('msg', data => {
    console.log(data.responce);
    updateUserList(data.users)
});

socket.on('chat-update', info => {
    console.log(info);
    updateMessages(info);
});

socket.on('user-disconnect', info => {
    console.log(info);
    updateUserList(info.users);
    showMessage(info.message, info.status);
});

socket.on('user-join', info => {
    console.log(info);
    updateUserList(info.users);
    showMessage(info.message, info.status)
});

user_message_form.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = e.target.elements.msg.value;
    socket.emit('chat-message', {
        user: current_user,
        message: message
    });

    clearBox();
});

function updateUserList(users){
    const list = document.getElementById('users-table');
    var update ="";
    users.forEach(element => {
        update += '|'+ element + '|';
    });
    const static = `
    <span id="title-user"><strong>ACTIVE USERS:</strong>    </span>
                    <span id="user-list">${update}</span>
                    <a href="index.html" class="btn btn-link">Leave</a>
    `;
    console.log(static);

    list.innerHTML = static;
}

function showMessage(message, status){
    var id= 'content-chats';
    var original = document.getElementById(id).innerHTML;
    var update = original;
    if(status){
        update += `
            <div class="alert alert-info">
                ${message} joined the chat
            </div>
        `;
    }else{
        update += `
            <div class="alert alert-info">
                ${message} left the chat
            </div>
        `;
    }
    document.getElementById(id).innerHTML = update;
}

function updateMessages(values){
    var id= 'content-chats';
    var original = document.getElementById(id).innerHTML;
    var user_you = `
        <div class="chat-msg">
            <label class="text-right">You</label><br>
            <h5>${values.message}          <small>${values.timestamp}</small></h3>
        </div>
    `;
    var user_not_you = `
        <div class="chat-msg darker">
            <label class="text-left">${values.user}</label><br>
            <h5>${values.message}          <small>${values.timestamp}</small></h3>
        </div>
    `;
    var update = ``;
    if(values.user == current_user){
        update = original + user_you;
    }
    else{
        update = original + user_not_you;
    }
    document.getElementById(id).innerHTML = update;
}
function clearBox(){
    document.getElementById('msg').value = '';
    document.getElementById('msg').focus();
}
