import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovousuarioComponent } from './novousuario.component';

describe('NovousuarioComponent', () => {
  let component: NovousuarioComponent;
  let fixture: ComponentFixture<NovousuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NovousuarioComponent]
    });
    fixture = TestBed.createComponent(NovousuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
