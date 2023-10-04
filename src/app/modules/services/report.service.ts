import { Injectable, Inject, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TableService } from '../../_metronic/shared/crud-table';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ReportData } from '../models/reportdata.model';

@Injectable({
    providedIn: 'root'
})
export class ReportService extends TableService<ReportData> implements OnDestroy {
    API_URL = `${environment.apiUrl}/report`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    public exportExcel(filter: any): any {
        const url = `${this.API_URL}/export`;
        this._errorMessage.next('');
        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }  
    public exportExcelTongHop(filter:any): any {
        const url = `${this.API_URL}/exporttonghop`;
        this._errorMessage.next('');
        
        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }  
    public exportExcelTheoThang(filter:any): any {
        const url = `${this.API_URL}/exportchitietthang`;
        this._errorMessage.next('');
   
        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }  
    public exportExcelLuyKe(filter:any): any {
        const url = `${this.API_URL}/exportchitietluyke`;
        this._errorMessage.next('');

        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }  


    public getBaoCaoTongHop(filter:any): any {        
        const url = this.API_URL + '/getbaocaotonghop';
        this._errorMessage.next('');
       
        return this.http.post<any>(url, filter).pipe(
         
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    } 
    public getBaoCaoChiTietThang(filter:any): any {        
        const url = this.API_URL + '/getbaocaochitietthang';
        this._errorMessage.next('');
       
       
        return this.http.post<any>(url, filter).pipe(
         
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    } 
    public getBaoCaoChiTietLuyKe(filter:any): any {        
        const url = this.API_URL + '/getbaocaochitietluyke';
        this._errorMessage.next('');
       
        
        return this.http.post<any>(url, filter).pipe(
         
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    } 
    
    public getBaoCaoTHTCDN(filter:any): any {        
        const url = this.API_URL + '/getbaocaothtcdn';
        this._errorMessage.next('');
        debugger;
        return this.http.post<any>(url, filter).pipe(
         
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    } 
    public exportExcelTHTCDN(filter: any): any {
        const url = `${this.API_URL}/exportbaocaothtcdn`;
        this._errorMessage.next('');
      
        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }  

    public exportExcelTHKQ(filter: any): any {
        const url = `${this.API_URL}/exportbaocaothkq`;
        this._errorMessage.next('');
      
        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }  

    public getBaoCaoTHTCDNQuaHan(filter:any): any {        
        const url = this.API_URL + '/getbaocaothquahan';
        this._errorMessage.next('');
        debugger;
        return this.http.post<any>(url, filter).pipe(
         
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    } 
    public exportExcelTHQuaHan(filter: any): any {
        const url = `${this.API_URL}/exportbaocaothquahan`;
        this._errorMessage.next('');
        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }  

    public exportExcelTHGiamSatCapDien(filter: any): any {
        const url = `${this.API_URL}/exportbaocaotonghoptiendo`;
        this._errorMessage.next('');
        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    } 
    public exportExcelCTGiamSatCapDien(filter: any): any {
        const url = `${this.API_URL}/exportbaocaochitietgiamsatiendo`;
        this._errorMessage.next('');
        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }
    public exportExcelTHKhaoSatKhachHang(filter: any): any {
        const url = `${this.API_URL}/exportbaocaothdanhgiamucdo`;
        this._errorMessage.next('');
        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }
    public getCTGiamSatCapDien(filter: any): any {
        const url = `${this.API_URL}/getbaocaochitietgiamsattiendo`;
        this._errorMessage.next('');
        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }
    public getTHGiamSatCapDien(filter: any): any {
        const url = `${this.API_URL}/getbaocaotonghoptiendo`;
        this._errorMessage.next('');
        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }
    public getTHKhaoSatKhachHang(filter: any): any {
        const url = `${this.API_URL}/getbaocaothdanhgiamucdo`;
        this._errorMessage.next('');
        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }
    public exportExcelCTKhaoSatKhachHang(filter: any): any {
        const url = `${this.API_URL}/exportchitietmucdohailong`;
        this._errorMessage.next('');
        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }
    public getCTKhaoSatKhachHang(filter: any): any {
        const url = `${this.API_URL}/getchitietmucdohailong`;
        this._errorMessage.next('');
        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }
}

