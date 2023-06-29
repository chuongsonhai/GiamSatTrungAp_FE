import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListThoaThuanDauNoiComponent } from './list-thoa-thuan-dau-noi.component';

describe('ListThoaThuanDauNoiComponent', () => {
  let component: ListThoaThuanDauNoiComponent;
  let fixture: ComponentFixture<ListThoaThuanDauNoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListThoaThuanDauNoiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListThoaThuanDauNoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
