import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel, isAdminOrSelf, isAdminOrSelfFieldLevel, isMember } from '@/payload/access/member'

export const Members: CollectionConfig = {
  slug: 'members',
  access: {
    admin: isMember,
    unlock: isAdmin,
    create: isAdmin,
    delete: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'username', 'email', 'createdAt', 'updatedAt'],
    useAsTitle: 'name',
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: true,
      requireUsername: true,
    },
    cookies: {
      domain: process.env.COOKIE_DOMAIN,
      sameSite: process.env.NODE_ENV === 'production' && !process.env.DISABLE_SECURE_COOKIE ? 'None' : undefined,
      secure: process.env.NODE_ENV === 'production' && !process.env.DISABLE_SECURE_COOKIE ? true : undefined,
    },
    tokenExpiration: 28800, // 8 hours
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    // Email added by default
    {
      name: 'roles',
      type: 'select',
      access: {
        create: isAdminFieldLevel,
        read: isAdminOrSelfFieldLevel,
        update: isAdminFieldLevel,
      },
      defaultValue: 'member',
      hasMany: false,
      options: ['admin', 'member'],
      required: true,
    },
  ],
  timestamps: true,
}
