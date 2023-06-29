import { Injectable, Inject, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TableService, TableResponseModel, BaseModel, PaginatorState, SortState, GroupingState, ITableState } from '../../_metronic/shared/crud-table';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { PhanCongTC } from '../models/phancongtc.model';

@Injectable({
    providedIn: 'root'
})
export class PhanCongKTService extends TableService<PhanCongTC> implements OnDestroy {
    API_URL = `${environment.apiUrl}/phancongkt`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    public getData(maYeuCau: string, loai: number): Observable<any> {
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const body = { maYeuCau: maYeuCau, loai: loai };
        const url = this.API_URL + '/getdata';
        return this.http.post(url, body).pipe(
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    } 
    
    phanCongLai(item: any): Observable<any> {
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
}

