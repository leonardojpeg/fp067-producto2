import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player';
import { PlayerFilterPipe } from '../../pipes/player-filter.pipe';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule, PlayerFilterPipe],
  templateUrl: './players.html',
  styleUrl: './players.css'
})
export class PlayersComponent implements OnInit {
  @Output() playerSelected = new EventEmitter<Player>();
  @Output() createNew = new EventEmitter<void>();

  private playerService = inject(PlayerService);

  players: Player[] = [];
  selectedPlayerId: string | null = null; // Cambiado a string
  searchText: string = '';
  selectedPosition: string = 'Todas';
  positions: string[] = ['Todas', 'Base', 'Escolta', 'Alero', 'Pívot'];

  ngOnInit() {
    this.playerService.getPlayers().subscribe(data => {
      this.players = data;
    });
  }

  selectPlayer(player: Player): void {
    if (player.id) {
      this.selectedPlayerId = player.id;
      this.playerSelected.emit(player);
    }
  }

  deletePlayer(event: Event, id: string | undefined): void {
    event.stopPropagation(); // Evitar que seleccione la tarjeta
    if (id && confirm('¿Estás seguro de que quieres borrar este jugador?')) {
      this.playerService.deletePlayer(id);
      if (this.selectedPlayerId === id) {
        this.selectedPlayerId = null;
        // emitir un null o crear un evento para limpiar el detalle en el padre
        this.playerSelected.emit(undefined as unknown as Player);
      }
    }
  }

  onSeedDatabase() {
    if (confirm('¿Migrar los 10 jugadores iniciales a Firebase? Solo debes hacerlo una vez.')) {
      this.playerService.seedDatabase();
    }
  }

  onNewPlayer() {
    this.createNew.emit();
  }
}