import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, first, map, switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { UserModel } from '../_models/usermodel';
import { ResponseModel } from '../modules/models/response.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
    private authLocalStorageTicket = `${environment.appVersion}-${environment.USERDATA_KEY}-TICKET`;
    private currentUserSubject: BehaviorSubject<UserModel>;
    public currentUser: Observable<UserModel>;
    isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;
    
    url;

    constructor(private http: HttpClient, private toastr: ToastrService,) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem(this.authLocalStorageToken)));
        this.currentUser = this.currentUserSubject.asObservable();
        this.isLoading$ = this.isLoadingSubject.asObservable();
    }

    public get currentUserValue(): UserModel {
        if (this.currentUserSubject.value === null || this.currentUserSubject.value === undefined)
            this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem(this.authLocalStorageToken)));
        return this.currentUserSubject.value;
    }

    auth(ticket: string) {
        this.isLoadingSubject.next(true);
        return this.http.post(`${environment.apiUrl}/auth/authen`, { ticket }).pipe(
            map((auth: ResponseModel) => {
                if (localStorage.getItem(this.authLocalStorageToken)) {
                    localStorage.removeItem(this.authLocalStorageToken);
                }
                if (localStorage.getItem(this.authLocalStorageTicket)) {
                    localStorage.removeItem(this.authLocalStorageTicket);
                }
                if (!auth.success) {
                    return null;
                }
                let userdata = auth.data;
                if (!userdata.JwtToken) return null;
                localStorage.setItem(this.authLocalStorageToken, JSON.stringify(userdata));
                localStorage.setItem(this.authLocalStorageTicket, ticket);
                this.currentUserSubject.next(userdata);
                return userdata;
            }),
            catchError((errorMessage) => {
                return null;
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    login(username: string, password: string) {
        this.isLoadingSubject.next(true);
        return this.http.post(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
            map((auth: ResponseModel) => {                
                if (localStorage.getItem(this.authLocalStorageToken)) {
                    localStorage.removeItem(this.authLocalStorageToken);
                }
                if (localStorage.getItem(this.authLocalStorageTicket)) {
                    localStorage.removeItem(this.authLocalStorageTicket);
                }
                if (!auth.success) {
                    this.toastr.error(auth.message, "Thông báo");
                    return null;
                }
                let userdata = auth.data;
                if (!userdata.JwtToken) return null;
                localStorage.setItem(this.authLocalStorageToken, JSON.stringify(userdata));
                this.currentUserSubject.next(userdata);
                return userdata;
            }),
            catchError((errorMessage) => {
                if (localStorage.getItem(this.authLocalStorageToken)) {
                    localStorage.removeItem(this.authLocalStorageToken);
                }
                if (localStorage.getItem(this.authLocalStorageTicket)) {
                    localStorage.removeItem(this.authLocalStorageTicket);
                }
                this.toastr.error(errorMessage, "Thông báo");
                return null;
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    logout() {
        if (localStorage.getItem(this.authLocalStorageToken)) {
            // remove user from local storage to log user out
            localStorage.removeItem(this.authLocalStorageToken);
            this.currentUserSubject.next(null);
        }
        if (localStorage.getItem(this.authLocalStorageTicket)) {
            // remove user from local storage to log user out
            localStorage.removeItem(this.authLocalStorageTicket);
            window.location.href = environment.ssoLogout;
        }
    }

    public async tryRefreshingTokens(token: string, refreshToken: string): Promise<boolean> {
        let isRefreshSuccess: boolean;
        try {
            const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });
            const response = this.http.post(`${environment.apiUrl}/api/token/refresh`, credentials, {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                }),
                observe: 'response'
            }).toPromise();
            const userdata = (<any>response).body.data;
            localStorage.setItem(this.authLocalStorageToken, JSON.stringify(userdata));
            isRefreshSuccess = true;
        }
        catch (ex) {
            isRefreshSuccess = false;
        }
        return isRefreshSuccess;
    }

    isSysAdmin(): boolean {
        const user = this.currentUserValue;
        var roles = user.Roles;
        var permisioncodes = [];
        roles.forEach(p => {
            p.Permissions.forEach(pr => {
                if (permisioncodes.indexOf(pr) < 0)
                    permisioncodes.push(pr);
            });
        });
        var isSysAdmin = roles.find(r => r.isSysadmin);
        return isSysAdmin && isSysAdmin !== undefined;
    }

    checkPermission(permission: string): boolean {
        const user = this.currentUserValue;
        var roles = user.Roles;
        var permisioncodes = [];
        roles.forEach(p => {
            p.Permissions.forEach(pr => {
                if (permisioncodes.indexOf(pr) < 0)
                    permisioncodes.push(pr);
            });
        });
        return permisioncodes.indexOf(permission) >= 0;
    }
}