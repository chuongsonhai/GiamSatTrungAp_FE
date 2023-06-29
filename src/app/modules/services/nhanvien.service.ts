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
import { NhanVien } from '../models/nhanvien.model';

@Injectable({
    providedIn: 'root'
})
export class NhanVienService extends TableService<NhanVien> implements OnDestroy {

    API_URL = `${environment.apiUrl}/nhanvien`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }

    public getList(maDonVi: string, maBPhan: string, truongBPhan: boolean): any {
        const url = `${this.API_URL}/gettngaicviecs`;
        this._errorMessage.next('');
        const objRequest = {maDonVi: maDonVi, maBPhan: maBPhan, truongBPhan: truongBPhan};
        return this.http.post<any>(url, objRequest).pipe(
            catchError(err => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại");
                this._errorMessage.next(err);
                console.log(err);                
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
