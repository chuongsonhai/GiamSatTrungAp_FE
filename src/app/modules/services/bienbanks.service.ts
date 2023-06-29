import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';
import { TableService, TableResponseModel, BaseModel, PaginatorState, SortState, GroupingState, ITableState } from '../../_metronic/shared/crud-table';

import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { BienBanKS, TaiLieuKS } from '../models/base.model';

@Injectable({
    providedIn: 'root'
})
export class BienBanKSService extends TableService<BienBanKS> implements OnDestroy {
    API_URL = `${environment.apiUrl}/bienbanks`;
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
        var obj = {maYCau: id};
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

    khaoSatLai(item: any): Observable<any> {
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
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    public getTLKSByID(convanid: number): any {
        const url = `${this.API_URL}/GetListTLKS/${convanid}`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.get<any>(url).pipe(
            tap((res) => {
                this._tlkss$.next(res);
            }),
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }
    protected _tlkss$ = new BehaviorSubject<TaiLieuKS[]>([]);

    get tlkss$() {
        return this._tlkss$.asObservable();
    }

    public getItemTLKSByID(tlksid: number): any {
        const url = `${this.API_URL}/GetTLKSItem/${tlksid}`;
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
    createTLKS(File: File, item: any): Observable<any> {
        const url = `${this.API_URL}/createTLKS`;
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
    updateTLKS(File: File, item: any): Observable<any> {
        const url = `${this.API_URL}/updateTLKS`;
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
    public deleteItem(id: number): any {
        const url = `${this.API_URL}/delete/${id}`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.delete<any>(url).pipe(
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of({ ID: undefined });
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

}

