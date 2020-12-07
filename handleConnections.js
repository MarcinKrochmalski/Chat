const Config = require('./Config');

module.exports = class handleConnections {

    config = new Config();
    users = {};

    constructor(io) {

        io.on('connection', socket => {

            //set rooms
            socket.on('rooms', () => {

                let rooms = [];

                for (let [key] of socket.adapter.rooms) {

                    (key.indexOf(this.config.roomPrefix) > -1) && rooms.push({
                        name: key.replace(this.config.roomPrefix, ''),
                        users: this.getNumberOfUsers(key.replace(this.config.roomPrefix, '')),
                        limit: this.config.maxUsersInRoom
                    });

                }

                if (rooms.length < 1 && this.config.defaultRooms.length > 0) {

                    this.config.defaultRooms.forEach(room => rooms.push({
                        name: room,
                        users: 0,
                        limit: this.config.maxUsersInRoom
                    }));

                }

                socket.emit('rooms', rooms);

            })

            //add username
            socket.on('username', data => {

                let result = false;

                if (this.findUserByName(data.name) === undefined) {

                    this.users[socket.id] = {
                        name: data.name,
                        room: false
                    };

                    result = true;

                }

                socket.emit('username_result', result);

            })

            //user join to room
            socket.on('join', data => {

                let result = false;
                if (socket.id in this.users) {

                    if (this.getNumberOfUsers(data.room) < this.config.maxUsersInRoom) {

                        socket.join(this.config.roomPrefix + data.room);
                        socket.broadcast
                            .to(this.config.roomPrefix + data.room)
                            .emit('join_user', this.users[socket.id].name);
                        this.users[socket.id].room = data.room;
                        result = true;

                    }

                }

                socket.emit('join_result', result);

            })

            //handle chat events
            socket.on('event', data => {

                let result = false;

                if (socket.id in this.users && this.users[socket.id].room) {

                    data.username = this.users[socket.id].name;
                    socket.broadcast
                        .to(this.config.roomPrefix + this.users[socket.id].room)
                        .emit('new_event', data);
                    result = true;

                }

                data.result = result;
                socket.emit('event_result', data);

            })

            //user leave room
            socket.on('leave', () => {

                socket.emit('leave_result', this.leaveRoom(socket));

            });

            socket.on('disconnect', () => {

                this.leaveRoom(socket);
                if (socket.id in this.users) delete this.users[socket.id];

            });

        });

    }

    leaveRoom(socket) {

        let result = false;
        if (socket.id in this.users) {

            socket.broadcast
                .to(this.config.roomPrefix + this.users[socket.id].room)
                .emit('leave_user', this.users[socket.id].name);
            socket.leave(this.config.roomPrefix + this.users[socket.id].room);
            this.users[socket.id].room = false;
            result = true;

        }

        return result;

    }

    findUserByName(username) {

        return Object.keys(this.users).find(idUser => this.users[idUser].name === username);

    }

    getNumberOfUsers(room) {

        let number = 0;
        Object.keys(this.users).forEach(key => this.users[key].room === room && number++);
        return number;

    }

}
