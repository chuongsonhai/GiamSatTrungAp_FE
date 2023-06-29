import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';
import { TableService } from '../../_metronic/shared/crud-table';

import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/_models/role';
import { CauHinhDongBo } from '../models/cauhinhdongbo.model';

@Injectable({
    providedIn: 'root'
})
export class CauHinhDongBoService extends TableService<CauHinhDongBo> implements OnDestroy {
    API_URL = `${environment.apiUrl}/cauhinhdongbo`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }        

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}

