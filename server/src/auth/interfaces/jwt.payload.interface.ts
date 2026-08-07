export type JwtTokenType = 'access' | 'refresh';

export interface JwtPayload {
  roles: 'admin' | null;
  id: string;
  type: JwtTokenType;
}
