# 🚀 Portfolio Deployment Guide

**Complete step-by-step guide to deploy your portfolio website to Vercel**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Prepare Your Code](#step-1-prepare-your-code)
3. [Step 2: Push to GitHub](#step-2-push-to-github)
4. [Step 3: Setup Formspree (Contact Form)](#step-3-setup-formspree-contact-form)
5. [Step 4: Deploy to Vercel](#step-4-deploy-to-vercel)
6. [Step 5: Configure Environment Variables](#step-5-configure-environment-variables)
7. [Step 6: Verify Deployment](#step-6-verify-deployment)
8. [Step 7: Custom Domain (Optional)](#step-7-custom-domain-optional)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have:

- ✅ **GitHub Account** - [Sign up here](https://github.com/signup)
- ✅ **Vercel Account** - [Sign up here](https://vercel.com/signup) (use GitHub to sign in)
- ✅ **Formspree Account** - [Sign up here](https://formspree.io/register) (for contact form)
- ✅ **Git installed** on your computer
- ✅ **Node.js 18+** installed

---

## Step 1: Prepare Your Code

### 1.1 Test Locally

Make sure everything works on your local machine:

```bash
cd portfolio-website

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and verify:
- ✅ All sections load correctly
- ✅ Navigation works
- ✅ Images display properly
- ✅ Theme toggle works
- ✅ No console errors

### 1.2 Build for Production

Test the production build:

```bash
npm run build
npm run start
```

If the build succeeds, you're ready to deploy!

---

## Step 2: Push to GitHub

### 2.1 Create a New Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository:
   - **Name**: `portfolio-website` (or any name you prefer)
   - **Visibility**: Public or Private
   - **DO NOT** initialize with README (you already have one)
3. Click "Create repository"

### 2.2 Push Your Code

```bash
# Navigate to your project
cd portfolio-website

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Portfolio website ready for deployment"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/portfolio-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ **Verify**: Go to your GitHub repository and confirm all files are uploaded.

---

## Step 3: Setup Formspree (Contact Form)

### 3.1 Create Formspree Account

1. Go to [Formspree.io](https://formspree.io/register)
2. Sign up with your email
3. Verify your email address

### 3.2 Create a New Form

1. Click **"New Form"**
2. **Form Name**: `Portfolio Contact Form`
3. **Email**: Enter the email where you want to receive messages
4. Click **"Create Form"**

### 3.3 Get Your Form Endpoint

After creating the form, you'll see:
```
https://formspree.io/f/YOUR_FORM_ID
```

**Copy this URL** - you'll need it in Step 5!

---

## Step 4: Deploy to Vercel

### 4.1 Sign in to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### 4.2 Import Your Repository

1. Click **"Add New..."** → **"Project"**
2. Find your `portfolio-website` repository
3. Click **"Import"**

### 4.3 Configure Project

Vercel will auto-detect Next.js settings:

- **Framework Preset**: Next.js ✅ (auto-detected)
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅

**DO NOT CLICK DEPLOY YET!** We need to add environment variables first.

---

## Step 5: Configure Environment Variables

### 5.1 Add Environment Variables in Vercel

Before deploying, click **"Environment Variables"** section and add:

#### Variable 1: Formspree Endpoint
- **Name**: `NEXT_PUBLIC_FORMSPREE_ENDPOINT`
- **Value**: `https://formspree.io/f/YOUR_FORM_ID` (from Step 3.3)
- **Environment**: Select all (Production, Preview, Development)

#### Variable 2: Your Email
- **Name**: `PORTFOLIO_OWNER_EMAIL`
- **Value**: `your-email@example.com` (your actual email)
- **Environment**: Select all (Production, Preview, Development)

#### Variable 3: Site URL
- **Name**: `NEXT_PUBLIC_SITE_URL`
- **Value**: Leave empty for now (we'll update after deployment)
- **Environment**: Select all (Production, Preview, Development)

### 5.2 Deploy!

Click **"Deploy"** button and wait 2-3 minutes.

---

## Step 6: Verify Deployment

### 6.1 Check Deployment Status

Vercel will show:
- ✅ Building...
- ✅ Deploying...
- ✅ Ready!

### 6.2 Visit Your Live Site

Click **"Visit"** or the deployment URL (e.g., `portfolio-website-xyz.vercel.app`)

### 6.3 Test Everything

- ✅ Homepage loads
- ✅ All sections visible
- ✅ Navigation works
- ✅ Images load
- ✅ Contact form submits (test it!)
- ✅ Resume downloads
- ✅ Theme toggle works

### 6.4 Update Site URL

1. Copy your Vercel deployment URL
2. Go to **Project Settings** → **Environment Variables**
3. Edit `NEXT_PUBLIC_SITE_URL`
4. Set value to your Vercel URL: `https://portfolio-website-xyz.vercel.app`
5. Click **"Save"**
6. Go to **Deployments** tab
7. Click **"Redeploy"** on the latest deployment

---

## Step 7: Custom Domain (Optional)

### 7.1 Purchase a Domain

Buy a domain from:
- [Namecheap](https://www.namecheap.com)
- [GoDaddy](https://www.godaddy.com)
- [Google Domains](https://domains.google)

### 7.2 Add Domain in Vercel

1. Go to your project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter your domain (e.g., `yourname.com`)
5. Click **"Add"**

### 7.3 Configure DNS

Vercel will show you DNS records to add. Go to your domain registrar and add:

**Option A: CNAME Record (Recommended)**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Option B: A Record**
```
Type: A
Name: @
Value: 76.76.21.21
```

### 7.4 Wait for Verification

- DNS propagation takes 5 minutes to 48 hours
- Vercel will automatically verify and provision SSL certificate
- You'll receive an email when it's ready

### 7.5 Update Environment Variable

1. Go to **Environment Variables**
2. Update `NEXT_PUBLIC_SITE_URL` to `https://yourname.com`
3. Redeploy

---

## 🎉 Congratulations!

Your portfolio is now live! Here's what you have:

- ✅ **Live Website**: Accessible worldwide
- ✅ **Automatic HTTPS**: Secure SSL certificate
- ✅ **Global CDN**: Fast loading everywhere
- ✅ **Auto Deployments**: Push to GitHub = auto deploy
- ✅ **Contact Form**: Receive messages via email
- ✅ **Analytics**: Track visitors (Vercel Analytics)

---

## 🔄 Making Updates

### Update Content

1. Edit files in `src/data/` locally
2. Test with `npm run dev`
3. Commit and push:
   ```bash
   git add .
   git commit -m "Update content"
   git push
   ```
4. Vercel automatically deploys in 2-3 minutes!

### Update Code

Same process - just push to GitHub and Vercel handles the rest.

---

## Troubleshooting

### ❌ Build Failed

**Error**: TypeScript errors
```bash
# Run locally to see errors
npm run type-check

# Fix errors and push again
```

**Error**: Missing dependencies
```bash
# Make sure package-lock.json is committed
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

### ❌ Contact Form Not Working

1. **Check Formspree endpoint** in environment variables
2. **Verify email** in Formspree dashboard
3. **Test form** on Formspree website first
4. **Check spam folder** for test emails

### ❌ Images Not Loading

1. **Check file paths** in `src/data/projects.ts`
2. **Verify images exist** in `public/images/`
3. **Check console** for 404 errors
4. **Redeploy** after fixing

### ❌ Environment Variables Not Working

1. **Must start with** `NEXT_PUBLIC_` for client-side access
2. **Redeploy** after changing variables
3. **Check spelling** - variable names are case-sensitive

### ❌ Domain Not Working

1. **Wait 24-48 hours** for DNS propagation
2. **Check DNS records** at [dnschecker.org](https://dnschecker.org)
3. **Verify in Vercel** - should show "Valid Configuration"
4. **Clear browser cache** and try incognito mode

---

## 📊 Monitoring Your Site

### Vercel Dashboard

Access at [vercel.com/dashboard](https://vercel.com/dashboard):

- **Analytics**: Visitor stats, page views
- **Speed Insights**: Performance metrics
- **Deployments**: History of all deployments
- **Logs**: Error logs and debugging info

### Formspree Dashboard

Access at [formspree.io/forms](https://formspree.io/forms):

- **Submissions**: All contact form messages
- **Email notifications**: Configure alerts
- **Spam protection**: Built-in spam filtering

---

## 🔒 Security Best Practices

1. ✅ **Never commit** `.env.local` to GitHub
2. ✅ **Use different API keys** for development and production
3. ✅ **Enable 2FA** on GitHub and Vercel accounts
4. ✅ **Regularly update** dependencies
5. ✅ **Monitor** Vercel logs for suspicious activity

---

## 💰 Cost Breakdown

### Free Tier (What You're Using)

**Vercel Free**:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Basic analytics

**Formspree Free**:
- ✅ 50 submissions/month
- ✅ Email notifications
- ✅ Spam filtering

**Total Cost**: $0/month 🎉

### If You Need More

**Vercel Pro** ($20/month):
- 1TB bandwidth
- Advanced analytics
- Password protection
- Priority support

**Formspree Gold** ($10/month):
- 1,000 submissions/month
- File uploads
- Custom redirects
- Integrations

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Formspree Documentation](https://help.formspree.io)
- [GitHub Documentation](https://docs.github.com)

---

## 🆘 Need Help?

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Formspree Support**: [help.formspree.io](https://help.formspree.io)
- **GitHub Issues**: Create an issue in your repository

---

<div align="center">

**🎉 Your portfolio is live! Share it with the world! 🌍**

Made with ❤️ using Next.js and Vercel

</div>

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Formspree Documentation](https://help.formspree.io)
- [GitHub Documentation](https://docs.github.com)

---

## 🆘 Need Help?

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Formspree Support**: [help.formspree.io](https://help.formspree.io)
- **GitHub Issues**: Create an issue in your repository

---

<div align="center">

**🎉 Your portfolio is live! Share it with the world! 🌍**

Made with ❤️ using Next.js and Vercel

</div>

1. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project"
   - Import your portfolio repository
   - Vercel will automatically detect Next.js configuration

2. **Configure Build Settings** (auto-detected from `vercel.json`):
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Development Command: `npm run dev`

### 2. Environment Variables Configuration

Configure the following environment variables in Vercel:

#### Required Variables

```bash
# Email Integration (Resend)
RESEND_API_KEY=re_your_api_key_here
PORTFOLIO_OWNER_EMAIL=your-email@example.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

#### Optional Variables

```bash
# Analytics (automatically configured by Vercel)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=auto-configured
```

**To add environment variables in Vercel**:
1. Go to Project Settings → Environment Variables
2. Add each variable with appropriate scope:
   - **Production**: Live site environment
   - **Preview**: Pull request preview deployments
   - **Development**: Local development (use `.env.local` instead)

### 3. Automatic Deployment Setup

Vercel automatically configures:

✅ **Main Branch Deployment**:
- Every push to `main` branch triggers production deployment
- Automatic build and deployment pipeline
- Zero-downtime deployments with instant rollback capability

✅ **Preview Deployments**:
- Every pull request gets a unique preview URL
- Isolated environment for testing changes
- Automatic cleanup when PR is closed

✅ **SSL/TLS Certificates**:
- Automatic HTTPS for all deployments
- Free SSL certificates via Let's Encrypt
- Automatic certificate renewal

### 4. Custom Domain Configuration

#### Adding a Custom Domain

1. **In Vercel Dashboard**:
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., `arnavtiwari.com`)

2. **Configure DNS Records**:

   **Option A: Using Vercel Nameservers (Recommended)**:
   ```
   Update nameservers at your domain registrar:
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

   **Option B: Using CNAME Record**:
   ```
   Type: CNAME
   Name: www (or @)
   Value: cname.vercel-dns.com
   ```

   **Option C: Using A Record**:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

3. **Verify Domain**:
   - Vercel will automatically verify DNS configuration
   - SSL certificate is provisioned automatically (takes 1-5 minutes)
   - Domain becomes active once verification completes

4. **Update Environment Variables**:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
   ```

#### Domain Best Practices

- **Redirect www to apex** (or vice versa): Configure in Vercel domain settings
- **Use HTTPS only**: Enforced automatically by Vercel
- **Update sitemap**: Ensure `NEXT_PUBLIC_SITE_URL` matches your domain

### 5. Deployment Verification

After deployment, verify the following:

#### Performance Checks
```bash
# Run Lighthouse audit
npm run test -- lighthouse-quality-standards.spec.ts

# Check Core Web Vitals
npm run test -- core-web-vitals-performance.spec.ts

# Verify bundle size
npm run build:check
```

#### Functionality Checks
- [ ] Homepage loads correctly
- [ ] All sections render properly
- [ ] Contact form submits successfully
- [ ] Resume download works
- [ ] Navigation functions on mobile and desktop
- [ ] Analytics tracking is active

#### Security Checks
- [ ] HTTPS is enforced
- [ ] Security headers are present
- [ ] No API keys exposed in client code
- [ ] Contact form rate limiting works

### 6. Monitoring and Analytics

#### Vercel Analytics

Automatically enabled for all deployments:
- Real-time visitor analytics
- Core Web Vitals monitoring
- Performance insights
- No configuration required

#### Custom Event Tracking

The portfolio tracks:
- Resume downloads
- Contact form submissions
- Project link clicks
- External link navigation

View analytics in Vercel Dashboard → Analytics tab.

## Advanced Configuration

### Preview Deployment Settings

Configure preview deployment behavior in Vercel:

1. **Automatic Preview Deployments**:
   - Enabled by default for all branches
   - Each PR gets a unique URL: `portfolio-website-git-branch-username.vercel.app`

2. **Preview Environment Variables**:
   - Use separate API keys for preview deployments
   - Test email integration without affecting production

3. **Preview Deployment Protection**:
   - Enable password protection for preview deployments
   - Useful for client reviews before going live

### Deployment Hooks

Vercel provides deployment hooks for automation:

```bash
# Trigger deployment via webhook
curl -X POST https://api.vercel.com/v1/integrations/deploy/[hook-id]
```

Use cases:
- Trigger rebuild when CMS content changes
- Scheduled deployments for content updates
- Integration with CI/CD pipelines

### Environment-Specific Configuration

The `vercel.json` file configures:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "RESEND_API_KEY": "@resend_api_key",
    "FROM_EMAIL": "@from_email",
    "TO_EMAIL": "@to_email"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()"
        }
      ]
    }
  ]
}
```

### Rollback Procedures

If a deployment causes issues:

1. **Instant Rollback**:
   - Go to Deployments tab in Vercel
   - Find the last working deployment
   - Click "Promote to Production"

2. **Git Revert**:
   ```bash
   git revert HEAD
   git push origin main
   ```
   - Automatically triggers new deployment with reverted changes

### Performance Optimization

Vercel automatically provides:
- **Edge Network**: Global CDN with 100+ locations
- **Image Optimization**: Automatic WebP conversion and resizing
- **Smart Caching**: Intelligent cache invalidation
- **Compression**: Automatic Brotli/Gzip compression

## Troubleshooting

### Common Issues

#### Build Failures

**Issue**: Build fails with TypeScript errors
```bash
# Solution: Run type check locally
npm run type-check

# Fix errors and push again
```

**Issue**: Build fails with missing dependencies
```bash
# Solution: Ensure package-lock.json is committed
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

#### Environment Variable Issues

**Issue**: Contact form not working
```bash
# Check environment variables are set correctly
# Verify RESEND_API_KEY starts with 're_'
# Ensure PORTFOLIO_OWNER_EMAIL is valid
```

**Issue**: Analytics not tracking
```bash
# Verify NEXT_PUBLIC_SITE_URL is set
# Check Vercel Analytics is enabled in project settings
```

#### Domain Configuration Issues

**Issue**: Domain not resolving
```bash
# Verify DNS records are correct
# Wait 24-48 hours for DNS propagation
# Use DNS checker: https://dnschecker.org
```

**Issue**: SSL certificate not provisioning
```bash
# Ensure domain is verified in Vercel
# Check DNS records point to Vercel
# Wait 5-10 minutes for certificate generation
```

### Getting Help

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: Available in dashboard for Pro plans
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass (`npm run test:all`)
- [ ] Environment variables configured in Vercel
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Contact form tested with real email
- [ ] Resume PDF uploaded and accessible
- [ ] Analytics tracking verified
- [ ] Performance metrics meet targets (Lighthouse ≥ 95)
- [ ] Security headers verified
- [ ] Mobile responsiveness tested
- [ ] Cross-browser compatibility verified

## Maintenance

### Regular Updates

1. **Dependency Updates**:
   ```bash
   npm outdated
   npm update
   npm run test:all
   git commit -am "Update dependencies"
   git push
   ```

2. **Content Updates**:
   - Edit files in `src/data/`
   - Commit and push to trigger deployment
   - Verify changes in preview deployment

3. **Security Updates**:
   - Monitor Dependabot alerts
   - Apply security patches promptly
   - Test thoroughly before deploying

### Monitoring

- **Check Vercel Dashboard** weekly for:
  - Deployment status
  - Performance metrics
  - Error logs
  - Analytics trends

- **Run automated tests** regularly:
  ```bash
  npm run test:all
  ```

## Cost Considerations

### Vercel Free Tier Includes:
- Unlimited deployments
- 100GB bandwidth per month
- Automatic HTTPS
- Preview deployments
- Analytics (basic)
- 100 serverless function executions per day

### Upgrade Considerations:
- **Pro Plan** ($20/month):
  - Increased bandwidth and function executions
  - Advanced analytics
  - Priority support
  - Password protection for deployments

### Resend Free Tier Includes:
- 100 emails per day
- 1 verified domain
- Email API access

## Security Best Practices

1. **Environment Variables**:
   - Never commit `.env.local` to Git
   - Use different API keys for production and preview
   - Rotate API keys periodically

2. **Access Control**:
   - Limit Vercel project access to necessary team members
   - Use GitHub branch protection rules
   - Require PR reviews before merging to main

3. **Monitoring**:
   - Enable Vercel deployment notifications
   - Monitor error logs regularly
   - Set up alerts for failed deployments

## Conclusion

Your portfolio is now deployed with:
- ✅ Automatic deployments from GitHub
- ✅ HTTPS/SSL encryption
- ✅ Global CDN distribution
- ✅ Preview deployments for testing
- ✅ Environment variables configured
- ✅ Custom domain (if configured)
- ✅ Analytics and monitoring

For questions or issues, refer to the troubleshooting section or Vercel documentation.
