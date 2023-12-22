// tslint:disable:variable-name
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { PaginatorState } from '../models/paginator.model';
import { ITableState, TableResponseModel } from '../models/table.model';
import { BaseModel } from '../models/base.model';
import { SortState } from '../models/sort.model';
import { GroupingState } from '../models/grouping.model';
import { environment } from '../../../../../environments/environment';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { off } from 'process';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
  currentPage: undefined
};

export abstract class TableService<T> {
   protected http: HttpClient;
  // API URL has to be overrided
  API_URL = `${environment.apiUrl}/endpoint`;
  API_URL1 = `${environment.apiUrl}/EmailZalo`;
  API_URL2 = `${environment.apiUrl}/users`;
  constructor(http: HttpClient, private authService: AuthenticationService, protected toastr: ToastrService) {
    this.http = http;
  }

  // CREATE
  // server should return the object with ID
  create(item: any): Observable<any> { 
    const url = `${this.API_URL}`;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post<any>(url, item).pipe(
      catchError(err => {        
        this._errorMessage.next(err);
        console.error('CREATE ITEM', err);        
        return of(undefined);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // READ (Returning filtered list of entities)
  public find(tableState: any): Observable<TableResponseModel<T>> {
    const url = this.API_URL + '/filter';
    this._errorMessage.next('');
    return this.http.post<TableResponseModel<T>>(url, tableState).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 403) {
          this.authService.logout();
          location.reload();
          return of(undefined);
        }
        this._errorMessage.next(err.message);
        console.error('FIND ITEMS', err);
        return of({ data: [], total: 0, success: false, error: "", message: "" });
      })
    );
  }

  getItemById(key: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${key}`;
    return this.http.get<any>(url).pipe(
      catchError(err => {        
        this._errorMessage.next(err);
        console.error('GET ITEM BY ID', key, err);
        return of({ ID: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  getItemByIduser(key: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL1}/${key}`;
    return this.http.get<any>(url).pipe(
      catchError(err => {        
        this._errorMessage.next(err);
        console.error('GET ITEM BY ID', key, err);
        return of({ ID: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }


  // UPDATE
  update(item: any): Observable<any> {
    const url = `${this.API_URL}`;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.put(url, item).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('UPDATE ITEM', err);        
        return of(undefined);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }  

  public fetch() {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find(this._tableState$.value)
      .pipe(
        tap((res: TableResponseModel<T>) => {
          this._items$.next(res.data);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              res.total
            ),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
          const itemIds = this._items$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
            return item.ID;
          });
          this.patchStateWithoutFetch({
            grouping: this._tableState$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }

  public setDefaults() {
    this.patchStateWithoutFetch({ filter: {} });
    this.patchStateWithoutFetch({ sorting: new SortState() });
    this.patchStateWithoutFetch({ grouping: new GroupingState() });
    this.patchStateWithoutFetch({ searchTerm: '' });
    this.patchStateWithoutFetch({
      paginator: new PaginatorState()
    });
    this._isFirstLoading$.next(true);
    this._isLoading$.next(true);
    this._tableState$.next({
      filter: {},
      paginator: new PaginatorState(),
      sorting: new SortState(),
      searchTerm: "",
      grouping: new GroupingState(),
      entityId: undefined,
      currentPage: undefined
    });
    this._errorMessage.next('');
  }

  // Base Methods
  public patchState(patch: Partial<ITableState>) {
    this.patchStateWithoutFetch(patch);
    this.fetch();
  }

  patchStateWithoutFetch(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }

  public ITableState(patch: Partial<ITableState>): ITableState {
    const newState = Object.assign(this._tableState$.value, patch);
    return newState;
  }

   // Private fields
   protected _items$ = new BehaviorSubject<T[]>([]);
   protected _isLoading$ = new BehaviorSubject<boolean>(false);
   protected _isFirstLoading$ = new BehaviorSubject<boolean>(true);
   protected _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
   protected _errorMessage = new BehaviorSubject<string>('');
   protected _subscriptions: Subscription[] = [];
 
   // Getters
   get items$() {
     return this._items$.asObservable();
   }
   get isLoading$() {
     return this._isLoading$.asObservable();
   }
 
   public setIsLoading$(status: boolean) {
     this._isFirstLoading$.next(status);
   }
   get isFirstLoading$() {
     return this._isFirstLoading$.asObservable();
   }
   get errorMessage$() {
     return this._errorMessage.asObservable();
   }
   get subscriptions() {
     return this._subscriptions;
   }
   // State getters
   get paginator() {
     return this._tableState$.value.paginator;
   }
   get filter() {
     return this._tableState$.value.filter;
   }
   get sorting() {
     return this._tableState$.value.sorting;
   }
   get searchTerm() {
     return this._tableState$.value.searchTerm;
   }
   get grouping() {
     return this._tableState$.value.grouping;
   }
}
