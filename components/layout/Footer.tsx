import Link from 'next/link'

const footerNavigation = {
  tools: [
    { name: 'ROI Calculator', href: '/roi-calculator' },
    { name: 'Market Dashboard', href: '/tools#market-dashboard' },
    { name: 'Zoning Explorer', href: '/tools#zoning-explorer' },
    { name: 'Financing Calculator', href: '/tools#financing-calculator' },
  ],
  intelligence: [
    { name: 'Market Reports', href: '/intelligence#reports' },
    { name: 'Permit Trends', href: '/intelligence#permits' },
    { name: 'Neighborhood Analysis', href: '/intelligence#neighborhoods' },
    { name: 'Development Opportunities', href: '/intelligence#opportunities' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
  social: [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/houston-land-guy' },
    { name: 'Twitter', href: 'https://twitter.com/houstonlandguy' },
    { name: 'Facebook', href: 'https://www.facebook.com/houstonlandguy' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div>
              <span className="text-2xl font-bold text-white">
                Houston Development Intelligence
              </span>
              <p className="mt-2 text-sm text-gray-400">
                by Houston Land Guy
              </p>
            </div>
            <p className="text-sm text-gray-400">
              Empowering small-to-medium builders with data-driven insights and market intelligence
              for Houston&apos;s real estate development opportunities.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Tools
                </h3>
                <ul className="mt-4 space-y-4">
                  {footerNavigation.tools.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm text-gray-400 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Intelligence
                </h3>
                <ul className="mt-4 space-y-4">
                  {footerNavigation.intelligence.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm text-gray-400 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm text-gray-400 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Connect
                </h3>
                <ul className="mt-4 space-y-4">
                  {footerNavigation.social.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm text-gray-400 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} Houston Development Intelligence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}