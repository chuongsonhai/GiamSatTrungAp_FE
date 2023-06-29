import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoaThuanDauNoiComponent } from './thoa-thuan-dau-noi.component';

describe('ThoaThuanDauNoiComponent', () => {
  let component: ThoaThuanDauNoiComponent;
  let fixture: ComponentFixture<ThoaThuanDauNoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThoaThuanDauNoiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoaThuanDauNoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
