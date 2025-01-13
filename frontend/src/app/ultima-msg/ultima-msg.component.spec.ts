import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimaMsgComponent } from './ultima-msg.component';

describe('UltimaMsgComponent', () => {
  let component: UltimaMsgComponent;
  let fixture: ComponentFixture<UltimaMsgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UltimaMsgComponent]
    });
    fixture = TestBed.createComponent(UltimaMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
