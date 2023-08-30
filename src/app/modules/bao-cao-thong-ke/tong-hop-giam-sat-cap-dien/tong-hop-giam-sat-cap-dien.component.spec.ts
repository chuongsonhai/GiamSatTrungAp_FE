import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopGiamSatCapDienComponent } from './tong-hop-giam-sat-cap-dien.component';

describe('TongHopGiamSatCapDienComponent', () => {
  let component: TongHopGiamSatCapDienComponent;
  let fixture: ComponentFixture<TongHopGiamSatCapDienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopGiamSatCapDienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopGiamSatCapDienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
