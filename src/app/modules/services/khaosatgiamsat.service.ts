import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';

import { TableResponseModel, TableService } from '../../_metronic/shared/crud-table';

import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CanhBaoGiamSat, KhachHangGiamSat } from '../models/canhbaogiamsat.model';
import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { DanhSachKhaoSat } from '../models/canhbaochitiet.model';

@Injectable({
    providedIn: 'root'
})
export class KhaoSatGiamSatService extends TableService<DanhSachKhaoSat> implements OnDestroy {
    API_URL = `${environment.apiUrl}/khaosat`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }
    
    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    getThoiGianTinhToan(IdYeuCau): Observable<any> {
        const url = `${environment.apiUrl}/KhaoSat/Filterngay`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.post<any>(url, {IdYeuCau:IdYeuCau}, { reportProgress: true }).pipe(            
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    getItemByYeuCauId(IdYeuCau): Observable<any> {
        const url = `${environment.apiUrl}/KhaoSat/filter`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.post<any>(url, {IdYeuCau:IdYeuCau}, { reportProgress: true }).pipe(            
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    updateKhaoSat(item: any): Observable<any> {
        const url = `${environment.apiUrl}/KhaoSat/edit`;
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

    createKhaoSat(item: any): Observable<any> {
        const url = `${environment.apiUrl}/KhaoSat/add`;
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

    updateStatus(idKhaoSat:number, status: number) {
        const url = `${environment.apiUrl}/KhaoSat/updateStatus/`+idKhaoSat+`/`+ status;
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

