import { Injectable } from '@nestjs/common';
import { IAuthSocket } from './types/websocket.types';

@Injectable()
export class GatewaySessions {
  private readonly sessions: Map<number, IAuthSocket> = new Map();

  getUserSocket(id: number) {
    return this.sessions.get(id);
  }

  setUserSocket(id: number, socket: IAuthSocket) {
    return this.sessions.set(id, socket);
  }

  removeSocket(id: number) {
    return this.sessions.delete(id);
  }

  getSessions() {
    return this.sessions;
  }
}
