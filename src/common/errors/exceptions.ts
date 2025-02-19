export class ResourceNotFoundException extends Error {
  constructor(msg: string){
    super(msg)
  }
}

export class DuplicatedResourceException extends Error {
  constructor(msg: string){
    super(msg)
  }
}