import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";

import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import { FlatTreeControl } from "@angular/cdk/tree";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { finalize } from "rxjs/operators";
import { GroupingState, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, ISortView, IUpdateStatusForSelectedAction, PaginatorState, SortState } from "src/app/_metronic/shared/crud-table";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { CauHinhDKService } from "../../services/cauhinhdk.service";
import { TienTrinhService } from "../../services/base.service";


@Component({
  selector: 'app-thong-ke-tien-do',
  templateUrl: './thong-ke-tien-do.component.html',
  styleUrls: ['./thong-ke-tien-do.component.scss']
})
export class ThongKeTienDoComponent implements OnInit,
OnDestroy,
IDeleteAction,
IDeleteSelectedAction,
IFetchSelectedAction,
IUpdateStatusForSelectedAction,
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
  public service: TienTrinhService
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
    keyword: [''],
    maYCau:['']
  });
  try {
    this.subscriptions.push(this.filterGroup.controls.keyword.valueChanges.subscribe(() => this.filter()));      
  } catch (error) {
  }
}

filter() {
  const filter = {};
  const keyword = this.filterGroup.get('keyword').value;
  if (keyword) {
    filter['keyword'] = keyword;
  }
  const maYCau = this.filterGroup.get('maYCau').value;
  if (maYCau) {
    filter['maYCau'] = maYCau;
  }
  this.service.patchState({ filter });
}

exportExcel() {
  this.isLoadingForm$.next(true);
  const filter = {};
  const keyword = this.filterGroup.get('keyword').value;
  if (keyword) {
    filter['keyword'] = keyword;
  }
  const maYCau = this.filterGroup.get('maYCau').value;
  if (maYCau) {
    filter['maYCau'] = maYCau;
  }
  this.service.exportExcel(filter).subscribe((response) => {
    if(response === undefined || response === null){
      this.isLoadingForm$.next(false);
    }
    else{
      var binary_string = window.atob(response);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      let blob = new Blob([bytes.buffer], { type: 'application/vnd.openxmlformats-ficedocument.spreadsheetml.sheet;charset=utf-8' });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download="Thống kê tiến độ.xlsx";
      link.click();

      this.isLoadingForm$.next(false);
    }
  });
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
// actions  
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
