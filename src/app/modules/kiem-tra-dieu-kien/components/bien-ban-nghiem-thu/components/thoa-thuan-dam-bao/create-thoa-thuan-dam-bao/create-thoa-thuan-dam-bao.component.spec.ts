import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateThoaThuanDamBaoComponent } from './create-thoa-thuan-dam-bao.component';

describe('CreateThoaThuanDamBaoComponent', () => {
  let component: CreateThoaThuanDamBaoComponent;
  let fixture: ComponentFixture<CreateThoaThuanDamBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateThoaThuanDamBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateThoaThuanDamBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
