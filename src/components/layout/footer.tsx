'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Mail, 
  Github, 
  Twitter, 
  Instagram, 
  Facebook,
  Shield,
  FileText,
  HelpCircle,
  Zap
} from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Don't show footer on auth pages
  const hideFooter = pathname.startsWith('/login') || 
                    pathname.startsWith('/register') || 
                    pathname.startsWith('/forgot-password');

  if (hideFooter) {
    return null;
  }

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Nutrition Facts', href: '/dashboard' },
      { name: 'Myth Busting', href: '/dashboard/myths' },
      { name: 'API Documentation', href: '/docs' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press Kit', href: '/press' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Contact Support', href: '/support' },
      { name: 'Status', href: '/status' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/healthyme', icon: Twitter },
    { name: 'Facebook', href: 'https://facebook.com/healthyme', icon: Facebook },
    { name: 'Instagram', href: 'https://instagram.com/healthyme', icon: Instagram },
    { name: 'GitHub', href: 'https://github.com/healthyme', icon: Github },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">H</span>
              </div>
              <span className="text-xl font-bold text-foreground">HealthyME</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              AI-powered nutrition facts and myth-busting to help you make informed health decisions.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-primary" />
              <span>Powered by Google AI</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-sm font-semibold text-foreground mb-1">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">
                Get the latest nutrition insights and health tips.
              </p>
            </div>
            <div className="flex w-full md:w-auto space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button size="sm" className="whitespace-nowrap">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>© {currentYear} HealthyME. All rights reserved.</span>
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for better health</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-9 w-9 px-0"
                >
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-4 w-4" />
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Health Disclaimer */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-muted">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Health Disclaimer</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The information provided by HealthyME is for educational purposes only and should not be considered medical advice. 
                Always consult with a healthcare professional before making changes to your diet or health regimen. 
                Our AI-powered analysis is designed to provide general nutritional information and should not replace professional medical guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}