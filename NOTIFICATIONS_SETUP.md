# 📬 Order Notifications Setup Guide

This guide explains how to receive WhatsApp and Email notifications when customers place orders on your website.

## 🎯 Features Implemented

✅ **Color Variations** - Customers can select colors for products
✅ **Sold Out Button** - Products show "Sold out" when stock is 0
✅ **Collection Filtering** - Catalogue page filters by collection
✅ **Order Notifications** - Get notified via WhatsApp & Email when orders are placed

---

## 📱 WhatsApp Notifications (via Twilio)

### Prerequisites
- Twilio account ([Sign up free](https://www.twilio.com/try-twilio))
- WhatsApp Sandbox enabled (free for testing)

### Setup Steps

1. **Get Twilio Credentials**
   - Go to [Twilio Console](https://console.twilio.com/)
   - Copy your **Account SID** and **Auth Token**

2. **Enable WhatsApp Sandbox**
   - Go to Messaging → Try it out → Send a WhatsApp message
   - Follow instructions to join sandbox (send code to their WhatsApp number)
   - Note your sandbox number (e.g., `whatsapp:+14155238886`)

3. **Add Environment Variables**

   **For Vercel deployment** (server/api):
   ```bash
   TWILIO_ACCOUNT_SID="your_account_sid"
   TWILIO_AUTH_TOKEN="your_auth_token"
   TWILIO_WHATSAPP_FROM="whatsapp:+14155238886"  # Twilio sandbox number
   ADMIN_WHATSAPP="whatsapp:+447733729418"       # Your WhatsApp (with country code)
   ```

   **For Firebase Functions**:
   ```bash
   firebase functions:config:set \
     twilio.sid="your_account_sid" \
     twilio.token="your_auth_token" \
     twilio.from="whatsapp:+14155238886" \
     admin.whatsapp="whatsapp:+447733729418"
   ```

4. **Install Twilio Package**
   ```bash
   cd server
   npm install twilio

   cd ../functions
   npm install twilio
   ```

### Production Setup (After Testing)
- For production, you need to:
  1. [Apply for WhatsApp Business Account](https://www.twilio.com/whatsapp/request-access)
  2. Get your own WhatsApp Business number
  3. Update `TWILIO_WHATSAPP_FROM` with your approved number

---

## 📧 Email Notifications (via SendGrid)

### Prerequisites
- SendGrid account ([Sign up free](https://signup.sendgrid.com/))
- Verified sender email

### Setup Steps

1. **Get SendGrid API Key**
   - Go to [SendGrid Dashboard](https://app.sendgrid.com/)
   - Settings → API Keys → Create API Key
   - Name it "Be Afrique Notifications"
   - Give it "Full Access" or "Mail Send" permission
   - Copy the API key (shown only once!)

2. **Verify Sender Email**
   - Settings → Sender Authentication
   - Verify an email address (e.g., orders@beafrique.com)
   - Click verification link in email

3. **Add Environment Variables**

   **For Vercel deployment** (server/api):
   ```bash
   SENDGRID_API_KEY="SG.xxxxxxxxxxxxxxxx"
   ADMIN_EMAIL="Bukonla@beafrique.com"
   FROM_EMAIL="orders@beafrique.com"  # Must be verified in SendGrid
   ```

   **For Firebase Functions**:
   ```bash
   firebase functions:config:set \
     sendgrid.key="SG.xxxxxxxxxxxxxxxx" \
     admin.email="Bukonla@beafrique.com"
   ```

4. **Install SendGrid Package**
   ```bash
   cd server
   npm install @sendgrid/mail

   cd ../functions
   npm install @sendgrid/mail
   ```

---

## 🔧 Configure Stripe Webhook

For notifications to work, Stripe needs to send events to your webhook endpoint.

### 1. Get Webhook Endpoint URL

**For Vercel**:
```
https://your-domain.com/api/stripeWebhook
```

**For Firebase**:
```
https://us-central1-YOUR-PROJECT.cloudfunctions.net/stripeWebhook
```

### 2. Add Webhook in Stripe Dashboard

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **+ Add endpoint**
3. Enter your webhook URL
4. Select event: `checkout.session.completed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)

### 3. Add Webhook Secret to Environment

**For Vercel**:
```bash
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxx"
```

**For Firebase**:
```bash
firebase functions:config:set stripe.webhook="whsec_xxxxxxxxxxxxxxxx"
```

---

## ✅ Testing Notifications

### Test Order Flow
1. Add a product to cart
2. Go to checkout
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete checkout
5. Check your WhatsApp and Email for notifications!

### Test Card Details
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits
ZIP: Any 5 digits
```

### Troubleshooting

**No notifications received?**
- Check Vercel/Firebase logs for errors
- Verify environment variables are set correctly
- Make sure Stripe webhook is active and receiving events
- For WhatsApp: Ensure you've joined the Twilio sandbox

**Webhook signature error?**
- Double-check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Ensure webhook endpoint URL is correct

**WhatsApp not sending?**
- Verify you've sent the join code to Twilio's sandbox number
- Check Twilio logs in console
- Ensure phone numbers include country code with + prefix

---

## 📝 What Notifications Include

### WhatsApp Message
```
🎉 NEW ORDER RECEIVED!

Order ID: ord_1234567890
Amount: GBP 79.00
Customer: customer@email.com
Phone: +44 1234 567890

Items:
- Hanna Jacket (x1)

Shipping: John Doe
123 Main St
London, UK W1 1AA

View full details in your Stripe dashboard.
```

### Email Notification
- Professional HTML email with:
  - Order summary
  - Customer details
  - Shipping address
  - Itemized list with prices
  - Link to Stripe dashboard

---

## 🚀 Deployment

### Deploy to Vercel
```bash
cd server
vercel env add TWILIO_ACCOUNT_SID
vercel env add TWILIO_AUTH_TOKEN
vercel env add TWILIO_WHATSAPP_FROM
vercel env add ADMIN_WHATSAPP
vercel env add SENDGRID_API_KEY
vercel env add ADMIN_EMAIL
vercel env add FROM_EMAIL
vercel env add STRIPE_WEBHOOK_SECRET

vercel --prod
```

### Deploy Firebase Functions
```bash
cd functions
npm run build
firebase deploy --only functions
```

---

## 💡 Optional: Email-Only Setup

If you don't want WhatsApp notifications, just skip the Twilio setup. The system will only send emails if WhatsApp credentials are missing.

---

## 🆘 Support

- Twilio Support: https://support.twilio.com/
- SendGrid Support: https://support.sendgrid.com/
- Stripe Webhooks: https://stripe.com/docs/webhooks

---

## 📌 Summary Checklist

- [ ] Twilio account created & WhatsApp sandbox joined
- [ ] SendGrid account created & sender email verified
- [ ] Twilio credentials added to environment
- [ ] SendGrid API key added to environment
- [ ] Stripe webhook configured with correct URL
- [ ] Stripe webhook secret added to environment
- [ ] Packages installed (`twilio`, `@sendgrid/mail`)
- [ ] Tested with Stripe test card
- [ ] Received test notifications

---

**Need help?** Check the logs in your Vercel/Firebase dashboard for detailed error messages.
