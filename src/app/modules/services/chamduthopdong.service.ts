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
import { ChamDutHopDong } from '../models/chamduthopdong.model';


@Injectable({
    providedIn: 'root'
})
export class ChamDutHopDongService extends TableService<ChamDutHopDong> implements OnDestroy {
    API_URL = `${environment.apiUrl}/chamduthopdong`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
    // UPDATE Status

    public getItem(id: number): any {
        const url = `${this.API_URL}/${id}`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        return this.http.get<any>(url).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.error('GET ITEM BY ID', id, err);
                return of({ ID: undefined });
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }
}

