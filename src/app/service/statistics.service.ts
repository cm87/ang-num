import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Interfaccia per le statistiche dei numeri.
 */
export interface Statistics {
  hotNumbers: number[];  // Numeri più frequenti
  coldNumbers: number[]; // Numeri meno frequenti (ritardatari)
  lastUpdated: Date;
}

/**
 * Servizio per recuperare le statistiche dei numeri
 * da fonti esterne in tempo reale.
 */
@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly STATISTICS_URL = 'https://lotteryguru.com/italy-lottery-results/it-superenalotto/it-superenalotto-statistics';
  private cachedStatistics: Statistics | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 3600000; // 1 ora in ms

  constructor(private http: HttpClient) {}

  /**
   * Recupera le statistiche dei numeri (frequenti e ritardatari).
   * Usa cache per evitare chiamate ripetute.
   */
  getStatistics(): Observable<Statistics> {
    const now = Date.now();
    
    // Ritorna cache se ancora valida
    if (this.cachedStatistics && now < this.cacheExpiry) {
      return of(this.cachedStatistics);
    }

    return this.http.get(this.STATISTICS_URL, { responseType: 'text' }).pipe(
      map(html => this.parseStatistics(html)),
      map(stats => {
        this.cachedStatistics = stats;
        this.cacheExpiry = now + this.CACHE_DURATION;
        return stats;
      }),
      catchError(error => {
        console.error('Errore nel recupero delle statistiche:', error);
        // Ritorna dati di fallback se il fetch fallisce
        return of(this.getFallbackStatistics());
      })
    );
  }

  /**
   * Parsa l'HTML del sito per estrarre numeri frequenti e ritardatari.
   */
  private parseStatistics(html: string): Statistics {
    const hotNumbers = this.extractNumbersFromSection(html, 'The Most Common Drawn Numbers');
    const coldNumbers = this.extractNumbersFromSection(html, 'The Least Often Drawn Numbers');

    return {
      hotNumbers,
      coldNumbers,
      lastUpdated: new Date()
    };
  }

  /**
   * Estrae i numeri da una sezione specifica dell'HTML.
   */
  private extractNumbersFromSection(html: string, sectionHeader: string): number[] {
    const sectionIndex = html.indexOf(sectionHeader);
    if (sectionIndex === -1) {
      return [];
    }

    // Cerca la lista di numeri dopo l'header
    const sectionStart = sectionIndex + sectionHeader.length;
    const sectionEnd = html.indexOf('###', sectionStart);
    const sectionContent = sectionEnd !== -1 ? html.substring(sectionStart, sectionEnd) : html.substring(sectionStart);

    // Estrae tutti i numeri (1-90) usando regex
    const numberRegex = /\b([1-9]|[1-8][0-9]|90)\b/g;
    const matches = sectionContent.match(numberRegex);
    
    return matches ? matches.map(Number) : [];
  }

  /**
   * Dati di fallback se il fetch delle statistiche fallisce.
   * Numeri basati su statistiche storiche.
   */
  private getFallbackStatistics(): Statistics {
    return {
      hotNumbers: [42, 56, 9, 18, 90, 7, 72],
      coldNumbers: [70, 76, 50, 67, 87, 15, 73],
      lastUpdated: new Date()
    };
  }

  /**
   * Invalida la cache per forzare un nuovo fetch.
   */
  invalidateCache(): void {
    this.cachedStatistics = null;
    this.cacheExpiry = 0;
  }
}
