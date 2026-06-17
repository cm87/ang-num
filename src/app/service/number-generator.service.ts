import { Injectable } from '@angular/core';

/**
 * Numero di numeri principali per ogni riga.
 */
const MAIN_NUMBERS_COUNT = 6;

/**
 * Valore massimo dei numeri generabili (incluso).
 */
const MAX_NUMBER = 90;

/**
 * Numero massimo di righe generabili senza ripetizioni.
 * Deriva da MAX_NUMBER / MAIN_NUMBERS_COUNT.
 */
export const MAX_ROWS = Math.floor(MAX_NUMBER / MAIN_NUMBERS_COUNT);

/**
 * Service responsabile della generazione di righe di numeri casuali.
 *
 * Ogni riga contiene {@link MAIN_NUMBERS_COUNT} numeri principali univoci,
 * ordinati in modo crescente, seguiti da un numero "superstar" diverso dai principali.
 * Le righe sono tra loro mutualmente esclusive: nessun numero principale è condiviso
 * tra due righe diverse.
 *
 * Principio SOLID applicato: **Single Responsibility** —
 * questo service si occupa esclusivamente dell'algoritmo di generazione casuale.
 */
@Injectable({
  providedIn: 'root',
})
export class NumberGeneratorService {

  /**
   * Genera un numero specificato di righe di numeri casuali.
   *
   * @param rowCount - Numero di righe da generare (deve essere compreso tra 1 e {@link MAX_ROWS}).
   * @returns Array di righe; ogni riga è un array di 7 numeri (6 principali ordinati + superstar).
   * @throws Error se rowCount è minore di 1 o maggiore di {@link MAX_ROWS}.
   */
  generateRows(rowCount: number): number[][] {
    if (rowCount < 1 || rowCount > MAX_ROWS) {
      throw new Error(
        `Row count must be between 1 and ${MAX_ROWS}, but got ${rowCount}.`
      );
    }

    const rows: number[][] = [];
    const usedNumbers: number[] = [];

    for (let i = 0; i < rowCount; i++) {
      const row = this.generateSingleRow(usedNumbers);
      rows.push(row);
      // I primi 6 numeri della riga vengono marcati come "usati" per le righe successive.
      usedNumbers.push(...row.slice(0, MAIN_NUMBERS_COUNT));
    }

    return rows;
  }

  /**
   * Genera una singola riga di numeri casuali.
   *
   * @param excludedNumbers - Numeri da escludere dai numeri principali.
   * @returns Un array di 7 numeri: i primi 6 sono i numeri principali ordinati,
   *          il settimo è il superstar.
   */
  private generateSingleRow(excludedNumbers: number[]): number[] {
    const numbers: number[] = [];

    while (numbers.length < MAIN_NUMBERS_COUNT) {
      const randomNumber = this.generateRandomNumber();

      if (!numbers.includes(randomNumber) && !excludedNumbers.includes(randomNumber)) {
        numbers.push(randomNumber);
      }
    }

    const mainNumbers = numbers.sort((a, b) => a - b);

    let superstar: number;
    do {
      superstar = this.generateRandomNumber();
    } while (mainNumbers.includes(superstar));

    return [...mainNumbers, superstar];
  }

  /**
   * Genera un numero casuale compreso tra 1 e {@link MAX_NUMBER} (inclusi).
   *
   * @returns Numero intero casuale da 1 a 90.
   */
  private generateRandomNumber(): number {
    return Math.floor(Math.random() * MAX_NUMBER) + 1;
  }
}
