import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReqresmqttService {
  mensagemRecebida: Subject<string> = new Subject<string>();

  constructor(private servicoMqtt: MqttService) { }

  connect(): void {
    this.servicoMqtt.connect({
      hostname: 'test.mosquitto.org',
      port: 8883,
      protocol: 'wss'
    });
  }

  enviarMensagem(topic: any, message: any): void {
    this.servicoMqtt.publish(topic, message);
  }

  entrarNoTopico(topic: any): void {
    this.servicoMqtt.observe(topic).subscribe((message: IMqttMessage) => {
      const payload = message.payload.toString()
      this.mensagemRecebida.next(payload);
    });
  }
}
