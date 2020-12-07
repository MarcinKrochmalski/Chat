export default class Rooms {

    elUsername = document.getElementById('username');
    elRoomsItems = document.getElementById('items');
    elFormNewRoom = document.getElementById('formNewRoom');
    elNewRoom = document.getElementById('newRoom');

    on = () => {

        preloader.on();
        socket.off('rooms');
        socket.emit('rooms');
        socket.on('rooms', data => {

            socket.off('rooms');
            this.insertRooms(data);
            this.handleRooms();
            switchView('rooms');
            preloader.off();

        })

    }

    insertRooms(data) {

        console.log(data);

        if (data.length > 0) {

            this.elRoomsItems.innerHTML = '';
            data.forEach(room => {

                if (room.name) {

                    const elRoom = document.createElement('li');
                    elRoom.className = 'item';

                    if (room.users < room.limit) {

                        elRoom.onclick = () => {
                            init('room', [this.elUsername.value, room.name]);
                        };

                        elRoom.innerHTML = `<div>${room.name} <i class="right">${room.users} users</i> </div>`;

                    } else {

                        elRoom.innerHTML = `${room.name} (room is full) <i class="right">${room.users} users</i>`;

                    }

                    this.elRoomsItems.appendChild(elRoom);

                }

            });

        } else {

            this.elRoomsItems.innerHTML = '<li><i>No rooms</i></li>';

        }

    }

    handleRooms() {

        this.elFormNewRoom.addEventListener('submit', e => {

            e.preventDefault();

            if ((/^([a-zA-Z0-9!@#\$%\^\&*\)\(+=., _-]{1,60})+$/.test(this.elNewRoom.value))) {

                init('room', [this.elUsername.value, this.elNewRoom.value]);

            } else {

                info.on('Enter new room name. <br> Acceptable characters are letters and numbers.');

            }

        });

    }

}



