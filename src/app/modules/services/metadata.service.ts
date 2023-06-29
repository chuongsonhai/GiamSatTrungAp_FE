import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';

import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { TienTrinhData } from '../models/tientrinhdata.model';
import { ThongTinNhomGia } from '../models/gianhomdata.model';
import { ThongTinUQ } from '../models/thongtinuq.model';
import { Select2OptionData } from 'ng-select2';

@Injectable({
    providedIn: 'root'
})

export class MetadataService {
    protected _isLoading$ = new BehaviorSubject<boolean>(false);
    protected toastr: ToastrService;
    protected _errorMessage = new BehaviorSubject<string>('');

    API_URL = `${environment.apiUrl}/metadata`;
    protected http: HttpClient;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        this.http = http;
    }
    
    public getTNgaiCViecs(maCViec: string, maTNgai: string): any {
        const url = `${this.API_URL}/gettngaicviecs`;
        this._errorMessage.next('');
        const objRequest = {maCViec: maCViec, maTNgai: maTNgai};
        return this.http.post<any>(url, objRequest).pipe(
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);                
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }    

    public getTienTrinhs(maYCau: string, nghiemThu: boolean = false, truongBPhan: boolean = false): any {
        const url = `${this.API_URL}/tientrinhs`;
        var request = {maYCau: maYCau, nghiemThu: nghiemThu, truongBPhan: truongBPhan};         
        this._errorMessage.next('');
        return this.http.post<any>(url, request).pipe(        
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);                
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }

    public getCongViecs(maYCau: string, maCViec: string): any {
        const url = `${this.API_URL}/congviecs/${maYCau}/${maCViec}`;
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url, { params: objRequest }).pipe(
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);                
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }   
    
    protected _listKT$ = new BehaviorSubject<Array<Select2OptionData>>([]);

    get listKT$() {
        return this._listKT$.asObservable();
    }
    protected _listBT$ = new BehaviorSubject<Array<Select2OptionData>>([]);

    get listBT$() {
        return this._listBT$.asObservable();
    }
    protected _listCD$ = new BehaviorSubject<Array<Select2OptionData>>([]);
    get listCD$() {
        return this._listCD$.asObservable();
    }
    protected _listTD$ = new BehaviorSubject<Array<Select2OptionData>>([]);

    get listTD$() {
        return this._listTD$.asObservable();
    }
    public getGiaNhoms(maCapDAp :string): any {
        const url = `${this.API_URL}/listgianhom/${maCapDAp}`;
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url, { params: objRequest }).pipe(
            tap((res) => {
                this._listKT$.next(res.data.ListKT);
                this._listBT$.next(res.data.ListBT);
                this._listCD$.next(res.data.ListCD);
                this._listTD$.next(res.data.ListTD);
            }),
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);                
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }

    protected _listUQ$ = new BehaviorSubject<ThongTinUQ[]>([]);

    get listUQ$() {
        return this._listUQ$.asObservable();
    }
    public getUQs(): any {
        const url = `${this.API_URL}/listuq`;
        this._errorMessage.next('');
        const objRequest = {};
        return this.http.get<any>(url, { params: objRequest }).pipe(
            tap((res) => {
                this._listUQ$.next(res.data);
            }),
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);                
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }
}