import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DadosService } from '../dados.service';
import { Dados } from '../dados';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  dado: Dados = {modeloCarro: '', marcaCarro: '', anoCarro: '', aluno: '', matriculaAluno: '', codigoEtiqueta: '', CNHvalida: '', placaCarro: ''};

  constructor(
    private activaRoute: ActivatedRoute,
    private dadosServico: DadosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activaRoute.paramMap.subscribe({
      next: (rota: any) => {
        this.dado.matriculaAluno = rota.params.matricula;
        this.dadosServico.getDadosporMatricula(this.dado.matriculaAluno).subscribe({
          next: (retorno: any) => {
            this.dado.modeloCarro = retorno.Modelo;
            this.dado.marcaCarro = retorno.Marca;
            this.dado.placaCarro = retorno.Placa;
            this.dado.anoCarro = retorno.Ano;
            this.dado.aluno = retorno.Aluno;
            this.dado.codigoEtiqueta = retorno.codigoEtiqueta;
            this.dado.CNHvalida = retorno.CNHvalida;
          },
          error: (erro: any) => console.log(erro)
        });
      },
    });
  }

  editarDados() {
    this.dadosServico.editarDados(this.dado).subscribe({
      error: (erro: any) => console.log(erro)
    });
    this.router.navigate(['/lista']);
  }  
}
