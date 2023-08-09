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
import { UpdateCauHinhCanhBaoComponent } from './update-cau-hinh-canh-bao/update-cau-hinh-canh-bao.component'; 
import { CauHinhCanhBaoService } from '../../services/cauhinhcanhbao.service';

@Component({
  selector: 'app-cau-hinh-canh-bao',
  templateUrl: './cau-hinh-canh-bao.component.html',
  styleUrls: ['./cau-hinh-canh-bao.component.scss']
})

export class CauHinhCanhBaoComponent implements OnInit, OnDestroy,
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
maLoaiCanhBao: number;
chuky:number;
private subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    public service:CauHinhCanhBaoService,
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
  this.filterGroup = this.fb.group({
    chuky: -1,
    maLoaiCanhBao: -1,
  });
}

// filter() {
//   const filter = {
//     maLoaiCanhBao: -1,
//     chuky: -1,
//     ID : -1,
//   };
//   this.service.patchState({ filter });
// }
// search
searchForm() {

}

search(searchTerm: string) {

}

filter() {
  const filter = {};
  const maLoaiCanhBao = this.filterGroup.get('maLoaiCanhBao').value;
  const chuky = this.filterGroup.get('chuky').value;
  if (maLoaiCanhBao) {
    filter['maLoaiCanhBao'] = maLoaiCanhBao;
  } else {
    filter['maLoaiCanhBao'] = -1;
  }
  
  
  if (chuky) {
    filter['chuky'] = chuky;
  }
  else {
    filter['chuky'] = -1;
  }
  this.service.patchState({ filter });

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
  const modalRef = this.modalService.open(UpdateCauHinhCanhBaoComponent, { size: 'lg' });
  modalRef.componentInstance.id = id;
  modalRef.result.then(
    () => {
      this.isLoadingForm$.next(true);
      this.filter();
      this.isLoadingForm$.next(false);
    }
  );
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

