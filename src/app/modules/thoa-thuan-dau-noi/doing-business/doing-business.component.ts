import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService, CongVanYeuCauService, TienTrinhService } from '../../services/base.service';
import { catchError, first } from 'rxjs/operators';
import { CongVanYeuCau } from '../../models/congvanyeucau.model';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-doing-business',
  templateUrl: './doing-business.component.html',
  styleUrls: ['./doing-business.component.scss']
})

export class DoingBusinessComponent implements OnInit, OnDestroy {
  @Input() maYeuCau: string;

  private subscriptions: Subscription[] = [];
  status: number;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);

  constructor(
    public commonService: CommonService,
    public service: TienTrinhService,
    private fb: FormBuilder,
    public modal: NgbActiveModal
  ) {
  }

  ngOnInit() {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 2000);
    if (this.maYeuCau) {
      this.isLoadingForm$.next(true);
      this.loadData();
      this.isLoadingForm$.next(false);
    }
  }

  loadData() {
    const sb = this.service.getTienTrinh(this.maYeuCau).pipe(
      first(),
      catchError((errorMessage) => {
        return of(undefined);
      })
    ).subscribe();

    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
