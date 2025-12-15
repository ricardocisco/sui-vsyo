import { Link } from "react-router-dom";
import {
  TrendingUp,
  Twitter,
  MessageCircle,
  Github,
  ExternalLink
} from "lucide-react";

const footerLinks = {
  product: [
    { label: "Market", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Create Market", href: "/create" }
  ],
  resources: [
    { label: "Ajuda & FAQ", href: "/help" },
    { label: "Documentação", href: "/docs" },
    { label: "API", href: "/api" }
  ],
  legal: [
    { label: "Termos de Serviço", href: "/terms" },
    { label: "Política de Privacidade", href: "/privacy" },
    { label: "Disclaimer", href: "/disclaimer" }
  ]
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: MessageCircle, href: "https://discord.com", label: "Discord" },
  { icon: Github, href: "https://github.com", label: "GitHub" }
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-cyan-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">
                <span className="text-foreground">Vsyo</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              A decentralized prediction markets. Trade the future with complete
              transparency in Vsyo :).
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Recursos</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vsyo. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href="https://etherscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              Contratos
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
              Rede Ativa
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
