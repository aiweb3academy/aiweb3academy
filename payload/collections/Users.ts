import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel } from '@/payload/access/isAdmin'
import { isAdminOrSelf, isAdminOrSelfFieldLevel } from '@/payload/access/isAdminOrSelf'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: isAdmin,
    create: isAdmin,
    delete: isAdminOrSelf,
    read: () => true,
    update: isAdminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: {
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
      defaultValue: ['member'],
      hasMany: true,
      options: ['admin', 'member'],
      required: true,
    },
  ],
  timestamps: true,
}
