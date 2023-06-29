import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';

import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, BaseModel, PaginatorState, SortState, GroupingState, ITableState } from '../../_metronic/shared/crud-table';
import { Router } from '@angular/router';

import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { BienBanKT } from '../models/bienbankt.model';

@Injectable({
    providedIn: 'root'
})
export class BienBanKTService extends TableService<BienBanKT> implements OnDestroy {
    API_URL = `${environment.apiUrl}/bienbankt`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    public getItem(id: any): any {
        const url = `${this.API_URL}/getdata`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        var obj = { maYCau: id };
        return this.http.post<any>(url, obj).pipe(
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

    huyKetQua(item: any): Observable<any> {
        const url = `${this.API_URL}/huyketqua`;
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

    
    kiemTraLai(item: any): Observable<any> {
        const url = `${this.API_URL}/cancel`;
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

    sign(item: any): Observable<any> {
        const url = `${this.API_URL}/sign`;
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

    signRemote(item: any): Observable<any> {
        const url = `${this.API_URL}/signremote`;
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

    approve(item: any): Observable<any> {
        const url = `${this.API_URL}/approve`;
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
}

