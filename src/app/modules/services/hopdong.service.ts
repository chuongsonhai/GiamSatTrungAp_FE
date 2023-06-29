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
import { HopDong } from '../models/base.model';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class HopDongService extends TableService<HopDong> implements OnDestroy {
    API_URL = `${environment.apiUrl}/hopdongdien`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }
    public formGroup: FormGroup;
    public formGroupMBD:FormGroup;
    public dodemTable: FormGroup;
    public formArrayDDDN:FormArray;

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

    public getPdf(id: number): any {
        const url = `${this.API_URL}/getpdf/${id}`;
        this._errorMessage.next('');
        return this.http.get<any>(url).pipe(
            catchError(err => {
                this.toastr.error("Chưa lập hợp đồng");
                this._errorMessage.next(err);
                console.log(err);              
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    public detail(maDViQLy: string, maYCau: string): any {
        const url = `${this.API_URL}/detail`;
        this._errorMessage.next('');
        var obj = {maDViQLy: maDViQLy, maYCau: maYCau};
        return this.http.post<any>(url, obj).pipe(
            catchError(err => {
                this.toastr.error("Chưa lập hợp đồng");
                this._errorMessage.next(err);
                console.log(err);              
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    notify(item: any): Observable<any> {
        this._isLoading$.next(true);
        this._errorMessage.next('');        
        const url = this.API_URL + '/notify';        
        return this.http.post(url, item).pipe(
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

