import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { TableService } from "src/app/_metronic/shared/crud-table";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { environment } from "src/environments/environment";
import { ThongBao } from "../models/thongbao.model";

@Injectable({
    providedIn: 'root'
})
export class ThongBaoService extends TableService<ThongBao> implements OnDestroy {
    API_URL = `${environment.apiUrl}/thongbao`;
    constructor(@Inject(HttpClient) http, @Inject(AuthenticationService) authService, @Inject(ToastrService) toastr) {
        super(http, authService, toastr);
    }

    public getNotifies(item: any): any {
        const url = `${this.API_URL}/getnotifies`;
        this._errorMessage.next('');
        return this.http.post<any>(url, item).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.log(err);                
                return of({ data: [], total: 0, success: false, error: "", message: "" });
            })
        );
    } 
    
    updateStatus(tBaoIDs: number[]){
        this._isLoading$.next(true);
        this._errorMessage.next('');
        const url = this.API_URL + '/updatestatus';
        return this.http.post(url, {tBaoIDs: tBaoIDs}).pipe(
            catchError(err => {
                this._errorMessage.next(err);
                console.log(err);
                return of(undefined);
            }),
            finalize(() => this._isLoading$.next(false))
        );
    }
    
    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }       
}