import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Package,
  Map,
  ShieldCheck,
  Star,
  TrendingUp,
  Clock,
  ChevronRight,
} from "lucide-react";

export function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b py-4 px-6 bg-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">MD</span>
            </div> */}
            <Image
              src="/logo.svg"
              alt="MargaDarshi Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="font-semibold text-lg">MargaDarshi</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm text-foreground/70 hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-foreground/70 hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-foreground/70 hover:text-foreground"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="default"
                size="lg"
                className="hover:bg-primary/90 cursor-pointer"
              >
                Sign in
              </Button>
            </Link>
            {/* <Link href="/login">
              <Button size="sm">Get started</Button>
            </Link> */}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Smart Parcel Delivery Management Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your delivery operations with real-time tracking,
            intelligent routing, and comprehensive analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="w-full sm:w-auto hover:bg-primary/90 cursor-pointer"
              >
                Start for free
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Book a demo
            </Button>
          </div>
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent h-12 bottom-0 z-10"></div>
            <div className="relative w-full h-[400px]">
              <Image
                src="/dashboard_for_landing_page.png"
                alt="Margadarshi Dashboard Preview"
                className="rounded-lg shadow-xl border"
                fill
                style={{ objectFit: "fill" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive delivery management platform offers everything
              you need to run efficient operations.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-muted-foreground">
                Monitor all your deliveries in real-time with accurate GPS
                tracking and status updates.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Routing</h3>
              <p className="text-muted-foreground">
                Optimize delivery routes to minimize travel time and reduce fuel
                consumption.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Management</h3>
              <p className="text-muted-foreground">
                Keep your delivery data secure with our enterprise-grade
                security and access controls.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Driver Performance</h3>
              <p className="text-muted-foreground">
                Track and manage driver performance with ratings, feedback, and
                performance metrics.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-muted-foreground">
                Gain insights into your delivery operations with comprehensive
                analytics and reports.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Delivery Scheduling
              </h3>
              <p className="text-muted-foreground">
                Plan and schedule deliveries efficiently with our smart
                scheduling system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to streamline your delivery operations?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that use MargaDarshi to manage their
            deliveries efficiently.
          </p>
          <Link href="/login">
            <Button
              size="lg"
              variant="secondary"
              className="hover:bg-secondary/90 cursor-pointer"
            >
              Get started for free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              {/* <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">MD</span>
              </div> */}
              <Image
                src="/logo.svg"
                alt="MargaDarshi Logo"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="font-semibold">MargaDarshi</span>
            </div>
            <div className="flex flex-wrap gap-8 justify-center mb-4 md:mb-0">
              <Link
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MargaDarshi. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
