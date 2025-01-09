import type { Access, AccessArgs, FieldAccess } from 'payload'

export const isMember: (args: AccessArgs) => boolean = ({ req: { user } }) => {
  // Return true or false based on if the member is logged in
  return Boolean(user)
}

export const isMemberFieldLevel: FieldAccess = ({ req: { user } }) => {
  // Return true or false based on if the member is logged in
  return Boolean(user)
}

export const isAdmin: (args: AccessArgs) => boolean = ({ req: { user } }) => {
  // Return true or false based on if the member has an admin role
  return Boolean(user?.roles?.includes('admin'))
}

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  // Return true or false based on if the member has an admin role
  return Boolean(user?.roles?.includes('admin'))
}

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    // If member has role of 'admin'
    if (user.roles?.includes('admin')) {
      return true
    }

    // If any other type of member, only provide access to themselves
    return {
      id: {
        equals: user.id,
      },
    }
  }

  // Reject everyone else
  return false
}

export const isAdminOrSelfFieldLevel: FieldAccess = ({ id, req: { user } }) => {
  // Return true or false based on if the member has an admin role
  if (user?.roles?.includes('admin')) {
    return true
  }

  if (user?.id === id) {
    return true
  }

  // Reject everyone else
  return false
}
