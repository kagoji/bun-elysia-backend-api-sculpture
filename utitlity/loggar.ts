import fs from 'fs';

class LogLater {
    filename: string;
    arr: string[] = [];
    timeout: NodeJS.Timeout | false = false;
    interval: number;
    noduplicates: boolean;
    onsavetimeout_bind: () => void;
    lasttext: string = "";

    constructor(filename?: string, noduplicates?: boolean, interval?: number) {
        this.filename = filename || 'logs/LOG-' + new Date().toISOString().slice(0, 10) + '.log';
        this.interval = interval || 1000;
        this.noduplicates = noduplicates !== undefined ? noduplicates : true;
        this.onsavetimeout_bind = this.onsavetimeout.bind(this);

        // Handle process exit to save remaining logs
        process.on('exit', () => {
            if (this.timeout) clearTimeout(this.timeout);
            this.timeout = false;
            this.save();
        });
    }

    private _log(text: string) {
        this.arr.push(text);
        if (!this.timeout) this.timeout = setTimeout(this.onsavetimeout_bind, this.interval);
    }

    text(text: string) {
        if (this.noduplicates && this.lasttext === text) return;
        this.lasttext = text;
        this._log(text);
    }

    line(text: string) {
        if (this.noduplicates && this.lasttext === text) return;
        this.lasttext = text;
        this._log(text + '\r\n');
    }

    dateline(text: string) {
        if (this.noduplicates && this.lasttext === text) return;
        this.lasttext = text;
        const date = new Date().toLocaleString('en-BN', { timeZone: 'Asia/Dhaka' });
        this._log(date + ' : ' + text + '\r\n');
    }

    private onsavetimeout() {
        this.timeout = false;
        this.save();
    }

    private save() {
        fs.appendFile(this.filename, this.arr.splice(0, this.arr.length).join(''), (err) => {
            if (err) console.log(err.stack);
        });
    }
}

export default LogLater;
