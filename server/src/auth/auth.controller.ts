import { Body, Controller, Get, Post, Req, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body('username') username: string, @Body('password') password: string, @Response() res) {
    const data = await this.authService.login({ username, password });
    // res.cookie('accessToken', data.tokens.accessToken, {
    //   expires: new Date(new Date().getTime() + 30 * 1000),
    //   sameSite: 'strict',
    //   httpOnly: true,
    //   secure: true,
    //   withCredentials: true,
    // });
    return res.send(data);
  }

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req: Request) {
    console.log(req.user['sub']);
    await this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    console.log({ userId, refreshToken });
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
