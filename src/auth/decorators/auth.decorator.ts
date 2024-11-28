import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EnumValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role.guard';

export function Auth(...roles: EnumValidRoles[]) {
  return applyDecorators(
    UseGuards(AuthGuard(), UserRoleGuard),
    RoleProtected(...roles),
  );
}