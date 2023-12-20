import { Component, OnDestroy, OnInit } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { DadosService } from '../dados.service';

@Component({
  selector: 'app-mqtt',
  templateUrl: './mqtt.component.html',
  styleUrls: ['./mqtt.component.css']
})
export class MqttComponent implements OnDestroy, OnInit{
  private sub: Subscription;
  mensagensRecebidas: any[] = [];
  mensagemEnvio: any = '';
  topico = 'tartaruga_carrodeentrada_1283'
  dados: any[] = [];
  dadosPlaca: any[] = [];
  
  constructor(private servicoMqtt: MqttService, private dadosService: DadosService) {
    this.sub = this.servicoMqtt.observe(this.topico).subscribe((mensagem) => {
      this.mensagensRecebidas.push(mensagem);
      this.dadosService.addHistoricoEntrada(mensagem).subscribe();
    });
  }

  ngOnInit(): void {
    this.onListar();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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

  onListar(): void {  // lista os dados do banco de dados
    this.dadosService.getHistoricoEntrada().subscribe({
      next: (resultado: any[]) => { 
        (this.dados = resultado.map((item: any) => {
          return {...item, dataHora: this.formatarData(item.dataHora)}}));
        
        if(resultado && resultado.length > 0) {
          const placa = resultado[0].placa;
          this.dadosService.getDadosporPlaca(placa).subscribe({
            next: (dadosPorPlaca: any[]) => {
              this.dadosPlaca = dadosPorPlaca;
            },
            error: (error: any) => { console.log(error) },
          });
        }
        
      },
      error: (error: any) => { console.log(error) },
    });
  }

  // handleFileInput(event: any): void {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();

  //   reader.onloadend = () => {
  //     this.mensagemEnvio = reader.result;
  //   };

  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // }

  isBase64Image(str: string): boolean {
    return str.startsWith('data:image');
  }

  // enviarMensagem() {
  //   this.servicoMqtt.publish(this.topico, this.mensagemEnvio).subscribe({
  //     next: () => {
  //       console.log('Mensagem enviada');
  //       this.mensagemEnvio = '';
  //     },
  //     error: (err) => {
  //       console.error('Erro ao enviar mensagem', err);
  //     },
  //   });
  // }
  
}
