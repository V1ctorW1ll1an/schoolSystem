import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/components/success-modal/success-modal.component';
import { EstudantesService } from 'src/app/services/estudantes.service';

@Component({
  selector: 'app-form-estudante',
  templateUrl: './form-estudante.component.html',
})
export class FormEstudanteComponent implements OnInit {
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  isUpdateMode = false;
  matricula = null;

  options = this._formBuilder.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    matricula: [{ value: '', disabled: true }],
    hideRequired: this.hideRequiredControl,
    floatLabel: this.floatLabelControl,
  });

  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private estudantesService: EstudantesService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    const estudanteId = this.route.snapshot.paramMap.get('id');
    if (estudanteId) {
      this.isUpdateMode = true;
      this.estudantesService.buscarEstudante(+estudanteId).subscribe({
        next: (data) => {
          if (data && Object.keys(data).length !== 0) {
            this.matricula = data.matricula;
            this.options.patchValue(data);
          }
        },
        error: (_) => {
          this.router.navigate(['/']);
        },
      });
    }
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }

  salvarEstudante() {
    if (this.options.valid) {
      this.estudantesService.criarEstudante(this.options.value).subscribe({
        next: () => {
          this.dialog.open(SuccessModalComponent, {
            data: {
              title: 'Sucesso!',
              description: `O estudante: ${this.options.value.nome} foi cadastrado com sucesso.`,
            },
          });
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.dialog.open(ErrorModalComponent, {
            data: {
              title: 'oh não!',
              description: `Tivemos um problema para cadastrar o estudante: ${this.options.value.nome}. verifique o console para mais detalhes`,
            },
          });
          console.error(
            `erro ao cadastrar o estudante: ${this.options.value.nome} \n motivo: ${error.message}`
          );
        },
      });
    }
  }

  AtualizarEstudante(estudanteId: number) {
    if (this.options.valid) {
      this.estudantesService
        .atualizarEstudante(estudanteId, {
          ...this.options.value,
          matricula: this.matricula,
        })
        .subscribe({
          next: () => {
            this.dialog.open(SuccessModalComponent, {
              data: {
                title: 'Sucesso!',
                description: `Os dados do estudante: ${this.options.value.nome} foi atualizado com sucesso.`,
              },
            });
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.dialog.open(ErrorModalComponent, {
              data: {
                title: 'oh não!',
                description: `Tivemos um problema para atualizar os dados do estudante: ${this.options.value.nome}. verifique o console para mais detalhes`,
              },
            });
            console.error(
              `erro ao atualizar os dados do estudante: ${this.options.value.nome} \n motivo: ${error.message}`
            );
          },
        });
    }
  }

  onSubmit() {
    const estudanteId = this.route.snapshot.paramMap.get('id');
    if (estudanteId) {
      this.AtualizarEstudante(+estudanteId);
    } else {
      this.salvarEstudante();
    }
  }
}
