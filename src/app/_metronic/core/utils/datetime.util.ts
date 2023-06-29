import * as _moment from 'moment';
import { DatePipe, formatDate } from '@angular/common';

export class DateTimeUtil {
    static datePipe: DatePipe;
    static hourMinute = {
        hour: 0,
        minute: 0
    };
    constructor() {
    }

    public static convertStringISOToStringVNDefaulDateNow(stringISOConvert: string): string {
        this.datePipe = (new DatePipe('en-US'));
        return this.datePipe.transform(stringISOConvert ? new Date(stringISOConvert) : new Date(), 'dd/MM/yyyy');
    }

    public static convertStringISObyUSToStringVN(stringISOConvert: string): string {
        this.datePipe = (new DatePipe('en-US'));
        try {
            if (stringISOConvert)
                return this.datePipe.transform(new Date(stringISOConvert), 'dd/MM/yyyy');
        } catch (error) {
            console.log("Error convert string to datetime: " + stringISOConvert);
            return "";
        }
    }

    public static convertStringISOToStringVN(stringISOConvert: string): string {        
        this.datePipe = new DatePipe('vi-VN');
        try {
            if (stringISOConvert)
                return this.datePipe.transform(new Date(stringISOConvert), 'dd/MM/yyyy');
        } catch (error) {
            console.log("Error convert string to datetime: " + stringISOConvert);
            return "";
        }
    }

    public static convertStringISOToStringVNFULL(stringISOConvert: string): string {
        this.datePipe = (new DatePipe('en-US'));
        try {
            if (stringISOConvert)
                return this.datePipe.transform(new Date(stringISOConvert), 'dd/MM/yyyy hh:mm:ss');
        } catch (error) {
            console.log("Error convert string to datetime: " + stringISOConvert);
            return "";
        }

    }
    public static convertStringISOToHourMinute(stringISOConvert: string): string {
        return this.datePipe.transform(stringISOConvert ? new Date(stringISOConvert) : new Date(), 'shortTime');
    }

    public static convertStringVNToStringISO(stringVN: string): string {
        var date = _moment(stringVN, "DD/MM/YYYY");
        return this.dateToISOLikeButLocal(date.toDate());
    }

    public static getMonthToStringVN(stringVN: string): number {
        return parseInt(stringVN.split(/\D/)[1]);
    }

    public static getYearToStringVN(stringVN: string): number {
        return parseInt(stringVN.split(/\D/)[2]);
    }

    // public static convertStringVNToStringISO(stringVN: string): string {
    //     var date = _moment(stringVN, "DD/MM/YYYY");
    //     var a = date.toDate().toLocaleString('vi').split(/\D/);
    //     //this.datePipe.transform(new Date(Date.UTC(a[6], a[5], a[4], a[0], a[1], a[2], a[3])), 'yyyy-MM-ddThh:mm:ss');
    //     this.datePipe.transform(new Date(a[6], a[5], a[4], a[0], a[1], a[2], a[3]), 'yyyy-MM-ddThh:mm:ss');
    //     return this.dateToISOLikeButLocal(date.toDate());
    // }

    public static convertStringVNToStringISOAddHour(stringVN: string, hour: any, minute: any): string {
        var date = _moment(stringVN, "DD/MM/YYYY").add(hour, 'hour').add(minute, "minute");
        return this.dateToISOLikeButLocal(date.toDate());
    }

    public static toISOLocal(d: Date): string {
        var z = n => ('0' + n).slice(-2);
        var zz = n => ('00' + n).slice(-3);
        var off = d.getTimezoneOffset();
        var sign = off < 0 ? '+' : '-';
        off = Math.abs(off);

        return d.getFullYear() + '-'
            + z(d.getMonth() + 1) + '-' +
            z(d.getDate()) + 'T' +
            z(d.getHours()) + ':' +
            z(d.getMinutes()) + ':' +
            z(d.getSeconds()) + '.' +
            zz(d.getMilliseconds()) +
            sign + z(off / 60 | 0) + ':' + z(off % 60);
    }

    public static dateToISOLikeButLocal(date: Date): string {
        const offsetMs = date.getTimezoneOffset() * 60 * 1000;
        const msLocal = date.getTime() - offsetMs;
        const dateLocal = new Date(msLocal);
        const iso = dateLocal.toISOString();
        const isoLocal = iso.slice(0, 19);
        return isoLocal;
    }
}
