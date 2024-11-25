import { TestBed } from '@angular/core/testing';

import { SolicitarRecuperacaoService } from './solicitar-recuperacao.service';

describe('SolicitarRecuperacaoService', () => {
  let service: SolicitarRecuperacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitarRecuperacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
