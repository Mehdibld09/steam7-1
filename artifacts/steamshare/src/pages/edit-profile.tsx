import { Layout } from "@/components/layout";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Camera, Lock, Trash2, CheckCircle2, AlertTriangle, User, ArrowLeft, Crown, Palette, ShieldCheck, ShieldOff, ImageIcon, Link2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "wouter";
import { UserBadge, BADGE_OPTIONS } from "@/components/user-badge";

const BAD_WORDS = [
  "nigger","nigga","faggot","retard","cunt","kike","spic","chink","tranny",
  "whore","slut","bitch","asshole","bastard","motherfucker","fucker","shit",
  "cock","dick","pussy","anal","porn","sex","nude","naked","rape","kill",
];

function containsBadWord(text: string): boolean {
  const lower = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  return BAD_WORDS.some((w) => lower.includes(w));
}

const BASIC_COLORS = [
  { hex: "#ef4444", label: "Red", animated: false },
  { hex: "#f97316", label: "Orange", animated: false },
  { hex: "#eab308", label: "Yellow", animated: false },
  { hex: "#22c55e", label: "Green", animated: false },
  { hex: "#3b82f6", label: "Blue", animated: false },
  { hex: "#8b5cf6", label: "Purple", animated: false },
  { hex: "#ec4899", label: "Pink", animated: false },
  { hex: "#06b6d4", label: "Cyan", animated: false },
  { hex: "#ffffff", label: "White", animated: false },
  { hex: "#94a3b8", label: "Silver", animated: false },
  { hex: "rainbow", label: "Rainbow", animated: true, proOnly: true },
  { hex: "fire", label: "Fire 🔥", animated: true, proOnly: true },
  { hex: "ocean", label: "Ocean 🌊", animated: true, proOnly: true },
  { hex: "galaxy", label: "Galaxy 🌌", animated: true, proOnly: true },
  { hex: "neon", label: "Neon ⚡", animated: true, proOnly: true },
  { hex: "gold", label: "Gold ✨", animated: true, proOnly: true },
  { hex: "aurora", label: "Aurora 🌌", animated: true, proOnly: true },
  { hex: "sunset", label: "Sunset 🌅", animated: true, proOnly: true },
  { hex: "ice", label: "Ice 🧊", animated: true, proOnly: true },
  { hex: "toxic", label: "Toxic ☢️", animated: true, proOnly: true },
  { hex: "rose", label: "Rose 🌹", animated: true, proOnly: true },
  { hex: "lava", label: "Lava 🌋", animated: true, proOnly: true },
];

function TwoFactorCard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["2fa-status"],
    queryFn: async () => {
      const res = await fetch("/api/auth/2fa-status", { credentials: "include" });
      if (!res.ok) return { enabled: false };
      return res.json() as Promise<{ enabled: boolean }>;
    },
  });

  const enableMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/2fa/enable", { method: "POST", credentials: "include" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || "Failed"); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["2fa-status"] });
      toast({ title: "Two-factor authentication enabled", description: "A code will be emailed to you each time you sign in." });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const disableMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/2fa", { method: "DELETE", credentials: "include" });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || "Failed"); }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["2fa-status"] });
      toast({ title: "Two-factor authentication disabled" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const enabled = data?.enabled ?? false;
  const busy = enableMutation.isPending || disableMutation.isPending || isLoading;

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <h2 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
        <ShieldCheck className="h-4 w-4" /> Two-Factor Authentication
      </h2>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${enabled ? "bg-green-500/10 border border-green-500/20" : "bg-muted border border-border"}`}>
            {enabled
              ? <ShieldCheck className="h-5 w-5 text-green-400" />
              : <ShieldOff className="h-5 w-5 text-muted-foreground" />
            }
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground flex items-center gap-2">
              {enabled ? "Enabled" : "Disabled"}
              {enabled && <span className="text-[10px] bg-green-500/15 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5 font-bold">ON</span>}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {enabled
                ? "A 6-digit code is emailed to you each time you sign in."
                : "Add an extra layer of security — get a code by email every login."}
            </p>
          </div>
        </div>
        {enabled ? (
          <Button size="sm" variant="outline" className="shrink-0 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => disableMutation.mutate()} disabled={busy}>
            {disableMutation.isPending ? "Disabling…" : "Disable"}
          </Button>
        ) : (
          <Button size="sm" className="shrink-0" onClick={() => enableMutation.mutate()} disabled={busy}>
            {enableMutation.isPending ? "Enabling…" : "Enable"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function EditProfile() {
  const { data: me, isLoading } = useGetMe();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Display name
  const [displayName, setDisplayName] = useState("");
  const [displayNameLoading, setDisplayNameLoading] = useState(false);

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCode, setPasswordCode] = useState("");
  const [passwordCodeSent, setPasswordCodeSent] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete account
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Premium prefs
  const [prefLoading, setPrefLoading] = useState(false);

  // Badge icon state (Pro only)
  const [badgeIconUrl, setBadgeIconUrl] = useState("");
  const [badgeIconLink, setBadgeIconLink] = useState("");

  const { data: premiumStatus, refetch: refetchPremium } = useQuery({
    queryKey: ["/api/premium/status"],
    queryFn: async () => {
      const res = await fetch("/api/premium/status", { credentials: "include" });
      if (!res.ok) return null;
      return res.json() as Promise<{
        tier: string | null;
        isActive: boolean;
        nameColor: string | null;
        badgeType: string | null;
        badgeIconUrl: string | null;
        badgeIconLink: string | null;
        expiresAt: string | null;
      }>;
    },
    enabled: !!me,
  });

  if (isLoading) return null;
  if (!me) {
    setLocation("/login");
    return null;
  }

  const isPremium = premiumStatus?.isActive && (premiumStatus.tier === "premium" || premiumStatus.tier === "pro");
  const isPro = premiumStatus?.isActive && premiumStatus.tier === "pro";

  const handleDisplayNameSave = async () => {
    const trimmed = displayName.trim();
    if (!trimmed) return;
    if (trimmed.length < 2 || trimmed.length > 30) {
      toast({ title: "Display name must be 2–30 characters", variant: "destructive" });
      return;
    }
    if (containsBadWord(trimmed)) {
      toast({ title: "Display name contains inappropriate content", variant: "destructive" });
      return;
    }
    setDisplayNameLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: trimmed }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "Failed to update display name");
      }
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      toast({ title: "Display name updated!" });
      setDisplayName("");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setDisplayNameLoading(false);
    }
  };

  const handleAvatarSave = async () => {
    setAvatarLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: avatarUrl || null }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "Failed to update avatar");
      }
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      toast({ title: "Profile picture updated!" });
      setAvatarUrl("");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: null }),
      });
      if (!res.ok) throw new Error("Failed");
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      toast({ title: "Profile picture removed" });
    } catch {
      toast({ title: "Error", description: "Failed to remove avatar", variant: "destructive" });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "At least 6 characters required", variant: "destructive" });
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "Failed to change password");
      }
      setPasswordCodeSent(true);
      toast({ title: "Confirmation code sent", description: "Check your email to finish changing your password." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordCodeConfirm = async () => {
    if (!/^\d{6}$/.test(passwordCode)) {
      toast({ title: "Enter the 6-digit code", variant: "destructive" });
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password/confirm", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: passwordCode }),
      });
      const e = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(e.error || "Failed to confirm password change");
      toast({ title: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordCode("");
      setPasswordCodeSent(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/auth/account", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "Failed to delete account");
      }
      queryClient.clear();
      setLocation("/");
      toast({ title: "Account deleted" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePremiumPref = async (patch: { nameColor?: string | null; badgeType?: string | null; badgeIconUrl?: string | null; badgeIconLink?: string | null }) => {
    setPrefLoading(true);
    try {
      const res = await fetch("/api/premium/preferences", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "Failed to update preferences");
      }
      refetchPremium();
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      toast({ title: "Preferences saved!" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setPrefLoading(false);
    }
  };

  const previewUrl = avatarUrl || me.avatarUrl || undefined;
  const currentDisplayName = (me as any).displayName || "";
  const displayedDisplayName = displayName || currentDisplayName;
  const isBadWord = displayName.trim().length > 0 && containsBadWord(displayName.trim());

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-lg space-y-6">
        <button onClick={() => window.history.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-2xl font-black">Edit Profile</h1>

        {/* ── Display Name ── */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <h2 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
            <User className="h-4 w-4" /> Display Name
          </h2>
          <p className="text-xs text-muted-foreground -mt-2">
            This is the name others see on your profile. Your login username (<strong className="text-foreground">{me.username}</strong>) stays the same.
          </p>
          <div className="space-y-2">
            <Input
              placeholder={currentDisplayName || "Enter a display name…"}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={30}
              className={isBadWord ? "border-destructive focus:border-destructive" : ""}
            />
            {isBadWord && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> This name contains inappropriate content.
              </p>
            )}
            {displayedDisplayName && !isBadWord && (
              <p className="text-xs text-muted-foreground">Preview: <span className="text-foreground font-medium">{displayedDisplayName}</span></p>
            )}
          </div>
          <Button
            onClick={handleDisplayNameSave}
            disabled={!displayName.trim() || isBadWord || displayNameLoading}
            className="w-full"
          >
            {displayNameLoading ? "Saving…" : "Save Display Name"}
          </Button>
        </div>

        {/* ── Avatar ── */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <h2 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
            <Camera className="h-4 w-4" /> Profile Picture
          </h2>

          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 border-2 border-border shrink-0">
              <AvatarImage src={previewUrl} />
              <AvatarFallback className="text-2xl bg-secondary">
                {(me.username?.substring(0, 2) ?? "").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <p className="text-xs text-muted-foreground">Paste an image URL to set your profile picture.</p>
              <Input
                placeholder="https://example.com/avatar.jpg"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAvatarSave}
              disabled={!avatarUrl || avatarLoading}
              className="flex-1"
            >
              {avatarLoading ? "Saving..." : "Save Picture"}
            </Button>
            {me.avatarUrl && (
              <Button
                variant="outline"
                onClick={handleRemoveAvatar}
                disabled={avatarLoading}
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                Remove
              </Button>
            )}
          </div>
        </div>

        {/* ── Premium Customization ── */}
        {isPremium ? (
          <div className="bg-card border border-yellow-500/30 rounded-xl p-6 space-y-5">
            <h2 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wide text-yellow-400">
              <Crown className="h-4 w-4" /> Premium Customization
            </h2>
            <p className="text-xs text-muted-foreground -mt-2">
              Customize your badge and name color. Changes appear on all your posts and comments.
              {premiumStatus?.expiresAt && (
                <span> Subscription expires <strong className="text-foreground">{new Date(premiumStatus.expiresAt).toLocaleDateString()}</strong>.</span>
              )}
            </p>

            {/* Name Color */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" /> Name Color
              </label>
              <div className="flex flex-wrap gap-2">
                {BASIC_COLORS.map((c) => {
                  const isProOnly = c.animated && !isPro;
                  const isSelected = premiumStatus?.nameColor === c.hex;
                  const swatchClass = c.hex === "rainbow" ? "rainbow-swatch"
                    : c.hex === "fire" ? "fire-swatch"
                    : c.hex === "ocean" ? "ocean-swatch"
                    : c.hex === "galaxy" ? "galaxy-swatch"
                    : c.hex === "neon" ? "neon-swatch"
                    : c.hex === "gold" ? "gold-swatch"
                    : c.hex === "aurora" ? "aurora-swatch"
                    : c.hex === "sunset" ? "sunset-swatch"
                    : c.hex === "ice" ? "ice-swatch"
                    : c.hex === "toxic" ? "toxic-swatch"
                    : c.hex === "rose" ? "rose-swatch"
                    : c.hex === "lava" ? "lava-swatch"
                    : "";
                  return (
                    <button
                      key={c.hex}
                      title={isProOnly ? `${c.label} — Pro only` : c.label}
                      onClick={() => !isProOnly && handlePremiumPref({ nameColor: c.hex })}
                      disabled={prefLoading || isProOnly}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${isProOnly ? "opacity-30 cursor-not-allowed" : ""} ${swatchClass}`}
                      style={c.animated ? {
                        borderColor: isSelected ? "#fff" : "transparent",
                        boxShadow: isSelected ? "0 0 0 2px rgba(255,255,255,0.5)" : undefined,
                      } : {
                        backgroundColor: c.hex,
                        borderColor: isSelected ? "#fff" : "transparent",
                        boxShadow: isSelected ? "0 0 0 2px rgba(255,255,255,0.5)" : undefined,
                      }}
                    />
                  );
                })}
                {premiumStatus?.nameColor && (
                  <button
                    onClick={() => handlePremiumPref({ nameColor: null })}
                    disabled={prefLoading}
                    className="w-8 h-8 rounded-full border-2 border-border text-muted-foreground hover:text-foreground flex items-center justify-center text-xs transition-colors"
                    title="Remove color"
                  >
                    ✕
                  </button>
                )}
              </div>
              {premiumStatus?.nameColor && (
                <p className="text-xs text-muted-foreground">
                  Preview:{" "}
                  {premiumStatus.nameColor === "rainbow" ? (
                    <span className="rainbow-text font-semibold">{me.username}</span>
                  ) : premiumStatus.nameColor === "fire" ? (
                    <span className="fire-text font-semibold">{me.username}</span>
                  ) : premiumStatus.nameColor === "ocean" ? (
                    <span className="ocean-text font-semibold">{me.username}</span>
                  ) : premiumStatus.nameColor === "galaxy" ? (
                    <span className="galaxy-text font-semibold">{me.username}</span>
                  ) : premiumStatus.nameColor === "neon" ? (
                    <span className="neon-text font-semibold">{me.username}</span>
                  ) : premiumStatus.nameColor === "gold" ? (
                    <span className="gold-text font-semibold">{me.username}</span>
                  ) : premiumStatus.nameColor === "aurora" ? (
                    <span className="aurora-text font-semibold">{me.username}</span>
                  ) : premiumStatus.nameColor === "sunset" ? (
                    <span className="sunset-text font-semibold">{me.username}</span>
                  ) : premiumStatus.nameColor === "ice" ? (
                    <span className="ice-text font-semibold">{me.username}</span>
                  ) : premiumStatus.nameColor === "toxic" ? (
                    <span className="toxic-text font-semibold">{me.username}</span>
                  ) : premiumStatus.nameColor === "rose" ? (
                    <span className="rose-text font-semibold">{me.username}</span>
                  ) : premiumStatus.nameColor === "lava" ? (
                    <span className="lava-text font-semibold">{me.username}</span>
                  ) : (
                    <span style={{ color: premiumStatus.nameColor }} className="font-semibold">{me.username}</span>
                  )}
                </p>
              )}
            </div>

            {/* Badge */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Badge</label>
              <div className="flex flex-wrap gap-2">
                {BADGE_OPTIONS.map((opt) => {
                  const isProRequired = opt.pro && !isPro;
                  const isSelected = premiumStatus?.badgeType === opt.key;
                  return (
                    <button
                      key={opt.key}
                      title={isProRequired ? `${opt.label} requires Pro` : opt.label}
                      onClick={() => !isProRequired && handlePremiumPref({ badgeType: opt.key })}
                      disabled={prefLoading || isProRequired}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all
                        ${isSelected ? "border-yellow-500 bg-yellow-500/10 text-yellow-300" : "border-border hover:border-yellow-500/40"}
                        ${isProRequired ? "opacity-40 cursor-not-allowed" : ""}
                      `}
                    >
                      <UserBadge badgeType={opt.key} size={15} />
                      <span>{opt.label}</span>
                      {opt.pro && <span className="text-[9px] text-blue-400 font-bold ml-0.5">PRO</span>}
                    </button>
                  );
                })}
                {premiumStatus?.badgeType && (
                  <button
                    onClick={() => handlePremiumPref({ badgeType: null })}
                    disabled={prefLoading}
                    className="px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Custom Icon Badge — Pro only */}
            <div className={`space-y-3 border-t border-border pt-4 ${!isPro ? "opacity-30 pointer-events-none select-none" : ""}`}>
              <label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-blue-400" />
                Custom Icon Badge
                <span className="text-[9px] text-blue-400 font-bold bg-blue-400/10 border border-blue-400/30 rounded-full px-2 py-0.5">PRO</span>
              </label>
              <p className="text-xs text-muted-foreground -mt-1">
                Show a custom image as your badge. Paste any image URL — it appears next to your name on your profile.
              </p>

              {isPro && premiumStatus?.badgeIconUrl && (
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                  <UserBadge
                    badgeIconUrl={premiumStatus.badgeIconUrl}
                    badgeIconLink={premiumStatus.badgeIconLink ?? undefined}
                    size={28}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{premiumStatus.badgeIconUrl}</p>
                    {premiumStatus.badgeIconLink && (
                      <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                        <Link2 className="h-3 w-3" />{premiumStatus.badgeIconLink}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handlePremiumPref({ badgeIconUrl: null })}
                    disabled={prefLoading}
                    className="text-xs text-destructive hover:text-destructive/80 shrink-0"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    placeholder="https://example.com/icon.png"
                    value={badgeIconUrl}
                    onChange={(e) => setBadgeIconUrl(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    placeholder="https://example.com (optional link)"
                    value={badgeIconLink}
                    onChange={(e) => setBadgeIconLink(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (!badgeIconUrl.trim()) return;
                    handlePremiumPref({
                      badgeIconUrl: badgeIconUrl.trim(),
                      badgeIconLink: badgeIconLink.trim() || null,
                    });
                    setBadgeIconUrl("");
                    setBadgeIconLink("");
                  }}
                  disabled={!badgeIconUrl.trim() || prefLoading}
                  size="sm"
                >
                  {prefLoading ? "Saving…" : "Save Icon Badge"}
                </Button>
              </div>
            </div>
            {!isPro && (
              <div className="border-t border-border pt-4">
                <Link href="/premium" className="block">
                  <Button variant="outline" size="sm" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                    <Crown className="h-3.5 w-3.5 mr-2" /> Upgrade to Pro to unlock animated colors & custom badge
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border border-yellow-500/20 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wide text-yellow-400">
                <Crown className="h-4 w-4" /> Premium Customization
              </h2>
              <span className="text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-full px-2 py-0.5 font-bold flex items-center gap-1">
                <Lock className="h-3 w-3" /> Locked
              </span>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">
              Upgrade to Premium or Pro to unlock these customizations.
            </p>

            {/* Faded preview — non-interactive */}
            <div className="opacity-40 pointer-events-none select-none space-y-5">
              {/* Name Color preview */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4" /> Name Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {BASIC_COLORS.filter(c => !c.animated).map((c) => (
                    <div
                      key={c.hex}
                      className="w-8 h-8 rounded-full border-2 border-transparent"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                  {BASIC_COLORS.filter(c => c.animated).map((c) => (
                    <div
                      key={c.hex}
                      className={`w-8 h-8 rounded-full border-2 border-transparent ${
                        c.hex === "rainbow" ? "rainbow-swatch"
                        : c.hex === "fire" ? "fire-swatch"
                        : c.hex === "ocean" ? "ocean-swatch"
                        : c.hex === "galaxy" ? "galaxy-swatch"
                        : c.hex === "neon" ? "neon-swatch"
                        : c.hex === "gold" ? "gold-swatch"
                        : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Badge preview */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Badge</label>
                <div className="flex flex-wrap gap-2">
                  {BADGE_OPTIONS.map((opt) => (
                    <div
                      key={opt.key}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm"
                    >
                      <UserBadge badgeType={opt.key} size={15} />
                      <span>{opt.label}</span>
                      {opt.pro && <span className="text-[9px] text-blue-400 font-bold ml-0.5">PRO</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/premium" className="block">
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                <Crown className="h-4 w-4 mr-2" /> Get Premium to Unlock
              </Button>
            </Link>
          </div>
        )}

        {/* ── Change Password ── */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
            <Lock className="h-4 w-4" /> Change Password
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium block mb-1">Current Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">New Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Confirm New Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive mt-1">Passwords don't match</p>
              )}
              {newPassword && confirmPassword && newPassword === confirmPassword && (
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Passwords match</p>
              )}
            </div>
          </div>

          {!passwordCodeSent ? (
            <Button
              onClick={handlePasswordChange}
              disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || passwordLoading}
              className="w-full"
            >
              {passwordLoading ? "Sending code..." : "Send confirmation code"}
            </Button>
          ) : (
            <div className="space-y-3 border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to your email to finish changing your password.
              </p>
              <Input
                value={passwordCode}
                onChange={(e) => setPasswordCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => { if (e.key === "Enter") handlePasswordCodeConfirm(); }}
                placeholder="000000"
                inputMode="numeric"
                maxLength={6}
                className="h-12 text-center text-2xl font-mono tracking-widest"
                autoFocus
              />
              <Button
                onClick={handlePasswordCodeConfirm}
                disabled={passwordCode.length !== 6 || passwordLoading}
                className="w-full"
              >
                {passwordLoading ? "Confirming..." : "Confirm password change"}
              </Button>
              <button
                type="button"
                onClick={() => { setPasswordCodeSent(false); setPasswordCode(""); }}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Start over
              </button>
            </div>
          )}
        </div>

        {/* ── Two-Factor Authentication ── */}
        <TwoFactorCard />

        {/* ── Danger Zone ── */}
        <div className="bg-card border border-destructive/30 rounded-xl p-6 space-y-3">
          <h2 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wide text-destructive">
            <AlertTriangle className="h-4 w-4" /> Danger Zone
          </h2>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all data. This cannot be undone.
          </p>
          <Button
            variant="outline"
            className="w-full border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete My Account
          </Button>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Delete Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              This will permanently delete your account, all your uploads, and all your data. Enter your password to confirm.
            </p>
            <Input
              type="password"
              placeholder="Enter your password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { setDeleteOpen(false); setDeletePassword(""); }}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={!deletePassword || deleteLoading}
                onClick={handleDeleteAccount}
              >
                {deleteLoading ? "Deleting..." : "Delete Forever"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
