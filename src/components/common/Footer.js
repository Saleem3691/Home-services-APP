import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-rich-slate border-t border-slate/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-lightest-slate mb-4">
              ServiceHub
            </h3>
            <p className="text-light-slate">
              Professional services at your doorstep. Quality guaranteed.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-lightest-slate mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-light-slate hover:text-lightest-slate"
                >
                  All Services
                </Link>
              </li>
              <li>
                <Link
                  href="/services/plumbing"
                  className="text-light-slate hover:text-lightest-slate"
                >
                  Plumbing
                </Link>
              </li>
              <li>
                <Link
                  href="/services/electrical"
                  className="text-light-slate hover:text-lightest-slate"
                >
                  Electrical
                </Link>
              </li>
              <li>
                <Link
                  href="/services/ac-repair"
                  className="text-light-slate hover:text-lightest-slate"
                >
                  Ac Repair
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-lightest-slate mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-light-slate hover:text-lightest-slate"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-light-slate hover:text-lightest-slate"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-light-slate hover:text-lightest-slate"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-light-slate hover:text-lightest-slate"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-lightest-slate mb-4">
              Contact
            </h4>
            <ul className="space-y-2">
              <li className="text-light-slate">support@servicehub.com</li>
              <li className="text-light-slate">+92 329 6804768</li>
              <li className="text-light-slate">
                specimen road basement&apos;s front door,
                <br />
                Suite 100
                <br />
                Unkonown, state is also unknown
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate/20">
          <p className="text-center text-light-slate">
            © {new Date().getFullYear()} ServiceHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
