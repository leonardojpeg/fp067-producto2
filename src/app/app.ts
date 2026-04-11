import { Component } from '@angular/core';
import { Player } from './models/player';
import { PlayersComponent } from './components/players/players';
import { DetailComponent } from './components/detail/detail';
import { MediaComponent } from './components/media/media';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PlayersComponent, DetailComponent, MediaComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  selectedPlayer: Player | null = null;
  isCreating: boolean = false;

  onPlayerSelected(player: Player): void {
    // Si nos pasan un player "limpio" (undefined) significa que se borró el actual
    if (!player) {
      this.clearSelection();
      return;
    }
    this.selectedPlayer = player;
    this.isCreating = false;
  }

  handleCreateNew(): void {
    const emptyPlayer: Player = {
      nombre: '',
      apellidos: '',
      posicion: 'Base',
      edad: 0,
      altura: '',
      dorsal: 0,
      equipo: 'Los Angeles Lakers',
      estado: 'Disponible',
      perfil: '',
      video: '',
      imagen: ''
    };
    this.selectedPlayer = emptyPlayer;
    this.isCreating = true;
  }

  clearSelection(): void {
    this.selectedPlayer = null;
    this.isCreating = false;
  }
}