import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient();
      const token = client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new WsException('Authentication token not found');
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.TOKEN_SECRET,
      });

      if (!payload) {
        throw new WsException('Invalid token');
      }

      // Explicitly set the user data
      client.data = {
        user: payload,
      };

      return true;
    } catch (err) {
      console.log('Guard error:', err);
      throw new WsException('Invalid credentials');
    }
  }
}
