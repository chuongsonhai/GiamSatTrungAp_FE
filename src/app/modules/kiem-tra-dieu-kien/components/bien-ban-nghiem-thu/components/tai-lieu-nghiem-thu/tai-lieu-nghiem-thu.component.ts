import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, merge, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { CommonService } from 'src/app/modules/services/common.service';
import { HoSoKemTheoService } from 'src/app/modules/services/hosokemtheo.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { ViewPdfComponent } from 'src/app/modules/share-component/view-pdf/view-pdf.component';
import { UpdateTaiLieuNghiemThuComponent } from './update-tai-lieu-nghiem-thu/update-tai-lieu-nghiem-thu.component';

@Component({
  selector: 'app-tai-lieu-nghiem-thu',
  templateUrl: './tai-lieu-nghiem-thu.component.html',
  styleUrls: ['./tai-lieu-nghiem-thu.component.scss']
})
export class TaiLieuNghiemThuComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  @Input() congVanYeuCau: YeuCauNghiemThu;
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
      this.HoSoKemTheoService.getListHSKT(this.congVanYeuCau.MaDViQLy,this.congVanYeuCau.MaYeuCau,2)
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
  delete(id : number){
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
            this.loadData();
            this.isLoadingForm$.next(false);
          })).subscribe();
        this.subscriptions.push(subscribe);
  
      }
    })

  }

  upload(id: number) {
    const modalRef = this.modalService.open(UpdateTaiLieuNghiemThuComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.congVanYeuCau = this.congVanYeuCau;

    modalRef.result.then(
      () => {
        this.isLoadingForm$.next(true);
        this.loadData();
        this.isLoadingForm$.next(false);
      }
    );
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