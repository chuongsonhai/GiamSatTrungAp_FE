import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';

import { TableService } from '../../_metronic/shared/crud-table';

import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { BoPhan } from '../models/base.model';
import { BehaviorSubject, of } from 'rxjs';
import { catchError , finalize, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BoPhanService extends TableService<BoPhan> implements OnDestroy {
    API_URL = `${environment.apiUrl}/bophan`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }   

    protected _boPhan$ = new BehaviorSubject<BoPhan[]>([]);

    get boPhan$() {
        return this._boPhan$.asObservable();
    }

    public getListBoPhan(maDVQL:string): any {
        const url = `${this.API_URL}/GetByMaDV/${maDVQL}`;
        this._errorMessage.next('');
        const objRequest = {
        };
        return this.http.get<any>(url, { params: objRequest }).pipe(
            tap((res) => {
                this._boPhan$.next(res.data);
            }),
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }
    
    public getbymabp(maDViQLy: string,maBPhan:string): any {
        const url = `${this.API_URL}/GetByMaBP/${maDViQLy}/${maBPhan}`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.get<any>(url).pipe(
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of({ maBPhan: undefined });
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }  

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    } 

}