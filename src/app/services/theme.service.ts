import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public isDarkMode = false;

  constructor() {
    // Detecta la preferencia inicial del sistema
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  private applyTheme(): void {
    // Aplica la clase de Ionic 8 en el documento
    document.documentElement.classList.toggle('ion-palette-dark', this.isDarkMode);
    
    // Fuerza al navegador a ignorar el modo oscuro/claro nativo del SO
    if (this.isDarkMode) {
      document.documentElement.style.setProperty('color-scheme', 'dark');
    } else {
      document.documentElement.style.setProperty('color-scheme', 'light');
    }
  }
}