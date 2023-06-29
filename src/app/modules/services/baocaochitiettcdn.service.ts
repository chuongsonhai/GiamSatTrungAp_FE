import { Injectable, Inject, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TableService } from '../../_metronic/shared/crud-table';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ReportData } from '../models/reportdata.model';
import { BaoCaoTTDN } from '../models/baocaottdn.model';
import { BaoCaoChiTietTCDN } from '../models/baocaochitietTCDN.model';

@Injectable({
    providedIn: 'root'
})
export class BaoCaoChiTietTCDNService extends TableService<BaoCaoChiTietTCDN> implements OnDestroy {
    API_URL = `${environment.apiUrl}/baocaochitiettcdn`;
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

