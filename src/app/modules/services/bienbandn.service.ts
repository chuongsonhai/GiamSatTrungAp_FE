import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';
import { TableService, TableResponseModel, BaseModel, PaginatorState, SortState, GroupingState, ITableState } from '../../_metronic/shared/crud-table';

import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { BienBanDN } from '../models/base.model';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class BienBanDNService extends TableService<BienBanDN> implements OnDestroy {
    API_URL = `${environment.apiUrl}/bienbandn`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }

    public formGroupBBDN: FormGroup;
    public fromGroupQuyMo: FormGroup;
    public TramBienAps = new FormArray([]);
    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    public getItem(id: number): any {
        const url = `${this.API_URL}/${id}`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.get<any>(url).pipe(
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    public detail(id: number): any {
        const url = `${this.API_URL}/detail/${id}`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.get<any>(url).pipe(
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    chuyentiep(maYCau: string, maDViTNhan: string): Observable<any> {
        const url = `${environment.apiUrl}/ycaudaunoi/chuyentiep`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        var request = { maYCau: maYCau, maDViTNhan: maDViTNhan };
        return this.http.post<any>(url, request).pipe(
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }    

    complete(item: any): Observable<any> {
        const url = `${this.API_URL}/hoanthanh`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.post<any>(url, item).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    upload(File: File, item: any): Observable<any> {
        const url = `${this.API_URL}/upload`;
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

    confirm(item: any): Observable<any> {
        const url = `${this.API_URL}/confirm`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.post<any>(url, item).pipe(            
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    notify(item: any): Observable<any> {
        const url = `${this.API_URL}/notify`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        
        return this.http.post<any>(url, item).pipe(            
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    getPdf(item: any): Observable<any> {
        const url = `${this.API_URL}/getpdf`;
        this._isLoading$.next(true);
        return this.http.post<any>(url, item).pipe(            
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }
}

