// du-thao-hop-dong-dien.component.ts

import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { CommonService } from 'src/app/modules/services/base.service';
import { HopDongService } from 'src/app/modules/services/hopdong.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
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
  @Output() public reloadData = new EventEmitter<boolean>();

  EMPTY: any = {
    deptId: 0,
    staffCode: '',
    ngayHen: '',
    noiDung: '',
    maCViec: ''
  };

  hopDong: HopDong;
  src: string;
  safeSrc: SafeResourceUrl;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  approveModel: ApproveModel;
  submited = new BehaviorSubject<boolean>(false);
  private subscriptions: Subscription[] = [];

  constructor(
    public commonService: CommonService,
    public service: HopDongService,
    private confirmationDialogService: ConfirmationDialogService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.isLoadingForm$.next(true);
    if (this.congVanYeuCau?.MaYeuCau) {
      this.loadData();
    } else {
      this.isLoadingForm$.next(false);
    }
  }

  loadData() {
    this.isLoadingForm$.next(true);
    const sb = this.service.detail(this.congVanYeuCau.MaDViQLy, this.congVanYeuCau.MaYeuCau).pipe(
      catchError((errorMessage) => {
        this.toastr.error('Không lấy được hợp đồng, vui lòng thử lại', 'Lỗi');
        return of(undefined);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((response) => {
      if (!response) return;

      try {
        const binary_string = atob(response);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }

        const file = new Blob([bytes.buffer], { type: 'application/pdf' });

        // Kiểm tra loại file là PDF
        if (file.type === 'application/pdf') {
          const objectUrl = URL.createObjectURL(file);
          this.src = objectUrl;
          this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
        } else {
          this.toastr.error('Tệp không đúng định dạng PDF', 'Lỗi');
        }
      } catch (e) {
        console.error(e);
        this.toastr.error('Lỗi xử lý file', 'Lỗi');
      }
    });

    this.subscriptions.push(sb);
  }

  getUrl(): SafeResourceUrl {
    return this.safeSrc;
  }

  guiYeuCau() {
    this.approveModel = Object.assign(new ApproveModel(), this.EMPTY);
    const modalRef = this.modalService.open(ApproveNghiemThuTemplateComponent, { size: 'lg' });
    modalRef.componentInstance.congVanYeuCau = this.congVanYeuCau;

    modalRef.componentInstance.approveModel.subscribe((resultModel) => {
      if (resultModel) {
        this.submited.next(true);
        Object.assign(this.approveModel, resultModel);
      }
    });

    modalRef.result.then(() => {
      this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn gửi thư mới nghiệm thu, đóng điện đến khách hàng?')
        .then((confirmed) => {
          if (confirmed && this.approveModel) {
            this.approveModel.id = this.hopDong?.ID;
            this.isLoadingForm$.next(true);
            const sbSign = this.service.notify(this.approveModel).pipe(
              catchError(() => {
                this.submited.next(false);
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                return of(this.hopDong);
              }),
              finalize(() => this.isLoadingForm$.next(false))
            ).subscribe((res: HopDong) => {
              this.submited.next(false);
              if (res) {
                this.hopDong = res;
                this.toastr.success("Đã duyệt biên bản", "Thành công");
              } else {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
              }
            });

            this.subscriptions.push(sbSign);
          }
        });
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
