import { useEffect } from "react";
import { useLocation } from "wouter";

// Email verification was removed — redirect anyone landing here to login.
export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation("/login"); }, []);
  return null;
}
