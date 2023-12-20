import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';

import { TableService, TableResponseModel, BaseModel, PaginatorState, SortState, GroupingState, ITableState } from '../../_metronic/shared/crud-table';

import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { YeuCauNghiemThu } from '../models/yeucaunghiemthu.model';
import { ChartResponseModel } from '../models/response.model';

@Injectable({
    providedIn: 'root'
})
export class YeuCauNghiemThuService extends TableService<YeuCauNghiemThu> implements OnDestroy{
    API_URL = `${environment.apiUrl}/ycaunghiemthu`;
    API_URL1 = `${environment.apiUrl}/Dashboard`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }
    
    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }          

    approve(item: any): Observable<any> {
        this._isLoading$.next(true);
        this._errorMessage.next('');        
        const url = this.API_URL + '/approve';        
        return this.http.post(url, item).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }    

    yeuCauKiemTra(item: any): Observable<any> {
        this._isLoading$.next(true);
        this._errorMessage.next('');        
        const url = this.API_URL + '/yeucaukiemtra';        
        return this.http.post(url, item).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }  
    yeuCauKiemTraLai(item: any): Observable<any> {
        this._isLoading$.next(true);
        this._errorMessage.next('');        
        const url = this.API_URL + '/yeucaukiemtralai';        
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
    public getListYeuCau(maDViQLy:string,fromdate:string,todate:string): any {        
        const url = `${this.API_URL}/LayDuLieuChart`;
        this._errorMessage.next('');
        const objRequest = {maDViQLy: maDViQLy, fromdate: fromdate, todate: todate};
        return this.http.post<any>(url, objRequest).pipe(
            tap((res) => {
                this._chartResult$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }  
    
    public getList1(maDVi:string): any {        
        const url = `${this.API_URL1}/dashboard/canhbao`;
        this._errorMessage.next('');
        const objRequest = {filterdashboardcanhbao:{madvi: maDVi}};
        console.log(objRequest)
        return this.http.post<any>(url, objRequest).pipe(
            tap((res) => {
                this._chartResult$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    } 

    public getList2(maDVi:string): any {        
        const url = `${this.API_URL1}/dashboard/khaosat`;
        this._errorMessage.next('');
        const objRequest = {Filterdashboadkhaosat:{madvi: maDVi}};
        return this.http.post<any>(url, objRequest).pipe(
            tap((res) => {
                this._chartResult$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    } 

    public getList3(maDVi:string): any {        
        const url = `${this.API_URL1}/dashboard/thoigiancapdien`;
        this._errorMessage.next('');
        const objRequest = {Filtertgcd:{donViQuanLy: maDVi}};
        return this.http.post<any>(url, objRequest).pipe(
            tap((res) => {
                this._chartResult$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    } 



    public getListHSo(maDViQLy: string, maYCau: string): any {
        const url = `${this.API_URL}/listhso`;
        this._errorMessage.next('');
        const objRequest = {maDViQLy: maDViQLy, maYCau: maYCau};
        return this.http.post<any>(url, objRequest).pipe(
            tap((res) => {
                this._items$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                console.log(err);                
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    } 
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
}