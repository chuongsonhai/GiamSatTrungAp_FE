import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSystemConfigComponent } from './update-system-config.component';

describe('UpdateSystemConfigComponent', () => {
  let component: UpdateSystemConfigComponent;
  let fixture: ComponentFixture<UpdateSystemConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSystemConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSystemConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
