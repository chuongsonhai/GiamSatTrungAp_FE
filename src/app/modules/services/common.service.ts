import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';

import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';

import { LyDo, Module } from 'src/app/_models/module';
import { Organization } from '../models/organization.model';
import { TroNgai } from '../models/trongai.model';
import { CongViec } from '../models/congviec.model';
import { CauHinhCViec, NhanSu, NhanVien, BoPhan } from '../models/base.model';
import { Select2OptionData } from 'ng-select2';
import { CapDienAp } from '../models/capdienap.model';


@Injectable({
    providedIn: 'root'
})

export class CommonService {
    protected _isLoading$ = new BehaviorSubject<boolean>(false);
    protected _isFirstLoading$ = new BehaviorSubject<boolean>(true);
    protected _errorMessage = new BehaviorSubject<string>('');
    protected toastr: ToastrService;
    private _subscriptions: Subscription[] = [];

    API_URL = `${environment.apiUrl}/common`;
    protected http: HttpClient;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        this.http = http;
    }

    public getModules(): any {
        const url = this.API_URL + '/modules';
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url, { params: objRequest }).pipe(
            tap((res) => {
                this._modules$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }

    public getLyDos(nhom: number): any {
        const url = this.API_URL + '/lydos/' + nhom;
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url, { params: objRequest }).pipe(
            tap((res) => {
                this._lydos$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }

    public getDonVis(): any {
        const url = this.API_URL + '/organizations';
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url, { params: objRequest }).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }

    public getBoPhans(orgCode: string): any {        
        const url = `${this.API_URL}/bophans/${orgCode}`;
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url, { params: objRequest }).pipe(
            tap((res) => {
                this._bophans$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }

    public getSelect2BoPhans(orgCode: string): any {        
        const url = `${this.API_URL}/select2bophans/${orgCode}`;
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url, { params: objRequest }).pipe(
            tap((res) => {
                this._select2bophans$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }

    public getNhanViens(maDVi: string, maBPhan: string): any {        
        const url = `${this.API_URL}/nhanviens/${maDVi}/${maBPhan}`;
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url, { params: objRequest }).pipe(
            tap((res) => {
                this._nhanviens$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    } 
    
    public getListNViens(maDonVi: string, maBPhan: string, truongBPhan: boolean = false): any {        
        const url = `${this.API_URL}/listnhanvien`;
        this._errorMessage.next('');
        const objRequest = {maDonVi: maDonVi, maBPhan: maBPhan, truongBPhan: truongBPhan};
        return this.http.post<any>(url, objRequest).pipe(
            tap((res) => {
                this._nhanviens$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    } 

    public getSelect2NhanViens(maDVi: string, maBPhan: string): any {        
        const url = `${this.API_URL}/select2nhanviens/${maDVi}/${maBPhan}`;
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url, { params: objRequest }).pipe(
            tap((res) => {
                this._select2nhanviens$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }  
    
    public getSelect2NhanVientts(maDVi: string, maBPhan: string): any {        
        const url = `${this.API_URL}/select2nhanvientts/${maDVi}/${maBPhan}`;
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url, { params: objRequest }).pipe(
            tap((res) => {
                this._select2nhanvientts$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }   

    public getStaffs(deptId: string): any {        
        const url = `${this.API_URL}/staffs/${deptId}`;
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url, { params: objRequest }).pipe(
            tap((res) => {
                this._nhansus$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }

    public getTroNgais(): any {
        const url = `${this.API_URL}/trongai`;
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url, { params: objRequest }).pipe(
            tap((res) => {
                this._trongais$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }

    public getCongViecs(): any {
        const url = `${this.API_URL}/congviec`;
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url, { params: objRequest }).pipe(
            tap((res) => {
                this._congviecs$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }

    public getCapDienAps(): any {
        const url = `${this.API_URL}/capdienaps`;
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url, { params: objRequest }).pipe(
            tap((res) => {
                this._capdienaps$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }

    public getPDF(path: string): any {
        const url = `${environment.apiUrl}/sitedata/GetByteArray1/?path=${path}`;
        this._errorMessage.next('');
        return this.http.get<any>(url).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }   
    
    public getPDF1(path: string): any {
        const url = `${environment.apiUrl}/sitedata/GetByteArray/?path=${path}`;
        this._errorMessage.next('');
        return this.http.get<any>(url).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    } 

    protected _capdienaps$ = new BehaviorSubject<CapDienAp[]>([]);

    get capdienaps$() {
        return this._capdienaps$.asObservable();
    }
    protected _bophans$ = new BehaviorSubject<BoPhan[]>([]);

    get bophans$() {
        return this._bophans$.asObservable();
    }
    protected _select2bophans$ = new BehaviorSubject<Array<Select2OptionData>>([]);

    get select2bophans$() {
        return this._select2bophans$.asObservable();
    }

    protected _nhanviens$ = new BehaviorSubject<NhanVien[]>([]);

    get nhanviens$() {
        return this._nhanviens$.asObservable();
    }

    protected _select2nhanviens$ = new BehaviorSubject<Array<Select2OptionData>>([]);

    get select2nhanviens$() {
        return this._select2nhanviens$.asObservable();
    }
    protected _select2nhanvientts$ = new BehaviorSubject<Array<Select2OptionData>>([]);

    get select2nhanvientts$() {
        return this._select2nhanvientts$.asObservable();
    }

    protected _configs$ = new BehaviorSubject<CauHinhCViec[]>([]);

    get configs$() {
        return this._configs$.asObservable();
    }

    protected _trongais$ = new BehaviorSubject<TroNgai[]>([]);

    get trongais$() {
        return this._trongais$.asObservable();
    }

    protected _modules$ = new BehaviorSubject<Module[]>([]);

    get modules$() {
        return this._modules$.asObservable();
    }

    protected _lydos$ = new BehaviorSubject<Select2OptionData[]>([]);

    get lydos$() {
        return this._lydos$.asObservable();
    }

    protected _donvis$ = new BehaviorSubject<Organization[]>([]);

    get donvis$() {
        return this._donvis$.asObservable();
    }    

    protected _nhansus$ = new BehaviorSubject<NhanSu[]>([]);

    get nhansus$() {
        return this._nhansus$.asObservable();
    }

    protected _histories$ = new BehaviorSubject<History[]>([]);

    get histories$() {
        return this._histories$.asObservable();
    }

    protected _congviecs$ = new BehaviorSubject<CongViec[]>([]);

    get congviecs$() {
        return this._congviecs$.asObservable();
    }

    get isLoading$() {
        return this._isLoading$.asObservable();
    }

    public setIsLoading$(status: boolean) {
        this._isFirstLoading$.next(status);
    }
    get isFirstLoading$() {
        return this._isFirstLoading$.asObservable();
    }
    get errorMessage$() {
        return this._errorMessage.asObservable();
    }
    get subscriptions() {
        return this._subscriptions;
    }
}