export class WrongPasswordException extends Error {
  constructor(){
    super(ERROR_MSG_LOGIN.WRONG_PASSWORD);
  }
}