export default class Info {

    elInfo = document.getElementById('info');
    timeout = null;

    on = (into) => {

        this.elInfo.style.display = 'flex';
        this.elInfo.className = 'on';
        this.elInfo.querySelector('div').innerHTML = into;
        this.elInfo.addEventListener('click', this.off);

    }

    off = () => {

        this.elInfo.className = 'off';
        this.timeout = setTimeout(() => {
            this.elInfo.style.display = 'none';
            this.timeout = null;
        }, 500);
        this.elInfo.removeEventListener('click', this.off);

    }

}

