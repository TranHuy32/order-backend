import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  emitEvent(arg0: string, arg1: (newDish: any) => void) {
    throw new Error('Method not implemented.');
  }
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      socket.emit('connected', 'Hello from server!');
      console.log(socket.id);
      console.log('Connected');
    });
    // this.server.on('disconnect', (reason) => {
    //   console.log(reason);
    //   console.log('Disconnected');
    // });
  }
  //   OnGatewayDisconnect() {
  //     this.server.on('disconnect', (socket) => {
  //       console.log(socket.id);
  //       console.log('Disconnected');
  //     });
  //   }
  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  //   @SubscribeMessage('identity')
  //   async identity(@MessageBody() data: number): Promise<number> {
  //     this.server.emit('createDish', data);
  //     console.log(data);
  //     return data;
  //   }

  @SubscribeMessage('newMessage')
  //   gửi message
  onNewMessage(@MessageBody() body: any) {
    this.server.emit('onMessage', body);
    console.log(body);
  }

  @SubscribeMessage('createDish')
  async createDish(@MessageBody() data: any): Promise<any> {
    this.server.emit('newDish', data);
    return data;
  }

  @SubscribeMessage('createCallStaff')
  async createCallStaff(@MessageBody() data: any): Promise<any> {
    this.server.emit('newCallStaff', data);
    return data;
  }

  @SubscribeMessage('createCart')
  async createCart(@MessageBody() data: any): Promise<any> {
    this.server.emit('newCart', data);
    return data;
  }

  @SubscribeMessage('activeTable')
  async activeTable(@MessageBody() data: any): Promise<any> {
    this.server.emit('activeTable', data);
    return data;
  }

  @SubscribeMessage('changeStatus')
  async changeStatus(@MessageBody() data: any): Promise<any> {
    this.server.emit('statusChanged', data);
    return data;
  }

  @SubscribeMessage('login')
  async login(@MessageBody() data: any): Promise<any> {
    this.server.emit('anotherLogin', data);
    return data;
  }
}
