import { Layout } from "@/components/layout";
import {
  FileText,
  Shield,
  AlertCircle,
  Lock,
  Users,
  CheckCircle2,
  Mail,
  Scale,
  Eye,
} from "lucide-react";

export default function Terms() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-4xl space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Scale className="h-3.5 w-3.5" />
            <span>Legal & Community</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Terms of Service & Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Please read our community rules, terms of service, and privacy guidelines carefully to ensure a safe and transparent experience.
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div id="terms" className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                1. General Community Conduct
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                All members are expected to maintain respectful communication across comments, profile customizations, messages, and uploaded content. Harassment, abusive language, hate speech, and spam are strictly prohibited.
              </p>
              <ul className="space-y-2 list-disc list-inside pl-1">
                <li>Do not spam comments, reports, or messages.</li>
                <li>Do not impersonate administrators, moderators, or other community members.</li>
                <li>Keep community interactions civil, helpful, and constructive.</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Shield className="h-4 w-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                2. Account Sharing & Accuracy
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                When submitting shared Steam accounts or libraries, you agree to provide authentic, valid information without deceptive credentials.
              </p>
              <ul className="space-y-2 list-disc list-inside pl-1">
                <li>Do not submit deliberately non-working accounts to farm points.</li>
                <li>Accounts with Steam Guard or 2FA enabled must be reported immediately.</li>
                <li>Repeatedly uploading fake or broken accounts will result in an immediate account ban and point forfeiture.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
                <Lock className="h-4 w-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                3. Premium Subscriptions & Store
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                Premium and Pro perks (such as custom badges, animated name colors, elevated privileges, and priority tools) are granted per active subscription period.
              </p>
              <ul className="space-y-2 list-disc list-inside pl-1">
                <li>Digital purchases and points redemption are subject to active platform availability.</li>
                <li>Attempts to exploit, glitch, or bypass transaction safeguards will lead to termination of service.</li>
              </ul>
            </div>
          </div>

          {/* Section 4: Privacy Policy */}
          <div id="privacy" className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm scroll-mt-20">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Eye className="h-4 w-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                4. Privacy Policy & Data Handling
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                We value your privacy. We collect minimal information required to operate account authentication and community features:
              </p>
              <ul className="space-y-2 list-disc list-inside pl-1">
                <li><strong className="text-foreground">Authentication:</strong> Your email address and hashed passwords are stored securely to verify ownership and deliver security codes.</li>
                <li><strong className="text-foreground">Usage & Safety:</strong> We monitor abusive IP patterns, multi-accounting, and bot submissions to protect community accounts.</li>
                <li><strong className="text-foreground">Third-Party Services:</strong> We do not sell or trade your personal information to third parties.</li>
                <li><strong className="text-foreground">Account Deletion:</strong> You can permanently delete your account and all associated data at any time in Edit Profile &gt; Security.</li>
              </ul>
            </div>
          </div>

          {/* Section 5: Reporting */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                <AlertCircle className="h-4 w-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                5. Reporting & Contact
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                If you encounter non-working accounts, inappropriate profiles, or suspicious activity, please utilize the built-in report tools or message support directly.
              </p>
              <div className="p-4 bg-muted/40 border border-border rounded-xl flex items-start gap-3">
                <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Have questions or inquiries?</span> Contact us directly at{" "}
                  <a href="mailto:contact@steamfamily.xyz" className="text-primary font-medium hover:underline">
                    contact@steamfamily.xyz
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
