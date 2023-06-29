import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';
import { TableService } from '../../_metronic/shared/crud-table';

import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/_models/role';

@Injectable({
    providedIn: 'root'
})
export class RoleService extends TableService<Role> implements OnDestroy {
    API_URL = `${environment.apiUrl}/roles`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }        

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}

