import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString, LayoutService } from '../../../_metronic/core';
import { DatePipe, formatDate } from '@angular/common';
import * as _moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupingState, IFetchSelectedAction, IFilterView, IGroupingView, ISortView, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { CauHinhCanhBaoService } from '../../services/cauhinhcanhbao.service';
import { LogCanhbaoService } from '../../services/logcanhbao.service';

@Component({
  selector: 'app-log-canh-bao',
  templateUrl: './log-canh-bao.component.html',
  styleUrls: ['./log-canh-bao.component.scss']
})

export class LogCanhBaoComponent implements OnInit, OnDestroy,
IFetchSelectedAction,
ISortView,
IFilterView,
IGroupingView,
IFilterView {
paginator: PaginatorState;
sorting: SortState;
grouping: GroupingState;
isLoading: boolean;
filterGroup: FormGroup;
private subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    public service: LogCanhbaoService,
  ) { 

  }

 // angular lifecircle hooks
 ngOnInit(): void {
  this.filterForm();
  const sb = this.service.isLoading$.subscribe(res => this.isLoading = res);
  this.subscriptions.push(sb);
  this.grouping = this.service.grouping;
  this.paginator = this.service.paginator;
  this.sorting = this.service.sorting;
  this.filter();
}

ngOnDestroy() {
  this.subscriptions.forEach((sb) => sb.unsubscribe());
}

// filtration
filterForm() {
}

filter() {
  const filter = {};
  this.service.patchState({ filter });
}
// search
searchForm() {

}

search(searchTerm: string) {

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

}

// pagination
paginate(paginator: PaginatorState) {
  this.service.patchState({ paginator });
}

create() {
  this.update(undefined);
}

// actions
update(id: string) {
  
}
// form actions

delete(id: number) {
}

deleteSelected() {
}

updateStatusForSelected() {
}

fetchSelected() {

}

isLoadingForm$ = new BehaviorSubject<boolean>(false);

}


