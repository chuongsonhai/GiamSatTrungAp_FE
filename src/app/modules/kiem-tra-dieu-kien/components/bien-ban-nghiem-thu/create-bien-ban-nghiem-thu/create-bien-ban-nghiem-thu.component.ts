import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { ResponseModel } from 'src/app/modules/models/response.model';
import { ActivatedRoute, Router } from '@angular/router';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BienBanNTService } from '../../../../services/bienbannt.service';

@Component({
  selector: 'app-create-bien-ban-nghiem-thu',
  templateUrl: './create-bien-ban-nghiem-thu.component.html',
  styleUrls: ['./create-bien-ban-nghiem-thu.component.scss']
})
export class CreateBienBanNghiemThuComponent implements OnInit {
  @Input() maYeuCau: string;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);;
  formGroup: FormGroup;
  File: string;
  private subscriptions: Subscription[] = [];

  constructor(
    public BienBanNTService: BienBanNTService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private router: Router,
  ) {

  }
  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    this.isLoadingForm$.next(false);
  }

  save() {
    const sbUpdate = this.BienBanNTService.createBBNT(this.fileToUpload, this.maYeuCau).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of();
      }),
    ).subscribe();
    this.subscriptions.push(sbUpdate);
  }

  public upload(event) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.handleFileInput(event.target.files);
    }
  }

  fileToUpload: any;

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    let reader = new FileReader();
    reader.onload = ((event: any) => {
      this.File = event.target.result;
    });
    reader.readAsDataURL(this.fileToUpload);
    //reader.onloadend = function (e) {};
  }

}
