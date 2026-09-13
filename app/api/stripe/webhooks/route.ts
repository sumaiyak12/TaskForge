import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!webhookSecret || !signature) {
      return NextResponse.json({ error: 'Missing Stripe webhook signature' }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};

        if (metadata.type === 'FUND_PROJECT' && metadata.projectId) {
          const existingPayment = await prisma.payment.findFirst({
            where: { stripeSessionId: session.id },
          });

          await prisma.project.update({
            where: { id: metadata.projectId },
            data: {
              status: 'FUNDED',
              stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
            },
          });

          if (existingPayment) {
            await prisma.payment.update({
              where: { id: existingPayment.id },
              data: {
                status: 'SUCCEEDED',
                stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
              },
            });
          } else {
            await prisma.payment.create({
              data: {
                projectId: metadata.projectId,
                amount: (session.amount_total || 0) / 100,
                currency: session.currency?.toUpperCase() || 'INR',
                status: 'SUCCEEDED',
                stripeSessionId: session.id,
                stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
              },
            });
          }

          if (metadata.userId) {
            await prisma.notification.create({
              data: {
                userId: metadata.userId,
                title: 'Payment Confirmed! 💳',
                message: 'Your project escrow budget is successfully funded and active.',
                type: 'SUCCESS',
              },
            });
          }
        }

        if (metadata.type === 'PRO_SUBSCRIPTION' && metadata.userId) {
          await prisma.user.update({
            where: { id: metadata.userId },
            data: { subscriptionTier: 'PRO' },
          });

          await prisma.notification.create({
            data: {
              userId: metadata.userId,
              title: 'Upgraded to Pro! 🚀',
              message: 'You now have unlimited AI project breakdowns and priority skill matching.',
              type: 'SUCCESS',
            },
          });
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await prisma.payment.updateMany({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: 'SUCCEEDED' },
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await prisma.payment.updateMany({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: 'FAILED' },
        });
        break;
      }

      case 'transfer.created': {
        const transfer = event.data.object as Stripe.Transfer;
        await prisma.payout.updateMany({
          where: { stripeTransferId: transfer.id },
          data: { status: 'PAID' },
        });
        break;
      }

      case 'payout.paid': {
        const payout = event.data.object as Stripe.Payout;
        console.log(`Stripe Connected Payout paid: ${payout.id}`);
        break;
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        if (account.id) {
          const user = await prisma.user.findFirst({
            where: { stripeAccountId: account.id },
          });

          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                stripeConnected: account.details_submitted && account.charges_enabled,
              },
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
