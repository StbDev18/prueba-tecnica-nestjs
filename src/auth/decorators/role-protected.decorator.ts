import { SetMetadata } from '@nestjs/common';
import { EnumValidRoles } from '../interfaces';

export const META_ROLES= 'roles';

export const RoleProtected = (...args: EnumValidRoles[]) => {
    return SetMetadata(META_ROLES, args)
};
