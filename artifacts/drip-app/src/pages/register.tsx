import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button, Input, Label } from "@/components/ui/core";
import { motion } from "framer-motion";

export default function Register() {
  const [, setLocation] = useLocation();
  const { register, isRegistering } = useAuth();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(formData);
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "Failed to register");
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background px-6 py-12 flex flex-col">
      <Link href="/landing" className="font-display italic text-2xl mb-12">DRIP.</Link>
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
        <h1 className="font-display text-4xl mb-2">Create Account</h1>
        <p className="font-body text-muted-foreground mb-8">Begin your style evolution.</p>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 mb-6 text-sm rounded-none">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Username</Label>
            <Input 
              type="text" 
              required 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="dripmaster"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input 
              type="password" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>
          
          <Button type="submit" className="w-full mt-4" size="lg" isLoading={isRegistering}>
            Join
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground font-body">
          Already have an account? <Link href="/login" className="text-foreground border-b border-foreground pb-0.5 uppercase font-display tracking-wider text-xs font-bold ml-2">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
