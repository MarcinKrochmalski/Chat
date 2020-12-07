export default class Preloader {

    elPreloader = document.getElementById('preloader');
    timeout = null;

    on = () => {

        this.elPreloader.style.display = 'flex';
        this.elPreloader.className = 'on';

    }

    off = () => {

        this.elPreloader.className = 'off';
        this.timeout = setTimeout(() => {
            this.elPreloader.style.display = 'none';
            this.timeout = null;
        }, 500);

    }

}

