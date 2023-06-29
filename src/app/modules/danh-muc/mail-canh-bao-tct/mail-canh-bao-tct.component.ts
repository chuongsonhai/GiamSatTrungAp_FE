import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, timeout } from 'rxjs/operators';
import {
  GroupingState,
  ICreateAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IEditAction,
  IFetchSelectedAction,
  IFilterView,
  IGroupingView,
  ISearchView,
  ISortView,
  IUpdateStatusForSelectedAction,
  PaginatorState,
  SortState,
} from '../../../_metronic/shared/crud-table';
import { MailCanhBaoTCTService } from '../../services/mailcanhbaotct.service';
import { EditMailComponent } from './edit-mail/edit-mail.component';

@Component({
  selector: 'app-mail-canh-bao-tct',
  templateUrl: './mail-canh-bao-tct.component.html',
  styleUrls: ['./mail-canh-bao-tct.component.scss']
})
export class MailCanhBaoTctComponent implements
OnInit,
OnDestroy,
IDeleteAction,
IDeleteSelectedAction,
IFetchSelectedAction,
IUpdateStatusForSelectedAction,
ISortView,
IFilterView,
IGroupingView,
ISearchView,
IFilterView {
paginator: PaginatorState;
sorting: SortState;
grouping: GroupingState;
isLoading: boolean;
filterGroup: FormGroup;
searchGroup: FormGroup;
private subscriptions: Subscription[] = [];

constructor(
  private fb: FormBuilder,
  private modalService: NgbModal,
  public MailCanhBaoTCTService: MailCanhBaoTCTService
) {

}

// angular lifecircle hooks
ngOnInit(): void {
  this.filterForm();
  this.searchForm();

  const sb = this.MailCanhBaoTCTService.isLoading$.subscribe(res => this.isLoading = res);
  this.subscriptions.push(sb);
  this.grouping = this.MailCanhBaoTCTService.grouping;
  this.paginator = this.MailCanhBaoTCTService.paginator;
  this.sorting = this.MailCanhBaoTCTService.sorting;
  this.MailCanhBaoTCTService.fetch();
}

ngOnDestroy() {
  this.subscriptions.forEach((sb) => sb.unsubscribe());
}

// filtration
filterForm() {    
}

filter() {
  const filter = {};    
  this.MailCanhBaoTCTService.patchState({ filter });
}
// search
searchForm() {
  this.searchGroup = this.fb.group({
    searchTerm: [''],
  });
  const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
    .pipe(debounceTime(150), distinctUntilChanged())
    .subscribe((val) => this.search(val));
  this.subscriptions.push(searchEvent);
}

search(searchTerm: string) {
  this.MailCanhBaoTCTService.patchState({ searchTerm });
}

// sorting
sort(column: string) {
  const sorting = this.sorting;
  const isActiveColumn = sorting.column === column;
  if (!isActiveColumn) {
    sorting.column = column;
    sorting.direction = 'asc';
  } else {
    sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
  }
  this.MailCanhBaoTCTService.patchState({ sorting });
}

// pagination
paginate(paginator: PaginatorState) {
  this.MailCanhBaoTCTService.patchState({ paginator });
}  
create() {
  this.edit(undefined);
}
edit(id: number) {
  const modalRef = this.modalService.open(EditMailComponent, { size: 'lg' });
  modalRef.componentInstance.id = id;
  modalRef.result.then(() =>
    this.filter(),
    () => { }
  );
}

delete(id: number) {
}

deleteSelected() {
}

updateStatusForSelected() {
}

fetchSelected() {

}
}
