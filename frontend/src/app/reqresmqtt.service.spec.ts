import { TestBed } from '@angular/core/testing';

import { ReqresmqttService } from './reqresmqtt.service';

describe('ReqresmqttService', () => {
  let service: ReqresmqttService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReqresmqttService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
