import { IoAdapter } from '@nestjs/platform-socket.io';
import { NextFunction } from 'express';
import * as cookie from 'cookie';
import { UnauthorizedException } from '@nestjs/common';
import { IAuthSocket } from './types/websocket.types';

export class WebsocketsAdapter extends IoAdapter {
  createIOServer(port: number, options: any) {
    const server = super.createIOServer(port, options);
    server.use(async (socket: IAuthSocket, next: NextFunction) => {
      const clientCookie = socket.handshake.headers.cookie;
      if (!clientCookie) {
        return next(new UnauthorizedException('Unauthorized error'));
      }

      const { chatToken } = cookie.parse(clientCookie);
      if (!chatToken) {
        return next(new UnauthorizedException('Unauthorized error'));
      }

      socket.chatToken = chatToken;
      next();
    });

    return server;
  }
}
