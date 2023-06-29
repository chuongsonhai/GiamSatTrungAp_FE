import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';

import { TableService, TableResponseModel, BaseModel, PaginatorState, SortState, GroupingState, ITableState } from '../../_metronic/shared/crud-table';

import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ChartResponseModel } from '../models/response.model';
import { CongVanYeuCau } from '../models/base.model';

@Injectable({
    providedIn: 'root'
})
export class BaoCaoThongKeService extends TableService<CongVanYeuCau> implements OnDestroy{
    API_URL = `${environment.apiUrl}/baocaothongke`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }
    
    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }          
    public exportExcel(filter: any): any {
        const url = `${this.API_URL}/export`;
        this._errorMessage.next('');
        return this.http.post<any>(url, filter).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }  

  

   
}