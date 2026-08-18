import { Layout } from "@/components/layout";
import { Link } from "wouter";
import {
  HelpCircle,
  Coins,
  ShieldAlert,
  Gamepad2,
  AlertTriangle,
  MessageCircle,
  ExternalLink,
  Mail,
  Send,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function FAQ() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-4xl space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Support & Guides</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about sharing accounts, points, launchers, and troubleshooting errors.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {/* Item 1 */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm hover:border-primary/40 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center justify-center shrink-0">
                <Coins className="h-5 w-5" />
              </div>
              <div className="space-y-2 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  1. How To Get Points?
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You can get points by sharing accounts. You get <strong className="text-foreground font-semibold">15 points</strong> per account, also you can make a <strong className="text-foreground font-semibold">paid account</strong>.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link href="/submit">
                    <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                      Share an Account <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm hover:border-primary/40 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="space-y-2 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  2. The Account Sent Code To The Email?
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If the account asks for an <strong className="text-foreground font-semibold">email OTP</strong> or <strong className="text-foreground font-semibold">Steam Authenticator (Steam Guard)</strong>, that means <strong className="text-destructive font-semibold">the account no longer works</strong>. Please use the <strong className="text-foreground font-semibold">Report</strong> button on the account details page so our system can remove it.
                </p>
                <div className="p-3 bg-muted/40 border border-border rounded-xl text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Tip:</span> The same rule applies if the password provided is wrong or expired.
                </div>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm hover:border-primary/40 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Gamepad2 className="h-5 w-5" />
              </div>
              <div className="space-y-3 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  3. The Account Asks For Rockstar / EA / Ubisoft?
                </h2>
                <p className="text-sm text-muted-foreground">
                  If a game requires a third-party publisher launcher bypass, follow these steps:
                </p>

                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside pl-1">
                  <li>
                    Open the bypass tool portal at{" "}
                    <a
                      href="https://steamfamily.online/#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Steamfamily.online <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>Scroll down and select which launcher you want to bypass (Rockstar, EA, Ubisoft, etc.).</li>
                  <li>Install the software and select the game you want to launch.</li>
                  <li>Apply the fix and launch the game.</li>
                </ol>

                <div className="p-3 bg-muted/40 border border-border rounded-xl text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Tip:</span> Not all games are supported. Check the tool compatibility list before launching.
                </div>

                <div className="pt-2">
                  <div className="overflow-hidden rounded-xl border border-border bg-black/40 max-w-lg">
                    <img
                      src="/images/launcher-bypass.png"
                      alt="Launcher bypass tutorial example"
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Item 4 */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm hover:border-primary/40 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-3 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  4. I Have An Error When Logging In To Steam?
                </h2>
                
                <div className="overflow-hidden rounded-xl border border-border bg-black/40 max-w-lg">
                  <img
                    src="/images/steam-error-e87.jpg"
                    alt="Steam login error code example"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  This error (such as Error Code e87) can be caused by two main issues:
                </p>

                <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside pl-1">
                  <li>
                    <strong className="text-foreground">Simultaneous Logins:</strong> Too many people are attempting to access the same account simultaneously.
                  </li>
                  <li>
                    <strong className="text-foreground">Temporary Rate Limit:</strong> Your IP was temporarily restricted because you attempted to log in to too many accounts in a short period of time.
                  </li>
                </ul>

                <div className="bg-muted/60 border border-border rounded-xl p-3 text-xs font-mono text-muted-foreground">
                  Unfortunately, the first cause cannot be resolved directly, however you might try changing your IP address with a VPN to address the second.
                </div>
              </div>
            </div>
          </div>

          {/* Item 5 */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm hover:border-primary/40 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="space-y-3 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  5. Where Can I Get More Help?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Our community and staff are ready to help you with any questions:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <a
                    href="https://t.me/Steam_Family"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/40 hover:bg-secondary/80 hover:border-primary/40 transition-all text-sm group"
                  >
                    <Send className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-semibold text-foreground">Telegram</p>
                      <p className="text-[11px] text-muted-foreground">@Steam_Family</p>
                    </div>
                  </a>

                  <a
                    href="https://discord.gg/3w69MWQcuX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/40 hover:bg-secondary/80 hover:border-primary/40 transition-all text-sm group"
                  >
                    <svg className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.135 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-foreground">Discord</p>
                      <p className="text-[11px] text-muted-foreground">Community Server</p>
                    </div>
                  </a>

                  <a
                    href="mailto:contact@steamfamily.xyz"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/40 hover:bg-secondary/80 hover:border-primary/40 transition-all text-sm group"
                  >
                    <Mail className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-semibold text-foreground">Support Email</p>
                      <p className="text-[11px] text-muted-foreground">contact@steamfamily.xyz</p>
                    </div>
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
