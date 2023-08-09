import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietCanhBaoComponent } from './chi-tiet-canh-bao.component';

describe('ChiTietCanhBaoComponent', () => {
  let component: ChiTietCanhBaoComponent;
  let fixture: ComponentFixture<ChiTietCanhBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietCanhBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietCanhBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
