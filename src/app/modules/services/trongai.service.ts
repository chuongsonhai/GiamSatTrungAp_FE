import { Injectable, Inject, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';
import { TableService, TableResponseModel, BaseModel, PaginatorState, SortState, GroupingState, ITableState } from '../../_metronic/shared/crud-table';

import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { TroNgai } from '../models/trongai.model';

@Injectable({
    providedIn: 'root'
})
export class TroNgaiService extends TableService<TroNgai> implements OnDestroy {
    API_URL = `${environment.apiUrl}/trongai`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }   
    
    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }    
}