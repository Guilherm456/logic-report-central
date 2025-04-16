import { DatePipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiModule } from '@components/ui.module';
import { Report } from '@models';

@Component({
  selector: 'app-report-detail-modal',
  imports: [UiModule, NgIf, DatePipe],
  template: `
    <div
      class="bg-white rounded-md shadow-lg p-6 w-screen h-screen md:w-[60dvw] md:h-auto md:max-h-[90dvh] overflow-y-auto"
    >
      <h2 class="text-lg font-semibold text-gray-800 mb-4">
        Detalhes do laudo
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-semibold text-gray-700 mb-2">Paciente</h3>
          <p class="text-gray-600">{{ report!.patientName }}</p>
          <p class="text-gray-600">
            {{ report!.patientBirthDate | date : 'dd/MM/yyyy' }} ({{
              getAge(report!.patientBirthDate)
            }}
            anos)
          </p>
          <p class="text-gray-600">
            {{ genderTranslate(report!.patientGender) }}
          </p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-semibold text-gray-700 mb-2">Médicos</h3>
          <p class="text-gray-600">
            <span class="block">Responsável: {{ report!.doctor!.name }}</span>
            <span class="block"
              >Solicitante: {{ report!.doctorRequest!.name }}</span
            >
          </p>
        </div>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 class="font-semibold text-gray-700 mb-2">Conteúdo do Laudo</h3>
        <div class="prose max-w-none" [innerHTML]="report!.content"></div>
      </div>

      <div class="flex justify-between items-center mt-6">
        <div class="text-sm text-gray-500">
          <p>
            Data do laudo: {{ report!.createdAt | date : 'dd/MM/yyyy HH:mm' }}
          </p>
          <p *ngIf="report!.updatedAt">
            Última atualização:
            {{ report!.updatedAt | date : 'dd/MM/yyyy HH:mm' }}
          </p>
        </div>

        <div class="flex gap-2">
          <app-button
            (onClick)="closeModal()"
            className="bg-gray-100 !text-gray-800 hover:bg-gray-200"
            id="close-button"
          >
            Fechar
          </app-button>
        </div>
      </div>
    </div>
  `,
})
export class ReportDetailModalComponent {
  @Input() report?: Report;

  closeModal: (result?: any) => void = () => {};

  genderTranslate(gender: string): string {
    return gender === 'M' ? 'Masculino' : gender === 'F' ? 'Feminino' : 'Outro';
  }

  getAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    return today.getFullYear() - birth.getFullYear();
  }
}
