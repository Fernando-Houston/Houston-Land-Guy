import Link from 'next/link'

const footerNavigation = {
  tools: [
    { name: 'ROI Calculator', href: '/roi-calculator' },
    { name: 'Cost Calculator', href: '/development-cost-calculator' },
    { name: 'Neighborhood Comparison', href: '/neighborhood-comparison' },
    { name: 'Opportunity Finder', href: '/opportunity-finder' },
    { name: 'Development Timeline', href: '/houston-development-timeline' },
  ],
  intelligence: [
    { name: 'Market Intelligence Hub', href: '/market-intelligence' },
    { name: 'Weekly Reports', href: '/market-intelligence/weekly-reports' },
    { name: 'Permit Tracker', href: '/market-intelligence/permit-tracker' },
    { name: 'Market Timing', href: '/market-intelligence/market-timing' },
    { name: 'Investment Opportunities', href: '/market-intelligence/investment-opportunities' },
    { name: 'All Neighborhoods', href: '/houston-neighborhoods' },
  ],
  neighborhoods: [
    { name: 'Cypress', href: '/houston-neighborhoods/cypress' },
    { name: 'Pearland', href: '/houston-neighborhoods/pearland' },
    { name: 'Memorial', href: '/houston-neighborhoods/memorial' },
    { name: 'Spring', href: '/houston-neighborhoods/spring' },
    { name: 'The Woodlands', href: '/woodlands-development-land' },
    { name: 'Katy', href: '/katy-development-opportunities' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Resources', href: '/resources' },
    { name: 'Local Citations', href: '/local-citations' },
    { name: 'Houston vs Texas', href: '/houston-vs-texas' },
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
        <div className="mt-8 border-t border-gray-800 pt-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Popular Neighborhoods
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {footerNavigation.neighborhoods.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} Houston Development Intelligence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}