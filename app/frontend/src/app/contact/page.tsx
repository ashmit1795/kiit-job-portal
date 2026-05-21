"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { contactService } from "@/services/contact.service";
import { toast } from "sonner";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, MapPin, Phone, Loader2 } from "lucide-react";

import { AxiosError } from "axios";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const mutation = useMutation({
    mutationFn: contactService.sendMessage,
    onSuccess: () => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Logo href="/" height={30} />
      </header>
      <main className="container mx-auto px-4 md:px-6 py-16 max-w-3xl space-y-8 animate-in fade-in duration-300">
        <Link href="/">
          <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent hover:text-emerald-400 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-muted-foreground">Have questions or feedback? We&apos;d love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-card/50">
              <Mail className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Email</h3>
                <p className="text-sm text-muted-foreground">avsaar.careers@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-card/50">
              <Phone className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Phone</h3>
                <p className="text-sm text-muted-foreground">+91 8480476322</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-card/50">
              <MapPin className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Address</h3>
                <p className="text-sm text-muted-foreground">KIIT University, Patia, Bhubaneswar, Odisha — 751024</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border/50 bg-card/50 space-y-4">
            <h2 className="text-lg font-semibold">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Name</Label>
                <Input 
                  placeholder="Your name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={mutation.isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input 
                  type="email" 
                  placeholder="you@kiit.ac.in" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={mutation.isPending}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Message</Label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                  placeholder="How can we help?" 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={mutation.isPending}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-brand hover:opacity-90 text-white font-semibold"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
