import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarRecuperacaoComponent } from './solicitar-recuperacao.component';

describe('SolicitarRecuperacaoComponent', () => {
  let component: SolicitarRecuperacaoComponent;
  let fixture: ComponentFixture<SolicitarRecuperacaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitarRecuperacaoComponent]
    });
    fixture = TestBed.createComponent(SolicitarRecuperacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
