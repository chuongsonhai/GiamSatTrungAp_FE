import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ThongBao } from 'src/app/modules/models/thongbao.model';
import { ThongBaoService } from 'src/app/modules/services/thongbao.service';
import { UserModel } from 'src/app/_models/usermodel';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CongVanYeuCauService } from 'src/app/modules/services/congvanyeucau.service';
import { YeuCauNghiemThuService } from 'src/app/modules/services/yeucaunghiemthu.service';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';
import { ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,
  OnDestroy {
  isLoading: boolean;
  filterGroup: FormGroup;
  checkRender:any
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  _isLoadingForm$=  this.isLoadingForm$.asObservable();

  public YCDNChartLabels: string[] = [];
  public YCDNChartData: ChartData<'doughnut'> = {
    labels: this.YCDNChartLabels,
    datasets: [
      { data: [] },
 
    ]
  };
  public YCNTChartLabels: string[] = [];
  public YCNTChartData: ChartData<'doughnut'> = {
    labels: this.YCDNChartLabels,
    datasets: [
      { data: [] },
 
    ]
  };
  public doughnutChartType: ChartType = 'doughnut';

  _user$: UserModel;
  startDate = new Date();
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    public authService: AuthenticationService,
    public congVanYeuCauService:CongVanYeuCauService,
    public yeuCauNghiemThuService:YeuCauNghiemThuService,
    public service: ThongBaoService,
    private router: Router,
    private toastr: ToastrService
  ) {

   }


  get user$() {
    return of(this._user$);
  }
  ngOnInit(): void {
    this._user$ = this.authService.currentUserValue;
  


    this.route.queryParamMap
      .subscribe(params => {
        this.router.navigate(['/']);
      });
    this.notifies();
    setTimeout(() => {
      this.renderChart();
    }, 1000);
 
  }

  renderChart(){
    var dauthang=new Date(this.startDate.getFullYear(),this.startDate.getMonth(),1);
    var cuoithang=new Date(this.startDate.getFullYear(),this.startDate.getMonth()+1, 0)
    var dauthang1=new Date(this.startDate.getFullYear(),this.startDate.getMonth()-1,1);
    var cuoithang1=new Date(this.startDate.getFullYear(),this.startDate.getMonth(), 0) 

    this.isLoadingForm$.next(true);
      const sb = this.congVanYeuCauService.getListYeuCau(this._user$.maDViQLy,DateTimeUtil.convertDateToStringVNDefaulDateNow(dauthang1),DateTimeUtil.convertDateToStringVNDefaulDateNow(cuoithang1)).pipe(
        catchError((errorMessage) => {
          return of([]);
        }), finalize(() => {
          this.isLoadingForm$.next(false);
        })
      ).subscribe(res => {
        if (res.success) {
    
          this.YCDNChartLabels.length = 0;
          res.data.labels.forEach(element => {
            this.YCDNChartLabels.push(element)
          });
          res.data.series.forEach(element => {
            this.YCDNChartData.datasets[0].data.push(element)
          });
       
      
      
          this.isLoadingForm$.next(false);
        }
      });

         
      this.yeuCauNghiemThuService.getListYeuCau(this._user$.maDViQLy,DateTimeUtil.convertDateToStringVNDefaulDateNow(dauthang1),DateTimeUtil.convertDateToStringVNDefaulDateNow(cuoithang1)).pipe(
        catchError((errorMessage) => {
          return of([]);
        }), finalize(() => {
          this.isLoadingForm$.next(false);
        })
      ).subscribe(res => {
        if (res.success) {
 
          this.YCNTChartLabels.length = 0;
          res.data.labels.forEach(element => {
            this.YCNTChartLabels.push(element)
          });
          res.data.series.forEach(element => {
            this.YCNTChartData.datasets[0].data.push(element)
          });
       
    
      
          this.isLoadingForm$.next(false);
        }
      });

  }


  protected _items$ = new BehaviorSubject<ThongBao[]>([]);
  get items$() {
    return this._items$.asObservable();
  }


  notifies() {
    const filter = { status: 0 };
    const sb = this.service.getNotifies(filter).pipe(
      catchError((errorMessage) => {
        return of([]);
      }), finalize(() => {
        this.isLoadingForm$.next(false);
      })
    ).subscribe(res => {
      if (res.success) {
        this._items$.next(res.data);
      }
    });
  }

  tBaoIDs: number[] = [];
  selectRow(code: number) {
    const index = this.tBaoIDs.indexOf(code);
    if (index !== -1) this.tBaoIDs.splice(index, 1);
    else
      this.tBaoIDs.push(code);
  }

  updateStatus() {
    const sbUpdate = this.service.updateStatus(this.tBaoIDs).pipe(
      catchError((errorMessage) => {
        return of(undefined);
      }),
    ).subscribe(res => {
      if (res.success) {
        this.toastr.success("Chuyển trạng thái thành công", "Thông báo");
        this.notifies();
      }
      else {
        this.toastr.error(res.message, "Thông báo");
      }
    });
    this.subscriptions.push(sbUpdate);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
