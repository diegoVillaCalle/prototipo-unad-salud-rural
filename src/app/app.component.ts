import { Component, OnInit, Renderer2 } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AppComponent implements OnInit {
  public sidebarVisible = true;
  public currentYear: number = new Date().getFullYear();

  constructor(
    private location: Location,
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Inicializar el estado del sidebar basado en localStorage o default a visible
    const savedState = localStorage.getItem('sidebarVisible');
    this.sidebarVisible = savedState ? savedState === 'true' : true;
    this.updateBodyClass();
  }

  sidebarToggle() {
    this.sidebarVisible = !this.sidebarVisible;
    // Guardar preferencia del usuario
    localStorage.setItem('sidebarVisible', this.sidebarVisible.toString());
    this.updateBodyClass();
  }

  private updateBodyClass() {
    if (!this.sidebarVisible) {
      this.renderer.removeClass(document.body, 'nav-closed');
    } else {
      this.renderer.addClass(document.body, 'nav-closed');
    }
  }

  getTitle() {
    let title = this.location.prepareExternalUrl(this.location.path());
    if (title.charAt(0) === '#') {
      title = title.slice(1);
    }
    if (title === '/') {
      return 'Dashboard';
    }
    const titleParts = title.split('/');
    const lastPart = titleParts[titleParts.length - 1];
    return lastPart ? lastPart.charAt(0).toUpperCase() + lastPart.slice(1) : 'Dashboard';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
