import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE, envs } from '../config';

@Module({
    
    imports: [
        ClientsModule.register([
            {
                name: NATS_SERVICE,
                transport: Transport.NATS,
                options: {
                    servers: envs.nats_servers
                }
            }
        ])
    ],
    exports: [
        ClientsModule
    ]

})
export class NatsModule {}
