import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService as NgxMqttService, IMqttServiceOptions } from 'ngx-mqtt';

@Injectable({
  providedIn: 'root'
})

export class MqttService {
  private mqttOptions: IMqttServiceOptions = {
    hostname: 'localhost',
    port: 8883,
    protocol: 'wss',  // Use 'wss' for secure WebSocket connection
    path: '/',
    rejectUnauthorized: false,  // Para ignorar erros de certificado durante o desenvolvimento
  };

  constructor(private ngxMqttService: NgxMqttService) {
    this.ngxMqttService.connect(this.mqttOptions);

    // Inscrevendo-se em um tópico logo após a conexão
    this.ngxMqttService.observe('carro/cam_vec_1').subscribe({
      next: (message: IMqttMessage) => {
        const msg = message.payload.toString();
        console.log('Mensagem recebida no tópico carro/cam_vec_1:', msg);
        this.onMessageReceived(msg);
      },
      error: (err) => console.error('Erro ao receber mensagem', err)
    });
  }

  // Função que será chamada quando uma mensagem for recebida
  onMessageReceived(msg: string) {
    console.log('Mensagem processada:', msg);
    // Aqui você pode executar a lógica desejada, como chamar this.onListar()
  }

  // Método para publicar uma mensagem no tópico
  publish(topic: string, message: string) {
    this.ngxMqttService.unsafePublish(topic, message, { qos: 1, retain: false });
  }
}
