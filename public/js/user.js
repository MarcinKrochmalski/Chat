


function setUsername(callback = false, param) {

    if (/^([a-zA-Z0-9]{2,30})+$/.test(elUsername.value)) {

        preloader(true);
        socket.off('username');

        socket.emit('username', { name: elUsername.value });
        socket.on('username', result => {

            if (result) {

                usernameIsSent = true;
                callback && callback(param);

            } else {

                infoBox('error set user name');

            }

            preloader(false);
            socket.off('username');

        })


    } else {

        infoBox('error set user name');

    }

}