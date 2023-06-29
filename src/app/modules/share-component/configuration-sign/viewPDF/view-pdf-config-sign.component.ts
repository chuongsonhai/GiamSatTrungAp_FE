import { CdkDragEnd, CdkDragMove } from "@angular/cdk/drag-drop";
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ResizeEvent } from "angular-resizable-element";
import { PdfViewerComponent } from "ng2-pdf-viewer";
// import { PdfViewerComponent } from "ng2-pdf-viewer/public_api";
import { BehaviorSubject, Observable } from "rxjs";
import { Subscription } from "rxjs";

@Component({
  selector: "app-vew-pdf-sign",
  templateUrl: "./view-pdf-config-sign.component.html",
  styleUrls: ["./view-pdf-config-sign.component.css"],
})
export class ViewPDFSignComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked, OnChanges, DoCheck {
  @ViewChild("viewer") d1: ElementRef | undefined;


  @ViewChild(PdfViewerComponent, { static: false })
  private pdfComponent: PdfViewerComponent;



  @Input() position: string;
  @Input() signName: string;
  @Input() currentPage: number;
  @Input() typeSign: number;
  @Input('urlImage') urlImage;
  @Output() emitPosition = new EventEmitter();
  @Output() emitPageSign = new EventEmitter();
  @Output() emitListPageSign = new EventEmitter();

  private _isLoading$ = new BehaviorSubject<boolean>(true);
  public isLoading$ = this._isLoading$.asObservable();

  subscriptions: Subscription[] = [];
  private typeSignCurrent: number;
  public width: number = 700;
  public height: number = 700;
  public heightViewer: number = 750;
  public widthSign: number = 100;
  public heightSign: number = 50;
  public pageVariable: number = 1;
  public totalNumber: number = 1;
  public dragPosition = { x: 0, y: 0 };
  public pages: Array<number> = [];
  public style: object = {};
  public currentUrl: string;
  public isRenderView = true;
  public isLoadPDF = false;
  //hệ số nhân so với gốc tọa độ chuẩn
  private ratioOxy: number = 1.09;
  constructor(private cdr: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this._isLoading$.next(true);
  }

  ngOnDestroy(): void {
  }

  nextPage() {
    if (this.pageVariable < this.totalNumber)
      this.pageVariable++;
  }
  backPage() {
    if (this.pageVariable != 0 && this.pageVariable > 1) this.pageVariable--;
  }
  afterLoadComplete(pdf: any) {
    this.pdfComponent.pdfViewer.scroll.down = false;
    this.pages = [];
    let totalPages = pdf.numPages + 1;
    this.totalNumber = pdf.numPages;
    if (totalPages && totalPages > 1) {
      for (let i = 1; i < totalPages; i++) {
        this.pages.push(i);
      }
      this.emitListPageSign.emit(this.pages);
    }

  }
  textLayerRendered(e: CustomEvent) {
    console.log("(text-layer-rendered)", e);
  }
  renderSign() {

    if (this.position) {
      if (!this.typeSignCurrent || this.typeSign != this.typeSignCurrent) {
        let coordinates = this.position.split(",");
        let x1 = Number.parseFloat(coordinates[0]) / this.ratioOxy;
        let y1 = Number.parseFloat(coordinates[1]) / this.ratioOxy;
        let x2 = Number.parseFloat(coordinates[2]) / this.ratioOxy;
        let y2 = Number.parseFloat(coordinates[3]) / this.ratioOxy;
        let x = x1;
        let y = this.height - y1;
        this.dragPosition = {
          x: x,
          y: Math.abs(y),
        };
        this.widthSign = x2 - x1;
        this.heightSign = y1 - y2;

      }
    } else {
      this.widthSign = 100;
      this.heightSign = 50;
      //this.pageVariable = 1;
      //this.currentPage = 1;
      this.typeSignCurrent = this.typeSign;
      this.dragPosition = {
        x: 0,
        y: 0,
      };
    }

    this._isLoading$.next(false);
  }
  ngDoCheck() {
  }
  ngOnChanges() {
    // this.currentPage= this.currentPage as number;
    this.pageVariable = this.currentPage as number;
    if (!this.isRenderView) {
      this.renderSign();
    }
  }
  onDragEnded(event: CdkDragEnd) {
    var location = event.source.getFreeDragPosition();
    this.caculaterCoordinates(location.x, location.y);
  }

  caculaterCoordinates(x, y) {
    this.dragPosition.x = x;
    this.dragPosition.y = y;
    let x1 = x + 2;
    let y1 = this.height - y - 2;
    let x2 = x1 + this.widthSign;
    let y2 = y1 - this.heightSign;
    this.position = `${(x1 * this.ratioOxy).toFixed(2)},${(
      y1 * this.ratioOxy
    ).toFixed(2)},${(x2 * this.ratioOxy).toFixed(2)},${(
      y2 * this.ratioOxy
    ).toFixed(2)}`;
    this.emitPosition.emit(this.position);
    this.emitPageSign.emit(this.currentPage);
  }

  dragMoved(event: CdkDragMove) {
    this.position = `> Position X: ${event.pointerPosition.x} - Y: ${event.pointerPosition.y}`;
  }
  public ngAfterViewInit() {
  }
  public ngAfterViewChecked() {
    var element = document.querySelector(".canvasWrapper");
    try {
      if (element) {
        let elementStypes = element.getBoundingClientRect();
        if (elementStypes) {
          this.width = elementStypes.width;
          this.height = elementStypes.height;
          if (this.height > 900) this.heightViewer = this.height + 20;
          if (this.isRenderView) {
            this.renderSign();
            this.isRenderView = false;
          }
        }
      }
      this.cdr.detectChanges();
    }
    catch (ex) {
      console.error("Lỗi!!!", ex);
    }
  }
  changePosition() {
    this.dragPosition = {
      x: this.dragPosition.x,
      y: this.dragPosition.y,
    };
  }
  validate(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX: number = 20;
    if (
      event.rectangle.width &&
      event.rectangle.height &&
      (event.rectangle.width < MIN_DIMENSIONS_PX ||
        event.rectangle.height < MIN_DIMENSIONS_PX)
    ) {
      return false;
    }
    return true;
  }

  onResizeEnd(event: ResizeEvent): void {
    this.style = {
      position: "static",
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
    };
    this.heightSign = event.rectangle.height;
    this.widthSign = event.rectangle.width;
  }
  changeCurrentPage(e: any) {
    this.currentPage = Number.parseInt(e.target.value);
    this.pageVariable = this.currentPage;
    this.emitPageSign.emit(this.currentPage);
  }
}
