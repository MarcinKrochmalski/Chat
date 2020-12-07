

function joinToRoom(room) {

    if (userName === false) {

        setUsername(joinToRoom, room);

    } else {

        preloader(true);
        socket.off('join');

        socket.emit('join', { room });
        socket.on('join', result => {

            if (result) {


                switchView('rooms');

            } else {

                infoBox('error join');

            }


            preloader(false);
            socket.off('join');

        })

    }

}

function handleConversation() {


}



