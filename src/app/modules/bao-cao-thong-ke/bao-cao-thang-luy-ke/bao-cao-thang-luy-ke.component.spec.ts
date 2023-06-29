import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCaoThangLuyKeComponent } from './bao-cao-thang-luy-ke.component';

describe('BaoCaoThangLuyKeComponent', () => {
  let component: BaoCaoThangLuyKeComponent;
  let fixture: ComponentFixture<BaoCaoThangLuyKeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaoCaoThangLuyKeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCaoThangLuyKeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
