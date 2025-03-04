export class UnprocessableContent extends Error {
    details: any;
  
    constructor(message: string, details: any) {
      super(message);
      this.name = 'UnprocessableContent';
      this.details = details;
    }
  }