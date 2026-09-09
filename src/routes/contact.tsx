import { Link, createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | Klyro AI" },
      {
        name: "description",
        content:
          "Official contact information for Klyro AI and Klyro Technologies, including address, email, phone, and operating hours.",
      },
      { property: "og:title", content: "Contact Us | Klyro AI" },
      {
        property: "og:description",
        content:
          "Get in touch with Klyro Technologies, the company behind Klyro AI.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Klyro AI" className="h-8 w-auto" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="panel p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Contact Us
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Official contact details for Klyro AI and Klyro Technologies.
          </p>

          <dl className="mt-8 space-y-6">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Operating Entity
              </dt>
              <dd className="mt-1 text-base font-medium text-foreground">
                Klyro Technologies
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Brand
              </dt>
              <dd className="mt-1 text-base font-medium text-foreground">
                Klyro AI
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Official Address
              </dt>
              <dd className="mt-1 flex items-start gap-3 text-base text-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Door No. 2-45, Mubarak Nagar,
                  <br />
                  Nizamabad, Telangana - 503003, India
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 flex items-center gap-3 text-base text-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href="mailto:founder@klyroai.in"
                  className="hover:text-primary hover:underline"
                >
                  founder@klyroai.in
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Phone
              </dt>
              <dd className="mt-1 flex items-center gap-3 text-base text-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href="tel:+917013778853"
                  className="hover:text-primary hover:underline"
                >
                  +91 7013778853
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Operating Hours
              </dt>
              <dd className="mt-1 text-base text-foreground">
                Mon–Fri, 9:00 AM – 6:00 PM IST
              </dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
