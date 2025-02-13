import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  
  register() {
    return { msg: 'I have registered' }
  }

  login() {
    return { msg: 'I have logged in' }
  }
}
