// src/client/client.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('clients')
export class ClientController {
  constructor(private readonly client: ClientsService) {}

  // Public — Get all clients
  @Get()
  async getAll() {
    return this.client.getAll();
  }

  // Public — Get a single client by ID
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.client.getOne(id);
  }

  // Protected — Create a new client
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() body: CreateClientDto) {
    return this.client.create(body);
  }

  // Protected — Update an existing client
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateClientDto) {
    return this.client.update(id, body);
  }
}
