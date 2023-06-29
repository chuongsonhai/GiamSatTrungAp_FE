import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';
import { TableService, TableResponseModel, BaseModel, PaginatorState, SortState, GroupingState, ITableState } from '../../_metronic/shared/crud-table';

import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DvTienTrinh } from '../models/dvtientrinh.model';
import { catchError, finalize, tap } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TienTrinhService extends TableService<DvTienTrinh> implements OnDestroy {
    API_URL = `${environment.apiUrl}/tientrinh`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }
    
    protected _tientrinhs$ = new BehaviorSubject<DvTienTrinh[]>([]);

    get tientrinhs$() {
        return this._tientrinhs$.asObservable();
    }
    public getTienTrinh(mayeucau: string) : any {
        const url = `${this.API_URL}/getlist/${mayeucau}`;
        this._errorMessage.next('');
        return this.http.get<any>(url).pipe(
            tap((res) => {
                this._tientrinhs$.next(res.data);
            }),
            catchError(err => {
                this._errorMessage.next(err);
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
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

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }       
}

