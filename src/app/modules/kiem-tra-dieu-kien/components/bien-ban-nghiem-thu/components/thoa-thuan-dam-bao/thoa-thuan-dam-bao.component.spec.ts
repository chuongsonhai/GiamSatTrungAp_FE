import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoaThuanDamBaoComponent } from './thoa-thuan-dam-bao.component';

describe('ThoaThuanDamBaoComponent', () => {
  let component: ThoaThuanDamBaoComponent;
  let fixture: ComponentFixture<ThoaThuanDamBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThoaThuanDamBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoaThuanDamBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
