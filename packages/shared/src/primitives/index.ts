// Primitive utility types, e.g. Email, Url
import { Brand } from '../branding';

export type EmailAddress = Brand<string, 'EmailAddress'>;
export type UrlString = Brand<string, 'UrlString'>;
