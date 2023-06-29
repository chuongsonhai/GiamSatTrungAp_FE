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
import { ResponseModel } from '../models/response.model';

import { Identifiers } from '@angular/compiler';
import { HoSoKemTheo } from '../models/hosokemtheo.model';


@Injectable({
    providedIn: 'root'
})
export class HoSoKemTheoService extends TableService<HoSoKemTheo> implements OnDestroy {
    API_URL = `${environment.apiUrl}/hosokemtheo`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    protected _hoSoKemTheos$ = new BehaviorSubject<HoSoKemTheo[]>([]);

    get hoSoKemTheos$() {
        return this._hoSoKemTheos$.asObservable();
    }

    public getListHSKT(maDVQL:string,maYC:string,loai:number): any {
        const url = `${this.API_URL}/getListHSKT/${maDVQL}/${maYC}/${loai}`;
        this._errorMessage.next('');
        const objRequest = {
        };
        return this.http.get<any>(url, { params: objRequest }).pipe(
            tap((res) => {
                this._hoSoKemTheos$.next(res.data);
            }),
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }

    createHSKT(File: File, item: any): Observable<any> {
        const url = `${this.API_URL}/createHSKT`;
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
    updateHSKT(File: File, item: any): Observable<any> {
        const url = `${this.API_URL}/updateHSKT`;
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
    public getItem(id: number): any {
        const url = `${this.API_URL}/GetByID/${id}`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.get<any>(url).pipe(
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of({ ID: undefined });
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }    
    
    public deleteItem(id: number): any {
        const url = `${this.API_URL}/delete/${id}`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.get<any>(url).pipe(
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

