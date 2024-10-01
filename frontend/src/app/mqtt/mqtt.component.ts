import { Component, OnDestroy, OnInit } from '@angular/core';
import { DadosService } from '../dados.service';
import { MqttService } from '../mqtt.service';  // Importa o serviço MQTT

@Component({
  selector: 'app-mqtt',
  templateUrl: './mqtt.component.html',
  styleUrls: ['./mqtt.component.css']
})
export class MqttComponent implements OnInit, OnDestroy {
  mensagensRecebidas: any[] = [];
  dados: any[] = [];
  carregando = true;  // Variável para mostrar o loading

  constructor(private dadosService: DadosService, private mqttService: MqttService) {}

  ngOnInit(): void {
    this.onListar();

    // Escutar mensagens do MQTT e atualizar os dados quando uma mensagem for recebida
    this.mqttService.onMessageReceived = (msg: string) => {
      console.log('Nova mensagem MQTT recebida:', msg);
      this.onListar();  // Atualiza a lista de dados ao receber uma mensagem
    };
  }

  ngOnDestroy(): void {
    // Aqui você pode adicionar lógica de limpeza, se necessário
    // Por exemplo, desconectar do serviço MQTT ou cancelar assinaturas
  }

  formatarData(data: string): string {
    const opcoes: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const dataFormatada = new Date(data);
    return dataFormatada.toLocaleString('pt-BR', opcoes);
  }

  onListar(): void {  // Lista os dados do banco de dados
    this.dadosService.getHistoricoEntrada().subscribe({
      next: (resultado: any[]) => { 
        this.dados = resultado.map((item: any) => {
          return { 
            ...item, 
            img: `../assets/images/entrada/${item.img}`, 
            dataHora: this.formatarData(item.dataHora)
          };
        });
      },
      error: (error: any) => { console.log(error) },
      complete: () => this.carregando = false
    });
  }
}
