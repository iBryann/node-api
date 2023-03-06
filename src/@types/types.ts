export interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}

export interface JwtRequest extends Request {
  jwtPayload: JwtPayload;
}
