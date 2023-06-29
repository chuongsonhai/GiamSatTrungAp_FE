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
import { HoSoYeuCau } from '../models/base.model';


@Injectable({
    providedIn: 'root'
})
export class HoSoYeuCauService extends TableService<HoSoYeuCau> implements OnDestroy {
    API_URL = `${environment.apiUrl}/hosogiayto`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    protected _items$ = new BehaviorSubject<HoSoYeuCau[]>([]);

    get items$() {
        return this._items$.asObservable();
    }

    public getListHSoGTo(maDViQLy: string, maYCau: string): any {
        const url = `${this.API_URL}/filter`;
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
    
    public getList(maDViQLy: string, maYCau: string): any {
        const url = `${this.API_URL}/getlist`;
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
    
    public getByLoai(maDViQLy: string, maYCau: string,loaiHS:string): any {
        const url = `${this.API_URL}/GetByLoai`;
        this._errorMessage.next('');
        const objRequest = {maDViQLy: maDViQLy, maYCau: maYCau,loaiHS:loaiHS};
        return this.http.post<any>(url, objRequest).pipe(
            tap((res) => {
              
            }),
            catchError(err => {
                this._errorMessage.next(err);
                console.log(err);                
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }   
    public getDetail(id: number): any {
        const url = `${this.API_URL}/detail/${id}`;
        this._errorMessage.next('');
        return this.http.get<any>(url).pipe(
            catchError(err => {
                this.toastr.error("Hồ sơ không có hoặc đã bị xóa trên hệ thống");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    public signDocs(maDViQLy: string, maYCau: string, ids: number[]) : any {
        const url = `${this.API_URL}/signdocs`;
        this._errorMessage.next('');
        const objRequest = {maDViQLy: maDViQLy, maYCau: maYCau, ids: ids};
        return this.http.post<any>(url, objRequest).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.log(err);                
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }

    public download(id: any): any {
        const url = `${this.API_URL}/download/${id}`;
        this._errorMessage.next('');
        return this.http.post<any>(url, {}).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }    
}

