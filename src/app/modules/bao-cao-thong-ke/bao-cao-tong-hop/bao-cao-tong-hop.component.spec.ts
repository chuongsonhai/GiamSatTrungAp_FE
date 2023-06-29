import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCaoTongHopComponent } from './bao-cao-tong-hop.component';

describe('BaoCaoTongHopComponent', () => {
  let component: BaoCaoTongHopComponent;
  let fixture: ComponentFixture<BaoCaoTongHopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaoCaoTongHopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCaoTongHopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
