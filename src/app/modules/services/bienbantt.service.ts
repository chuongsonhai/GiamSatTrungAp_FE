import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';

import { exhaustMap, map } from 'rxjs/operators';
import { TableService, TableResponseModel, BaseModel, PaginatorState, SortState, GroupingState, ITableState } from '../../_metronic/shared/crud-table';
import { Router } from '@angular/router';

import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { BienBanTT } from '../models/bienbantt.model';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class BienBanTTService extends TableService<BienBanTT> implements OnDestroy {
    API_URL = `${environment.apiUrl}/bienbantt`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }
    BienBanTTForm:FormGroup;
    ChiTietThietBiTreoForm:FormGroup;
    ChiTietThietBiThaoForm:FormGroup;
    fileToUpload: any;
    dataTableTreo:FormGroup;
    dataTableThao:FormGroup;

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
                return of({ ID: undefined });
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

    public getPdf(id: number): any {
        const url = `${this.API_URL}/getpdf/${id}`;
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url).pipe(
            catchError(err => {
                this.toastr.error("Chưa có biên bản treo tháo trên CMIS");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    public getCongTo(data : any): any{
        const url = `${environment.apiUrl}/thongtintbi/thongtincto`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.post<any>(url,  data, { reportProgress: true }).pipe(            
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }
    public getMBD(data : any): any{
        const url = `${environment.apiUrl}/thongtintbi/thongtinti`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.post<any>(url,  data, { reportProgress: true }).pipe(            
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }
    public getMBDA(data : any): any{
        const url = `${environment.apiUrl}/thongtintbi/thongtintu`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.post<any>(url,  data, { reportProgress: true }).pipe(            
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
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }

    signNVien(item: any): Observable<any> {
        const url = `${this.API_URL}/signnvien`;
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
    
    public detail(id: number): any {
        const url = `${this.API_URL}/getpdf/${id}`;
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
    public detailList(maYC: string): any {
        const url = `${this.API_URL}/DetailPdf/${maYC}`;
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

    createBBTT(data:string): Observable<any> {
        const url = `${this.API_URL}/CreateBBTT`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const formData = new FormData();
        formData.append('data',data);
        return this.http.post<any>(url,  formData, { reportProgress: true }).pipe(            
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }
    updateBBTT(data:string): Observable<any> {
        const url = `${this.API_URL}/UpdateBBTT/`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const formData = new FormData();
        formData.append('data',data);
        return this.http.post<any>(url,  formData, { reportProgress: true }).pipe(            
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
        this._isLoading$.next(true);
        this._errorMessage.next('');        
        const url = this.API_URL + '/notify';        
        return this.http.post(url, item).pipe(
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of([]);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    } 
}
