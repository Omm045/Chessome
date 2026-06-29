import { Controller, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateUserPreferences } from '@chessome/application';
import { User } from '@chessome/core';
import { PrismaUserRepository } from '@chessome/database';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly userRepository: PrismaUserRepository) {}

  @Patch('me/preferences')
  @UseGuards(JwtAuthGuard)
  async updatePreferences(@Req() req: any, @Body() dto: UpdatePreferencesDto) {
    const user: User = req.user;
    
    // Instantiate use case manually for now (can inject later)
    const useCase = new UpdateUserPreferences(this.userRepository);
    
    const updatedUser = await useCase.execute(user.id, dto);
    
    return updatedUser.toJSON();
  }
}
