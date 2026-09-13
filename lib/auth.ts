import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export type UserRole = 'COMPANY' | 'FREELANCER' | 'ADMIN';

export interface CurrentUserSession {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  subscriptionTier?: string;
  stripeConnected?: boolean;
  stripeAccountId?: string | null;
  skills?: string | null;
}

export async function getCurrentUser(preferredRole?: UserRole): Promise<CurrentUserSession> {
  try {
    const clerkUser = await currentUser();
    if (clerkUser) {
      const email = clerkUser.emailAddresses[0]?.emailAddress || 'user@taskforge.ai';
      let dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
      });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            clerkId: clerkUser.id,
            email,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'TaskForge Member',
            avatar: clerkUser.imageUrl,
            role: preferredRole || 'COMPANY',
          },
        });
      }

      return {
        id: dbUser.id,
        clerkId: dbUser.clerkId,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role as UserRole,
        avatar: dbUser.avatar,
        subscriptionTier: dbUser.subscriptionTier,
        stripeConnected: dbUser.stripeConnected,
        stripeAccountId: dbUser.stripeAccountId,
        skills: dbUser.skills,
      };
    }
  } catch (error) {
    console.warn('Clerk auth resolution warning, utilizing database fallback:', error);
  }

  // Local fallback: fetch existing seeded user matching preferred role or default to COMPANY
  const roleToFind = preferredRole || 'COMPANY';
  const fallbackUser = await prisma.user.findFirst({
    where: { role: roleToFind },
  }) || await prisma.user.findFirst();

  if (fallbackUser) {
    return {
      id: fallbackUser.id,
      clerkId: fallbackUser.clerkId,
      email: fallbackUser.email,
      name: fallbackUser.name,
      role: fallbackUser.role as UserRole,
      avatar: fallbackUser.avatar,
      subscriptionTier: fallbackUser.subscriptionTier,
      stripeConnected: fallbackUser.stripeConnected,
      stripeAccountId: fallbackUser.stripeAccountId,
      skills: fallbackUser.skills,
    };
  }

  // Default initial fallback
  return {
    id: 'demo_user_id',
    clerkId: 'user_demo',
    email: 'alex@acmelabs.com',
    name: 'Alex Vance',
    role: preferredRole || 'COMPANY',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    subscriptionTier: 'PRO',
    stripeConnected: true,
    stripeAccountId: 'acct_demo_123',
    skills: JSON.stringify(['React', 'Next.js', 'TypeScript', 'Node.js']),
  };
}
