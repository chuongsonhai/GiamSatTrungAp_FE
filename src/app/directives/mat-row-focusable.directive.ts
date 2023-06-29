import {
    AfterViewInit,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    OnDestroy
  } from '@angular/core';
  import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
  import { Subject } from 'rxjs';
  
  @Directive({
    selector: '[appMatRowFocusable]'
  })
  export class MatRowFocusableDirective
    implements FocusableOption, AfterViewInit, OnDestroy {
    constructor(
      private elementRef: ElementRef<HTMLElement>,
      private focusMonitor: FocusMonitor
    ) {}
  
    /** Stream that emits when the row is focused. */
    public readonly focused: Subject<MatRowFocusableDirective> = new Subject<
      MatRowFocusableDirective
    >();
  
    /** Whether the row has focus. */
    private hasFocus: boolean = false;
  
    @HostBinding('attr.tabindex')
    public tabIndex: number = -1;
  
    @HostListener('click', ['$event'])
    public onClickHandler(): void {
      this.focus('program');
    }
  
    @HostListener('blur')
    public onBlurHandler(): void {
      this.hasFocus = false;
    }
  
    public ngAfterViewInit(): void {
      // Start monitoring the element so it gets the appropriate focused classes.
      this.focusMonitor.monitor(this.elementRef, true);
    }
  
    /** Allows for programmatic focusing of the row. */
    public focus(origin?: FocusOrigin, options?: FocusOptions): void {
      if (!this.hasFocus) {
        if (origin) {
          this.focusMonitor.focusVia(this._getHostElement(), origin, options);
        } else {
          this._getHostElement().focus(options);
        }
        this.focused.next(this);
      }
      console.log('a ', document.activeElement);
      this.hasFocus = true;
    }
  
    /** Returns the host DOM element. */
    private _getHostElement(): HTMLElement {
      return this.elementRef.nativeElement;
    }
  
    public ngOnDestroy(): void {
      this.focusMonitor.stopMonitoring(this.elementRef);
      this.focused.complete();
    }
  }
  