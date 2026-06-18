import { Injectable, inject } from '@angular/core';
import { StatisticsService, Statistics } from './statistics.service';

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
 * Modalità di generazione dei numeri.
 */
export enum GenerationMode {
  /** Generazione completamente casuale (default). */
  RANDOM = 'random',
  /** Favorisce i numeri più frequenti nelle estrazioni passate. */
  HOT = 'hot',
  /** Favorisce i numeri meno frequenti (ritardatari). */
  COLD = 'cold'
}

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
  private readonly statisticsService: StatisticsService;
  private cachedStatistics: Statistics | null = null;

  constructor(statisticsService?: StatisticsService) {
    this.statisticsService = statisticsService ?? inject(StatisticsService);
  }

  /**
   * Genera un numero specificato di righe di numeri casuali.
   *
   * @param rowCount - Numero di righe da generare (deve essere compreso tra 1 e {@link MAX_ROWS}).
   * @param mode - Modalità di generazione (casuale, frequenti, ritardatari).
   * @returns Array di righe; ogni riga è un array di 7 numeri (6 principali ordinati + superstar).
   * @throws Error se rowCount è minore di 1 o maggiore di {@link MAX_ROWS}.
   */
  async generateRows(rowCount: number, mode: GenerationMode = GenerationMode.RANDOM): Promise<number[][]> {
    if (rowCount < 1 || rowCount > MAX_ROWS) {
      throw new Error(
        `Row count must be between 1 and ${MAX_ROWS}, but got ${rowCount}.`
      );
    }

    // Recupera le statistiche se necessario
    let preferredNumbers: number[] = [];
    if (mode !== GenerationMode.RANDOM) {
      const stats = await this.statisticsService.getStatistics().toPromise();
      if (stats) {
        this.cachedStatistics = stats;
        preferredNumbers = mode === GenerationMode.HOT ? stats.hotNumbers : stats.coldNumbers;
      }
    }

    const rows: number[][] = [];
    const usedNumbers: number[] = [];

    for (let i = 0; i < rowCount; i++) {
      const row = this.generateSingleRow(usedNumbers, preferredNumbers);
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
   * @param preferredNumbers - Numeri preferiti (frequenti/ritardatari) da favorire.
   * @returns Un array di 7 numeri: i primi 6 sono i numeri principali ordinati,
   *          il settimo è il superstar.
   */
  private generateSingleRow(excludedNumbers: number[], preferredNumbers: number[] = []): number[] {
    const numbers: number[] = [];

    // Se ci sono numeri preferiti, garantiamo almeno 1 per riga
    let requiredStatistical = 0;
    if (preferredNumbers.length > 0) {
      requiredStatistical = 1; // Almeno 1 numero statistico per riga
    }

    let statisticalUsed = 0;

    while (numbers.length < MAIN_NUMBERS_COUNT) {
      let randomNumber: number;

      // Se dobbiamo ancora inserire numeri statistici e ne abbiamo disponibili
      if (statisticalUsed < requiredStatistical && preferredNumbers.length > 0) {
        // Scegliamo dai numeri preferiti
        const availablePreferred = preferredNumbers.filter(n => 
          !numbers.includes(n) && !excludedNumbers.includes(n)
        );
        
        if (availablePreferred.length > 0) {
          randomNumber = availablePreferred[Math.floor(Math.random() * availablePreferred.length)];
          statisticalUsed++;
        } else {
          // Se non ci sono preferiti disponibili, usiamo casuale
          randomNumber = this.generateRandomNumber();
        }
      } else {
        // Per il resto, usiamo logica mista (50% statistico, 50% casuale)
        randomNumber = this.generateRandomNumber(preferredNumbers);
      }

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
   * @param preferredNumbers - Numeri preferiti da favorire (frequenti/ritardatari).
   * @returns Numero intero casuale da 1 a 90.
   */
  private generateRandomNumber(preferredNumbers: number[] = []): number {
    // Se ci sono numeri preferiti, aumenta la probabilità di sceglierli (50% di chance)
    if (preferredNumbers.length > 0 && Math.random() < 0.5) {
      const randomPreferred = preferredNumbers[Math.floor(Math.random() * preferredNumbers.length)];
      return randomPreferred;
    }
    return Math.floor(Math.random() * MAX_NUMBER) + 1;
  }
}
