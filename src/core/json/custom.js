export const ACSPLGUID = {
    srCounter: 1999,
    lastValue: "",
    getNew() {
        let e = Math.floor(1000 + Math.random() * 9000).toString();
        const t = new Date(),
            a = new Date();
        let s = a - t.setHours(0, 0, 0, 0);
        s = `0000000000000000${s}`;
        let o = `0000${a.getFullYear()}`.slice(-2);
        o += `00${a.getMonth() + 1}`.slice(-2);
        o += `00${a.getDate()}`.slice(-2);
        o += s.slice(-8);
        this.srCounter = this.srCounter + 1;
        if (this.srCounter > 9000) this.srCounter = 1999;
        const n = `PK${parseInt(o, 10).toString(16).toUpperCase()}${e}${this.srCounter.toString()}`;
        this.lastValue = n;
        return n;
    },
};

export const convertToISODate = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date)) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    return "";
};

export const formatToDateTimeLocal = (dateStr) => {
    const months = {
        Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
        Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };

    const parts = dateStr.trim().split(' ');
    if (parts.length !== 3) return "";

    const [day, monthShort, year] = parts;
    const month = months[monthShort];
    if (!month) return "";

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day.padStart(2, '0')}T${hours}:${minutes}`;
};


export const convertToCustomDate = (dateString, daysToSubtract = 0) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const date = new Date(dateString);
    const now = new Date(); // Current time

    if (!isNaN(date)) {
        date.setDate(date.getDate() - daysToSubtract);
        // Set current time to the given date
        date.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

        const day = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
    }
    return "";
};


export const formatDate = (dateString) => {
    if (!dateString) return "";

    const inputDate = new Date(dateString);
    const now = new Date();

    inputDate.setHours(now.getHours(), now.getMinutes());

    const day = inputDate.getDate().toString().padStart(2, '0');
    const monthShort = inputDate.toLocaleString('en-GB', { month: 'short' });
    const year = inputDate.getFullYear();
    const hours = inputDate.getHours().toString().padStart(2, '0');
    const minutes = inputDate.getMinutes().toString().padStart(2, '0');

    return `${day} ${monthShort} ${year} ${hours}:${minutes}`;
};

export const baseUrl = {
    // Url: "https://arthadisha.in",
    Url: "http://adsvr:140",
    // Url: "http://192.168.1.121:140",
    // Url: "https://perfectkrushimarketyard.com"

};

export const Accounts = {
    CASHACC: 'PK0034',
    FARMERACC: 'PK0027',
    VYAPARIACC: 'PK0040',
    CHECKACC: 'PK16C8CADC439495422033',
    COLDACC: 'PK16C8CB83820F44682187',
};


{/*CASHACC :PK0034 = Cash-in-Hand
     FARMERACC: 'PK0027' = Sundry Creditors , 
    VYAPARIACC: 'PK0040' Sundry Debtors,
    CHECKACC: 'PK16C8CADC439495422033'चेक कलेक्शन अकाऊंट 
    COLDACC:'PK16C8CB83820F44682187' कोल्ड स्टोरेज रेंट ,
    */}
