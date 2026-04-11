import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Player } from '../models/player';
import { PLAYERS } from '../data/players';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private firestore: Firestore = inject(Firestore);
  private playersCollection = collection(this.firestore, 'players');

  constructor() {}

  // Obtener todos los jugadores
  getPlayers(): Observable<Player[]> {
    return collectionData(this.playersCollection, { idField: 'id' }) as Observable<Player[]>;
  }

  // Añadir jugador
  async addPlayer(player: Player): Promise<void> {
    // Firestore asigna el ID automático al hacer addDoc
    const { id, ...playerInfo } = player as any;
    await addDoc(this.playersCollection, playerInfo);
  }

  // Actualizar jugador
  async updatePlayer(player: Player): Promise<void> {
    if (!player.id) return;
    const playerDocRef = doc(this.firestore, `players/${player.id}`);
    const { id, ...playerInfo } = player as any;
    await updateDoc(playerDocRef, playerInfo);
  }

  // Borrar jugador
  async deletePlayer(id: string): Promise<void> {
    const playerDocRef = doc(this.firestore, `players/${id}`);
    await deleteDoc(playerDocRef);
  }

  // Útil sólo una vez: poblar la BD base de datos de test
  async seedDatabase(): Promise<void> {
    for (const player of PLAYERS) {
      const { id, ...playerData } = player as any;
      await addDoc(this.playersCollection, playerData);
    }
    console.log('Seeded database with initial players.');
  }
}
