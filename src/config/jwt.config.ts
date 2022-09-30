import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = async (
  cfg: ConfigService,
): Promise<JwtModuleOptions> => ({ secret: cfg.get('JWT_SECRET') });
