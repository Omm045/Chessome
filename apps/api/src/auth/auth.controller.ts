import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '@chessome/core';

@Controller('v1/auth')
export class AuthController {
  
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: any) {
    const user: User = req.user;
    return user.toJSON();
  }
}
