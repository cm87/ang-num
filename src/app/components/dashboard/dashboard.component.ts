import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumberGeneratorService, MAX_ROWS } from '../../service/number-generator.service';

/**
 * Componente dashboard per la generazione di righe di numeri casuali.
 *
 * Delega l'algoritmo di generazione al {@link NumberGeneratorService},
 * mantenendo come unica responsabilità la gestione dello stato della UI.
 *
 * Utilizza i nuovi **Angular Signals** per lo stato reattivo.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  private readonly numberGeneratorService = inject(NumberGeneratorService);

  /**
   * Lista delle righe generate; ogni riga contiene 6 numeri principali ordinati + 1 superstar.
   * Signal reattivo per tracciare lo stato.
   */
  numberList = signal<Array<Array<number>>>([]);

  /**
   * Numero di righe che l'utente desidera generare.
   */
  rowCount = 2;

  /**
   * Numero massimo di righe generabili (derivato dal service).
   */
  readonly maxRows = MAX_ROWS;

  constructor() {}

  ngOnInit(): void {
    this.generate();
  }

  /**
   * Genera le righe di numeri casuali in base alla scelta dell'utente.
   * Ogni riga ha numeri univoci ordinati + superstar diverso dai principali.
   * Nessun numero principale è ripetuto tra righe diverse.
   */
  generate(): void {
    this.numberList.set(this.numberGeneratorService.generateRows(this.rowCount));
  }

  /**
   * Svuota la lista delle righe generate.
   */
  clear(): void {
    this.numberList.set([]);
  }

}
