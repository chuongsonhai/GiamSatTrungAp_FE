import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogCanhBaoComponent } from './log-canh-bao.component';

describe('LogCanhBaoComponent', () => {
  let component: LogCanhBaoComponent;
  let fixture: ComponentFixture<LogCanhBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogCanhBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogCanhBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
