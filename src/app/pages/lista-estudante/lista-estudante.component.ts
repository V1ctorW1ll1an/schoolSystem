import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ModalComponent } from 'src/app/components/feedback-modal/modal.component';
import { SuccessModalComponent } from 'src/app/components/success-modal/success-modal.component';
import { Estudante } from 'src/app/models/estudante';
import { EstudantesService } from 'src/app/services/estudantes.service';

@Component({
  selector: 'app-lista-estudante',
  templateUrl: './lista-estudante.component.html',
})
export class ListaEstudanteComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'email', 'matricula', 'acoes'];
  dataSource: Estudante[] = [];
  displayedData: Estudante[] = [];

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = true;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent?: PageEvent;

  constructor(
    public dialog: MatDialog,
    private estudantesService: EstudantesService
  ) {}

  ngOnInit(): void {
    this.buscarEstudantes();
  }

  private buscarEstudantes(): void {
    this.estudantesService.buscarEstudantes().subscribe((data) => {
      this.dataSource = data;
      this.updateDisplayedData();
    });
  }

  updateDisplayedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    let endIndex = startIndex + this.pageSize;
    if (endIndex > this.dataSource.length) {
      endIndex = this.dataSource.length;
    }
    this.displayedData = this.dataSource.slice(startIndex, endIndex);
    this.length = this.dataSource.length;
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedData();
  }

  excluirEstudante(estudante: Estudante): void {
    this.estudantesService.excluirEstudante(estudante.id).subscribe(() => {
      this.buscarEstudantes();
      this.dialog.open(SuccessModalComponent, {
        data: {
          estudante,
          title: 'Sucesso!',
          description: `O Estudante: ${estudante.nome} foi excluído com sucesso.`,
        },
      });
    });
  }

  openDialog(estudante: Estudante): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        estudante,
        title: 'Excluir Estudante',
        description: `Você realmente deseja excluir o estudante: ${estudante.nome}?`,
      },
    });

    dialogRef.afterClosed().subscribe((estudante: Estudante) => {
      if (estudante) {
        this.excluirEstudante(estudante);
      }
    });
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }
}
