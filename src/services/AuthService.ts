import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { ApiError } from '../middleware/errorHandler';
import { DbPool } from '../database/connection';

export class AuthService {
  private userRepo: UserRepository;

  constructor(db: DbPool) {
    this.userRepo = new UserRepository(db);
  }

  async register(email: string, password: string): Promise<{ token: string; user: object }> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new ApiError(409, 'Email already registered', 'EMAIL_TAKEN');
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.userRepo.create(email, passwordHash);
    const token = this.signToken(user);
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }

  async login(email: string, password: string): Promise<{ token: string; user: object }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }
    const token = this.signToken(user);
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }

  verifyToken(token: string): { sub: string; email: string; role: string } {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');
    return jwt.verify(token, secret) as any;
  }

  private signToken(user: any): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');
    const expiresIn = (process.env.JWT_EXPIRES_IN || '24h') as jwt.SignOptions['expiresIn'];
    return jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn }
    );
  }
}
