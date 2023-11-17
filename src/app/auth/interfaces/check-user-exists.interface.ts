import HttpStatusCode from 'http-status-typed';
export interface checkUserExists {
  phone: number;
  status: HttpStatusCode;
}
