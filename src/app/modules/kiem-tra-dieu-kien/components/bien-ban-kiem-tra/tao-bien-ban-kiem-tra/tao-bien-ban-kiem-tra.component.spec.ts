import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaoBienBanKiemTraComponent } from './tao-bien-ban-kiem-tra.component';

describe('TaoBienBanKiemTraComponent', () => {
  let component: TaoBienBanKiemTraComponent;
  let fixture: ComponentFixture<TaoBienBanKiemTraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaoBienBanKiemTraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaoBienBanKiemTraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
