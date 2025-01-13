import { Component, OnDestroy, OnInit } from '@angular/core';
import { Mensagem } from './ultima-msg.interface';
import { DadosService } from '../dados.service';  

@Component({
  selector: 'app-ultima-msg',
  templateUrl: './ultima-msg.component.html',
  styleUrls: ['./ultima-msg.component.css']
})
export class UltimaMsgComponent implements OnInit, OnDestroy {
  mensagem: Mensagem | null = null;
  carregando = true;  // Variável para mostrar o loading
  constructor(private dadosService: DadosService) {}

  ngOnInit(): void {
    this.onListar();
  }

  ngOnDestroy(): void {
    
  }

  // Função para formatar a data
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

  // Atualiza a última mensagem usando o serviço de dados
  onListar(): void {
    this.dadosService.getUltimaMensagem().subscribe({
      next: (item: Mensagem) => {
        this.mensagem = {
          ...item,
          img: `../assets/images/entrada/${item.img}`, 
          dataHora: this.formatarData(item.dataHora)
        };
      },
      error: (error) => {
        console.error('Erro ao buscar a última mensagem:', error);
      },
      complete: () => this.carregando = false  
    });
  }
}
