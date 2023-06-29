import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMailThongBaoComponent } from './update-mail-thong-bao.component';

describe('UpdateMailThongBaoComponent', () => {
  let component: UpdateMailThongBaoComponent;
  let fixture: ComponentFixture<UpdateMailThongBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMailThongBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMailThongBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
