import {
    AfterContentInit,
    ContentChildren,
    Directive,
    EventEmitter,
    HostListener,
    QueryList,
    Output
  } from "@angular/core";
  import { merge } from "rxjs";
  import { startWith, switchMap } from "rxjs/operators";
  import { FocusKeyManager } from "@angular/cdk/a11y";
  import { MatRowFocusableDirective } from "./mat-row-focusable.directive";
  
  @Directive({
    selector: "[appMatTableFocusKeyManager]"
  })
  export class MatTableFocusKeyManagerDirective implements AfterContentInit {
    public keyManager: FocusKeyManager<MatRowFocusableDirective>;
  
    /** Event emitted when the focused row (index) changed. */
    @Output()
    public readonly focusKeyManagerIndexChanged: EventEmitter<
      number
    > = new EventEmitter<number>();
  
    /** All rows within the table. */
    @ContentChildren(MatRowFocusableDirective, { descendants: true })
    public rows: QueryList<MatRowFocusableDirective>;
  
    constructor() {}
  
    // @HostListener("keydown", ["$event"])
    // public onKeydownHandler(event: KeyboardEvent): void {
    //   this.keyManager.onKeydown(event);
    // }
  
    @HostListener("document:keydown", ["$event"])
    public onKeydownHandler(event: KeyboardEvent): void {
      this.keyManager.onKeydown(event);
    }
  
    public ngAfterContentInit(): void {
      this.keyManager = new FocusKeyManager<MatRowFocusableDirective>(
        this.rows
      ).withHomeAndEnd();
  
      // If a user manually (programatically) focuses a row, we need to reflect that focus
      // change back to the key manager.
      this.rows.changes
        .pipe(
          startWith(this.rows),
          switchMap(rows => {
            return merge<MatRowFocusableDirective>(
              ...rows.map((row: MatRowFocusableDirective) => row.focused)
            );
          })
        )
        .subscribe(focusedItem => {
          this.keyManager.updateActiveItem(focusedItem);
  
          if (this.keyManager.activeItemIndex !== null) {
            this.focusKeyManagerIndexChanged.emit(
              this.keyManager.activeItemIndex
            );
          }
        });
    }
  }
  