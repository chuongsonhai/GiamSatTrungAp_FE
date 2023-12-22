import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';

import { TableService } from '../../_metronic/shared/crud-table';

import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CanhBaoGiamSat } from '../models/canhbaogiamsat.model';
import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CanhBaoGiamSatService extends TableService<CanhBaoGiamSat> implements OnDestroy {
    API_URL = `${environment.apiUrl}/canhbao`;
    API_URL1 = `${environment.apiUrl}/EmailZalo`;
    API_URL2 = `${environment.apiUrl}/users`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }
    
    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    createPhanHoi(File: File, item: any): Observable<any> {
        const url = `${environment.apiUrl}/PhanhoiTraodoi/add`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const formData = new FormData();
        formData.append('data', JSON.stringify(item));
        formData.append('File', File);
        return this.http.post<any>(url, formData, { reportProgress: true }).pipe(            
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }


    creatUserNhanCanhBao(item: any): Observable<any> { 
        const url = `${this.API_URL1}/user_nhan_canhbao/add`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.post<any>(url, item).pipe(
          catchError(err => {        
            this._errorMessage.next(err);
            console.error('CREATE ITEM', err);        
            return of(undefined);
          }),
          finalize(() => this._isLoading$.next(false))
        );
      }

      getUserNhanCanhBao(item: any): Observable<any> { 
        const url = `${this.API_URL2}/filterusernhan`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.post<any>(url, item).pipe(
          catchError(err => {        
            this._errorMessage.next(err);
            console.error('CREATE ITEM', err);        
            return of(undefined);
          }),
          finalize(() => this._isLoading$.next(false))
        );
      }

      updateUserNhanCanhBao( item: any): Observable<any> {
        const url = `${this.API_URL1}/edit`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const formData = new FormData();
        formData.append('data', JSON.stringify(item));
        return this.http.post<any>(url, formData, { reportProgress: true }).pipe(            
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    deleteUserNhan(idPhanHoi:number) {
        const url = `${this.API_URL1}/delete/`+idPhanHoi;
        return this.http.get<any>(url, { params: {} }).pipe(
            tap((res) => {
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }


    updatePhanHoi(File: File, item: any): Observable<any> {
        const url = `${environment.apiUrl}/PhanhoiTraodoi/edit`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const formData = new FormData();
        formData.append('data', JSON.stringify(item));
        formData.append('File', File);
        return this.http.post<any>(url, formData, { reportProgress: true }).pipe(            
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    deletePH(idPhanHoi:number) {
        const url = `${environment.apiUrl}/PhanhoiTraodoi/delete/`+idPhanHoi;
        return this.http.get<any>(url, { params: {} }).pipe(
            tap((res) => {
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }

    updateStatus(idCanhBao:number, status: number,nguyenhan:number ,ketqua:string) {
        const url = `${environment.apiUrl}/canhbao/updateStatus/`+idCanhBao+`/`+ status + `/`+ nguyenhan + `/`+ ketqua;
        return this.http.get<any>(url, { params: {} }).pipe(
            tap((res) => {
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }
}

