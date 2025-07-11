export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-500 via-emerald-600 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl">Last updated: January 2025</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 mb-6">
              Houston Development Intelligence ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you use our website and services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Name and contact information (email, phone number)</li>
              <li>Company name and professional details</li>
              <li>Project information you provide for analysis</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Usage Information</h3>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Pages visited and features used</li>
              <li>Time spent on our platform</li>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Provide and improve our real estate development tools and services</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send relevant market updates and insights (with your consent)</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Data Protection</h2>
            <p className="text-gray-600 mb-6">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, 
              alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Third-Party Services</h2>
            <p className="text-gray-600 mb-6">
              We may share your information with trusted third-party service providers who assist us in operating our website and 
              delivering our services. These providers are contractually obligated to protect your information and use it only 
              for the purposes we specify.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Cookies</h2>
            <p className="text-gray-600 mb-6">
              We use cookies and similar technologies to enhance your experience on our website. You can control cookie settings 
              through your browser preferences.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Contact Us</h2>
            <p className="text-gray-600 mb-6">
              If you have questions about this privacy policy or how we handle your data, please contact us at:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 font-semibold">Houston Development Intelligence</p>
              <p className="text-gray-600">Email: privacy@houstonlandguy.com</p>
              <p className="text-gray-600">Phone: (123) 456-7890</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Updates to This Policy</h2>
            <p className="text-gray-600">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy 
              on this page and updating the "Last updated" date.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}