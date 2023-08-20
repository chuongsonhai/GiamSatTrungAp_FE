import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';

import { TableResponseModel, TableService } from '../../_metronic/shared/crud-table';

import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CanhBaoGiamSat, KhachHangGiamSat, NguoiNhanCanhBao } from '../models/canhbaogiamsat.model';
import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CauHinhNguoiNhanCanhBaoService extends TableService<NguoiNhanCanhBao> implements OnDestroy {
    API_URL = `${environment.apiUrl}/EmailZalo`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }
    
    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
   
}

