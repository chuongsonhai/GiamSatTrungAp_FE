import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNhanCanhbaoComponent } from './user-nhan-canhbao.component';

describe('UserNhanCanhbaoComponent', () => {
  let component: UserNhanCanhbaoComponent;
  let fixture: ComponentFixture<UserNhanCanhbaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNhanCanhbaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNhanCanhbaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
