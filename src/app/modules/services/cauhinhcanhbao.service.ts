import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';
import { TableService } from '../../_metronic/shared/crud-table';

import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/_models/role';
import { CauHinhCanhBao, SystemConfig } from '../models/systemconfig.model';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CauHinhCanhBaoService extends TableService<CauHinhCanhBao> implements OnDestroy {
    API_URL = `${environment.apiUrl}/cauhinhcanhbao`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }        

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
    updateCauHinh( item: any): Observable<any> {
        const url = `${environment.apiUrl}/cauhinhcanhbao/edit`;
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const formData = new FormData();
        formData.append('data', JSON.stringify(item));
        return this.http.post<any>(url, formData, { reportProgress: true }).pipe(            
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

