import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TienDoThoaThuanDauNoiComponent } from './tien-do-thoa-thuan-dau-noi.component';

describe('TienDoThoaThuanDauNoiComponent', () => {
  let component: TienDoThoaThuanDauNoiComponent;
  let fixture: ComponentFixture<TienDoThoaThuanDauNoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TienDoThoaThuanDauNoiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TienDoThoaThuanDauNoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
