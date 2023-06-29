import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListYeuCauComponent } from './list-yeu-cau.component';

describe('ListYeuCauComponent', () => {
  let component: ListYeuCauComponent;
  let fixture: ComponentFixture<ListYeuCauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListYeuCauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListYeuCauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
