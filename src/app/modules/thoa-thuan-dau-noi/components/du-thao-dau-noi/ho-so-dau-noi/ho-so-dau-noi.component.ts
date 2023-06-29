import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, merge, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { CongVanYeuCau } from 'src/app/modules/models/congvanyeucau.model';
import { BienBanDNData } from 'src/app/modules/models/thoathuandaunoi.model';
import { CommonService } from 'src/app/modules/services/common.service';
import { HoSoKemTheoService } from 'src/app/modules/services/hosokemtheo.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { ViewPdfComponent } from 'src/app/modules/share-component/view-pdf/view-pdf.component';

@Component({
  selector: 'app-ho-so-dau-noi',
  templateUrl: './ho-so-dau-noi.component.html',
  styleUrls: ['./ho-so-dau-noi.component.scss']
})
export class HoSoDauNoiComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  @Input() congVanYeuCau: CongVanYeuCau;
  @Input() bienBanDNData: BienBanDNData;

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    public HoSoKemTheoService: HoSoKemTheoService,
    public CommonService: CommonService,
    private confirmationDialogService: ConfirmationDialogService,
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.loadData();

  }
  loadData() {
    this.isLoadingForm$.next(true);
    const example = merge(
      this.HoSoKemTheoService.getListHSKT(this.congVanYeuCau.MaDViQLy, this.congVanYeuCau.MaYeuCau, 0)
    );

    this.isLoadingForm$.next(true);
    const subscribe = example.pipe(
      catchError(err => {
        return of(undefined);
      }),
      finalize(() => {
        this.isLoadingForm$.next(false);
      })).subscribe();
    this.subscriptions.push(subscribe);
  }


  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  delete(id: number) {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn xoá hồ sơ?')
      .then((confirmed) => {
        if (confirmed) {
          this.isLoadingForm$.next(true);
          const example = merge(
            this.HoSoKemTheoService.deleteItem(id)
          );

          this.isLoadingForm$.next(true);
          const subscribe = example.pipe(
            catchError(err => {
              return of(undefined);
            }),
            finalize(() => {
              this.isLoadingForm$.next(false);
            })).subscribe();
          this.subscriptions.push(subscribe);

        }
      })

    this.loadData();
    this.isLoadingForm$.next(false);
  }

  upload(id: number) {

  }
  view(path: string) {
    this.CommonService.getPDF(path).subscribe((response) => {
      const modalRef = this.modalService.open(ViewPdfComponent, { size: 'xl' });
      modalRef.componentInstance.response = response;

      modalRef.result.then(
        () => {
          this.isLoadingForm$.next(true);
          this.isLoadingForm$.next(false);
        }
      );
    }), finalize(() => {
      setTimeout(() => {
        this.isLoadingForm$.next(false);
      }, 2000);
    })
  }

}
