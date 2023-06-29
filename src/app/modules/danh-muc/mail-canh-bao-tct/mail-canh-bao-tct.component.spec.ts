import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailCanhBaoTctComponent } from './mail-canh-bao-tct.component';

describe('MailCanhBaoTctComponent', () => {
  let component: MailCanhBaoTctComponent;
  let fixture: ComponentFixture<MailCanhBaoTctComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailCanhBaoTctComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailCanhBaoTctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
