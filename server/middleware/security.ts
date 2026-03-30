import helmet from "helmet";
import { Express } from "express";

export const applySecurity = (app: Express) => {
  const isProduction = process.env.NODE_ENV === "production";

  app.use(
    helmet({
      contentSecurityPolicy: isProduction
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
              styleSrc: ["'self'", "https://fonts.googleapis.com"],
              imgSrc: ["'self'", "data:"],
              reportTo: "default", // CSP violation reporting
            },
          }
        : false, // Disable CSP in dev
      frameguard: { action: "deny" },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      hsts: isProduction
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
      crossOriginOpenerPolicy: { policy: "same-origin" },
      crossOriginResourcePolicy: { policy: "same-origin" },
    })
  );

  if (isProduction) {
    // Reporting API header for CSP violations
    app.use((req, res, next) => {
      res.setHeader(
        "Report-To",
        JSON.stringify({
          group: "default",
          max_age: 10886400,
          endpoints: [{ url: "/csp-violation" }],
        })
      );
      next();
    });
  }
};