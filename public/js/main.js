import Preloader from './preloader.js';
import Info from './info.js';
import Rooms from './rooms.js';
import Room from './room.js';

window.usernameIsSent = false;
window.socket = io.connect('http://localhost:4000/');

window.preloader = new Preloader();
window.info = new Info();
window.rooms = new Rooms();
window.room = new Room();

var elRooms = document.getElementById('rooms'),
    elRoom = document.getElementById('room');

window.addEventListener('load', () => {

    checkConnection();
    init('rooms');

});

window.init = function (view, arg) {

    (view === 'rooms') ? rooms.on() : room.join(arg[0], arg[1]);

}

window.switchView = function (view) {

    elRooms.style.display = (view === 'rooms') ? 'block' : 'none';
    elRoom.style.display = (view === 'room') ? 'block' : 'none';

}


window.checkConnection = function () {

    const interval = setInterval(() => {
        if (socket.disconnected) {
            handleError('Server is disconnected ...');
            interval.clearInterval()
        }
    }, 2000);

}

window.handleError = function (info = 'Critical error') {

    switchView('error');
    info.on(info);

}


