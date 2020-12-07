export default class Room {

    usersTyping = {};
    userScroll = false;

    elConversation = document.getElementById('conversation');
    elTyping = document.getElementById('typing');
    elFormMessage = document.getElementById('formMessage');
    elMessage = document.getElementById('message');
    elRoomname = document.getElementById('roomname');
    elBtnExit = document.getElementById('btnExit');

    user = {
        name: null,
        room: null
    }

    join = (username, roomname) => {

        if (!(usernameIsSent === username)) {

            this.setUsername(username, roomname);

        } else {

            preloader.on();
            socket.off('join_result');

            socket.emit('join', {

                room: roomname

            });

            socket.on('join_result', result => {

                socket.off('join_result');

                if (result) {

                    switchView('room');
                    this.elRoomname.innerHTML = roomname;
                    this.handleConversation();

                } else {

                    info.on('Failed to join the room');

                }

                preloader.off();

            })

        }

    }

    setUsername(username, roomname = false) {

        if (/^([a-zA-Z0-9]{2,30})+$/.test(username)) {

            preloader.on();
            socket.off('username_result');

            socket.emit('username', { name: username });
            socket.on('username_result', result => {

                socket.off('username_result');

                if (result) {

                    usernameIsSent = username;
                    this.user = {
                        name: username,
                        room: roomname
                    };

                    (roomname) && this.join(username, roomname);

                } else {

                    info.on('The username is used.');

                }

                preloader.off();


            })


        } else {

            info.on('Enter your username. <br> Acceptable characters are letters and numbers.');

        }

    }

    handleConversation() {

        this.elMessage.select();

        socket.on('join_user', username => {

            this.elConversation.innerHTML += `<div class="info"> <i> ${username} </i> has joined the conversation </div>`;

        });

        socket.on('new_event', data => {

            data.type === 'typing' ? this.setUserTyping(data.username) : this.writeMessage(data);

        });

        socket.on('leave_user', username => {

            this.elConversation.innerHTML += `<div class="row"><div class="info"><i> ${username} </i> has left the conversation</div></div>`;
            this.scrollConversation();

        });

        socket.on('event_result', data => {

            if (data.result) {

                data.type === 'message' && this.writeMessage(data);

            } else {

                handleError();

            }

        });

        this.elFormMessage.addEventListener('submit', this.emitMessage, true);
        this.elMessage.addEventListener('keypress', this.emitTyping, true);
        this.elBtnExit.addEventListener('click', this.leaveRoom, true);

    }

    setUserTyping(username) {

        (username in this.usersTyping) && clearTimeout(this.usersTyping[username]);
        this.usersTyping[username] = setTimeout(() => { this.unsetUserTyping(username) }, 4000);
        this.writeUsersTyping();

    }

    unsetUserTyping(username) {

        delete this.usersTyping[username];
        this.writeUsersTyping();

    }

    writeUsersTyping() {

        this.elTyping.innerHTML = '';
        Object.keys(this.usersTyping).forEach(username => {
            this.elTyping.innerHTML += ` <i> ${username} </i> is typing ... `;
        });

    }

    writeMessage(data) {

        const className = data.username === this.user.name ? 'userMessage' : 'message';
        this.elConversation.innerHTML += `<div class="row"><div class="${className}"> <i>${data.username}</i> <br>  ${data.message} </div></div>`;
        data.username !== this.user.name && this.unsetUserTyping(data.username);
        this.scrollConversation();

    }

    scrollConversation() {

        this.elConversation.scrollTop = this.elConversation.scrollHeight;

    }

    emitMessage = e => {

        e.preventDefault();

        if ((/^([a-zA-Z0-9!@#\$%\^\&*+=., _-]{2,500})+$/.test(this.elMessage.value))) {

            socket.emit('event', {
                type: 'message',
                message: this.elMessage.value
            });

            this.elMessage.value = '';
            this.elMessage.select();

        } else {

            info.on('The message body is empty or contains invalid characters.');

        }

    }

    emitTyping = () => {
        socket.emit('event', {
            type: 'typing'
        });

    }

    leaveRoom = () => {

        socket.off('join_user');
        socket.off('new_event');
        socket.off('leave_user');
        socket.off('event_result');


        this.elFormMessage.removeEventListener('submit', this.emitMessage, true);
        this.elMessage.removeEventListener('keypress', this.emitTyping, true);
        this.elBtnExit.removeEventListener('click', this.leaveRoom, true);

        this.elConversation.innerHTML = '';
        this.elMessage.value = '';

        preloader.on();
        socket.off('leave_result');

        socket.emit('leave');
        socket.on('leave_result', result => {

            socket.off('leave_result');

            if (result) {

                init('rooms');

            } else {

                preloader.off();
                handleError();

            }

        });

    }

}



