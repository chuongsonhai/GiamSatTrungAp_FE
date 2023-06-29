import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { CommonService } from 'src/app/modules/services/base.service';
import { HopDongService } from 'src/app/modules/services/hopdong.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { HopDong } from 'src/app/modules/models/hopdong.model';
import { ApproveNghiemThuTemplateComponent } from 'src/app/modules/share-component/approve-nghiem-thu/approve-nghiem-thu.component';
import { ApproveModel } from 'src/app/modules/models/bienbanks.model';

@Component({
  selector: 'app-du-thao-hop-dong-dien',
  templateUrl: './du-thao-hop-dong-dien.component.html',
  styleUrls: ['./du-thao-hop-dong-dien.component.scss']
})
export class DuThaoHopDongDienComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: YeuCauNghiemThu;
  @Output() public reloadData: EventEmitter<boolean>;

  EMPTY: any;

  constructor(public commonService: CommonService,
    public service: HopDongService,
    private confirmationDialogService: ConfirmationDialogService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService) {
    this.reloadData = new EventEmitter<boolean>();
    this.EMPTY = {
      deptId: 0,
      staffCode: '',
      ngayHen: '',
      noiDung: '',
      maCViec: ''
    }
  }

  hopDong: HopDong;

  src: string;
  safeSrc: SafeResourceUrl;

  isLoadingForm$ = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 2000);
    if (this.congVanYeuCau.MaYeuCau !== undefined) {
      this.isLoadingForm$.next(true);
      this.loadData();
    }
  }

  loadData() {
    this.isLoadingForm$.next(true);
    const sb = this.service.detail(this.congVanYeuCau.MaDViQLy, this.congVanYeuCau.MaYeuCau).pipe(
      catchError((errorMessage) => {
        this.isLoadingForm$.next(false);
        return of(undefined);
      }),
    ).subscribe((response) => {
      if (response === undefined) {
        this.toastr.error('Không lấy được hợp đồng, vui lòng tạo hợp đồng trên CMIS', 'Thông báo');
        this.isLoadingForm$.next(false);
      }
      else {
        var binary_string = window.atob(response);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        let file = new Blob([bytes.buffer], { type: 'application/pdf' });
        var src = URL.createObjectURL(file);
        var safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(src);
        this.src = src;
        this.safeSrc = safeSrc;
        this.isLoadingForm$.next(false);
      }
    });
  }

  getUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }

  approveModel: ApproveModel;
  submited = new BehaviorSubject<boolean>(false);

  guiYeuCau() {
    this.approveModel = Object.assign(new ApproveModel(), this.EMPTY);
    const modalRef = this.modalService.open(ApproveNghiemThuTemplateComponent, { size: 'lg' });
    modalRef.componentInstance.congVanYeuCau = this.congVanYeuCau;
    modalRef.componentInstance.approveModel.subscribe((resultModel) => {
      if (resultModel) {
        this.submited.next(true);
        this.approveModel.deptId = resultModel.deptId;
        this.approveModel.staffCode = resultModel.staffCode;
        this.approveModel.ngayHen = resultModel.ngayHen;
        this.approveModel.noiDung = resultModel.noiDung;
        this.approveModel.maCViec = resultModel.maCViec;
      }
    });
    modalRef.result.then(
      () => {
        this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn gửi thư mới nghiệm thu, đóng điện đến khách hàng?')
          .then((confirmed) => {
            if (confirmed) {
              this.submited.next(true);
              if (this.approveModel) {
                this.isLoadingForm$.next(true);
                this.approveModel.id = this.hopDong.ID;
                const sbSign = this.service.notify(this.approveModel).pipe(
                  catchError((errorMessage) => {
                    this.submited.next(false);
                    this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                    return of(this.hopDong);
                  }),
                  finalize(() => {
                    this.isLoadingForm$.next(false);
                  })
                ).subscribe((res: HopDong) => {
                  this.submited.next(false);
                  if (res !== null && res !== undefined) {
                    this.hopDong = res
                    this.toastr.success("Đã duyệt biên bản", "Thành công");
                  }
                  else
                    this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                });
              }
            }
          });
      }
    );
  }

  private subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
