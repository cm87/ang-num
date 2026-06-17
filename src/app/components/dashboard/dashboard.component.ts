
import { Component } from '@angular/core';
import { NumberGeneratorService, MAX_ROWS } from '../../service/number-generator.service';

/**
 * Componente dashboard per la generazione di righe di numeri casuali.
 *
 * Delega l'algoritmo di generazione al {@link NumberGeneratorService},
 * mantenendo come unica responsabilità la gestione dello stato della UI.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  /**
   * Lista delle righe generate; ogni riga contiene 6 numeri principali ordinati + 1 superstar.
   */
  numberList: Array<Array<number>> = [];

  /**
   * Numero di righe che l'utente desidera generare.
   */
  rowCount = 2;

  /**
   * Numero massimo di righe generabili (derivato dal service).
   */
  readonly maxRows = MAX_ROWS;

  constructor(private readonly numberGeneratorService: NumberGeneratorService) {}

  /**
   * Genera le righe di numeri casuali in base alla scelta dell'utente.
   * Ogni riga ha numeri univoci ordinati + superstar diverso dai principali.
   * Nessun numero principale è ripetuto tra righe diverse.
   */
  generate(): void {
    this.numberList = this.numberGeneratorService.generateRows(this.rowCount);
  }

  /**
   * Svuota la lista delle righe generate.
   */
  clear(): void {
    this.numberList = [];
  }

}
