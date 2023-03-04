export interface JwtPayload {
  id: number;
  iat: number;
  exp: number;
}

export interface JwtRequest extends Request {
  jwtPayload: JwtPayload;
}
