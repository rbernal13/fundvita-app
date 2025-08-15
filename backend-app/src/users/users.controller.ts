import { Controller, Get, Post, Body, Logger, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {

  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Creando usuario');
    return this.usersService.create(createUserDto);
  }

  @Get('getUserById')
  findOne(@Query('id') id: string) {
    this.logger.log(`Buscando usuario con ID: ${id}`);
    return this.usersService.findOne(id);
  }

}
