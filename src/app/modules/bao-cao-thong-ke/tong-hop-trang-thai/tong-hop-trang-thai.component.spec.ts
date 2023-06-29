import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopTrangThaiComponent } from './tong-hop-trang-thai.component';

describe('TongHopTrangThaiComponent', () => {
  let component: TongHopTrangThaiComponent;
  let fixture: ComponentFixture<TongHopTrangThaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopTrangThaiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopTrangThaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
