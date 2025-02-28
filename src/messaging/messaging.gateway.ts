import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { NotificationService } from './services/notification.service';
import { MessageService } from './services/message.service';
import { JwtService } from '@nestjs/jwt';
import { NearbyHospitalService } from 'src/health-facility/nearbyHospitalService';
import { EmergenceServiceService } from 'src/emergence-service/emergence-service.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<number, Socket> = new Map();

  constructor(
    private readonly messageService: MessageService,
    private readonly notificationService: NotificationService,
    private readonly emergenceService: EmergenceServiceService,
    private jwtService: JwtService,
  ) {}
  @UseGuards(WsJwtGuard)
  async handleConnection(client: Socket) {
    const token = client?.handshake?.headers?.authorization?.split(' ')[1];
    if (!token) {
      console.error('Token is missing in the headers');
      client.disconnect();
      return;
    }
    client.data.user = this.jwtService.verify(token, {
      secret: process.env.TOKEN_SECRET,
    });
    if (client.data) {
      const loggedInUserRole = client?.data?.user?.role;
      const userId = client.data.user.sub.id;
      this.connectedUsers.set(userId, client);
      const pendingMessages =
        await this.messageService.getPendingMessages(userId);
      const pendingNotifications =
        await this.notificationService.getPendingNotifications(
          userId,
          loggedInUserRole,
        );

      client.emit('pending-messages', pendingMessages);
      client.emit('pending-notifications', pendingNotifications);
    } else {
      console.error('User data is missing in the client');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client?.data?.user?.sub?.id;
    this.connectedUsers.delete(userId);
  }
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send-message')
  async handleMessage(
    client: Socket,
    payload: { receiverId: number; content: string },
  ) {
    const senderId = client?.data?.user?.sub?.id;

    const message = await this.messageService.create({
      content: payload.content,
      senderId,
      receiverId: payload.receiverId,
    });
    const receiverSocket = this.connectedUsers.get(payload.receiverId);
    if (receiverSocket) {
      receiverSocket.emit('new-message', message);
    }
    // ============ Create a notification for the receiver ============
    await this.notificationService.create({
      userId: payload.receiverId,
      content: `New message from ${client?.data?.user?.email}`,
      type: 'chat',
      sender: senderId,
      data: {},
      hospitalId: null,
    });
  }
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('read-message')
  async handleReadMessage(client: Socket, messageId: number) {
    await this.messageService.markAsRead(messageId);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('read-notification')
  async handleReadNotification(client: Socket, notificationId: number) {
    await this.notificationService.markAsRead(notificationId);
  }
  // ============ Emergency Alert ============
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send-emergence-alert')
  async handleEmergenceAlert(
    client: Socket,
    payload: {
      location: { latitude: number; longitude: number };
      emergencyType: string;
      hospitalIds: number[];
      senderInfo: { id: number; name: string; role: string };
    },
  ) {
    try {
      await Promise.all(
        payload.hospitalIds.map(async (hospitalId) => {
          // Create emergency service entry
          await this.emergenceService.create(client.data.user.sub.id, {
            location: payload.location,
            emergencyType: payload.emergencyType,
            isResolved: false,
            assignedFacilityId: hospitalId,
            user: client.data.user.sub.id,
          });

          // Create notification
          await this.notificationService.create({
            hospitalId: hospitalId,
            userId: null,
            content: `EMERGENCY ALERT from ${payload.senderInfo.name}`,
            type: 'emergency',
            data: {
              location: payload.location,
              emergencyType: payload.emergencyType,
              sender: payload.senderInfo.id,
            },
            sender: payload.senderInfo.id,
          });
          // Emit socket event
          const hospitalSocket = this.connectedUsers.get(hospitalId);
          if (hospitalSocket) {
            hospitalSocket.emit('emergency-alert', {
              location: payload.location,
              emergencyType: payload.emergencyType,
              sender: payload.senderInfo,
              timestamp: new Date().toISOString(),
            });
          }
        }),
      );

      // Send response back to sender
      client.emit('emergency-alert-response', {
        success: true,
        notifiedHospitals: payload.hospitalIds.length,
      });
    } catch (error) {
      console.error('Error handling emergency alert:', error);
      client.emit('emergency-alert-response', {
        success: false,
        error: 'Failed to send emergency alert',
      });
    }
  }
}
