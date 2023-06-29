import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChamDutHopDongComponent } from './cham-dut-hop-dong.component';

describe('ChamDutHopDongComponent', () => {
  let component: ChamDutHopDongComponent;
  let fixture: ComponentFixture<ChamDutHopDongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChamDutHopDongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChamDutHopDongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
