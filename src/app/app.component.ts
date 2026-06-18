import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root component standalone dell'applicazione.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-numbers';
}
