import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../../models/player';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class DetailComponent implements OnChanges {
  @Input() player: Player | null = null;
  @Input() isCreating: boolean = false;
  @Output() closeDetail = new EventEmitter<void>();

  private playerService = inject(PlayerService);

  isEditing: boolean = false;
  editData: Player | null = null;
  positions: string[] = ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot'];

  ngOnChanges(): void {
    if (this.isCreating) {
      this.isEditing = true;
      // editData es una copia para no mutar el original en el data binding antes de guardar
      this.editData = this.player ? { ...this.player } : null;
    } else {
      this.isEditing = false;
      this.editData = null;
    }
  }

  toggleEdit(): void {
    this.isEditing = true;
    this.editData = this.player ? { ...this.player } : null;
  }

  cancelEdit(): void {
    if (this.isCreating) {
      this.close(); // Si cancela la creación, se cierra todo
    } else {
      this.isEditing = false;
      this.editData = null;
    }
  }

  async saveChanges(): Promise<void> {
    if (!this.editData) return;
    
    if (this.isCreating) {
      await this.playerService.addPlayer(this.editData);
      this.close(); // Cerramos tras crear
    } else {
      // Editar existente
      await this.playerService.updatePlayer(this.editData);
      this.player = { ...this.editData }; // actualiza la vista localmente
      this.isEditing = false;
    }
  }

  close(): void {
    this.closeDetail.emit();
  }
}