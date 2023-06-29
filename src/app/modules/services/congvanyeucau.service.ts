import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';

import { TableService, TableResponseModel, BaseModel, PaginatorState, SortState, GroupingState, ITableState } from '../../_metronic/shared/crud-table';

import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CongVanYeuCau } from '../models/congvanyeucau.model';
import { ChartResponseModel, YeuCauFilterModel } from '../models/response.model';

@Injectable({
    providedIn: 'root'
})
export class CongVanYeuCauService extends TableService<CongVanYeuCau> implements OnDestroy {
    API_URL = `${environment.apiUrl}/ycaudaunoi`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    // UPDATE Status
    traHoSo(item: any): Observable<any> {
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const url = this.API_URL + '/trahoso';
        return this.http.post(url, item).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    duyetHoSo(item: any): Observable<any> {
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const url = this.API_URL + '/duyethoso';
        return this.http.post(url, item).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    duplicate(maYeuCau: string): Observable<any> {
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const url = this.API_URL + '/duplicate';
        return this.http.post(url, { maYCau: maYeuCau }).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    yeuCauKhaoSat(item: any): Observable<any> {
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const url = this.API_URL + '/yeucaukhaosat';
        return this.http.post(url, item).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    yeuCauKhaoSatLai(item: any): Observable<any> {
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const url = this.API_URL + '/yeucaukhaosatlai';
        return this.http.post(url, item).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }
    
    protected _chartResult$ = new BehaviorSubject<ChartResponseModel>(new ChartResponseModel);

    get chartResult$() {
        return this._chartResult$.asObservable();
    }
    public getListYeuCau(maDViQLy: string, fromdate: string, todate: string): any {
        const url = this.API_URL + '/laydulieuchart';
        this._errorMessage.next('');
        var filter = new YeuCauFilterModel;
        filter.maDViQLy = maDViQLy;
        filter.fromdate = fromdate;
        filter.todate = todate;
        const objRequest = { maDViQLy: maDViQLy, fromdate: fromdate, todate: todate };
        return this.http.post<any>(url, filter).pipe(

            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }
}

