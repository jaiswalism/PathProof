import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Shield, History, BarChart3 } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="fade-in">
              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
                Supply Chain <span className="text-teal-400">Traceability</span> with Blockchain Verification
              </h1>
              <p className="mb-8 text-lg text-slate-300">
                Secure your products with zero-knowledge proofs and blockchain technology.
                Ensure authenticity and transparency across your entire supply chain.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/create" 
                  className="btn btn-primary px-6 py-3 text-base"
                >
                  Create Product
                </Link>
                <Link 
                  to="/verify" 
                  className="btn bg-slate-700 text-white hover:bg-slate-600 px-6 py-3 text-base"
                >
                  Verify Product
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="slide-up relative h-96 w-full max-w-md overflow-hidden rounded-2xl bg-white/5 p-8 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-500/20"></div>
                <div className="relative z-10 flex h-full flex-col items-center justify-center">
                  <QrCode size={180} className="mb-6 text-teal-300" />
                  <div className="mt-4 text-center">
                    <h3 className="mb-2 text-xl font-semibold">Scan to Verify</h3>
                    <p className="text-slate-300">
                      Instantly verify product authenticity and track its journey
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4">How It Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Our platform provides end-to-end traceability with cryptographic proofs
              at every step of the supply chain
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card flex flex-col items-center text-center"
              >
                <div className="mb-5 rounded-full bg-teal-100 p-4 text-teal-600">
                  <feature.icon size={32} />
                </div>
                <h3 className="mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="section bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6">Trusted by Industry Leaders</h2>
              <p className="mb-8 text-lg text-slate-600">
                From pharmaceuticals to luxury goods, our solution helps companies
                ensure product authenticity and build consumer trust.
              </p>
              <ul className="space-y-4 text-slate-600">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-4 mt-1 text-teal-600">
                      <Shield size={20} />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <div className="space-y-4">
                <div className="rounded-lg bg-slate-100 p-4">
                  <div className="mb-2 text-sm font-medium text-slate-500">Pharmaceutical</div>
                  <div className="text-lg font-semibold">97% reduction in counterfeit incidents</div>
                </div>
                <div className="rounded-lg bg-slate-100 p-4">
                  <div className="mb-2 text-sm font-medium text-slate-500">Food Industry</div>
                  <div className="text-lg font-semibold">85% faster product recalls</div>
                </div>
                <div className="rounded-lg bg-slate-100 p-4">
                  <div className="mb-2 text-sm font-medium text-slate-500">Luxury Goods</div>
                  <div className="text-lg font-semibold">42% increase in consumer trust</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section bg-gradient-to-br from-teal-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-8">Ready to Secure Your Supply Chain?</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-teal-100">
            Start creating verifiable product records with blockchain technology and
            zero-knowledge proofs today.
          </p>
          <Link 
            to="/create" 
            className="btn bg-white px-8 py-3 text-base font-medium text-teal-700 hover:bg-teal-50"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </>
  );
};

const features = [
  {
    icon: QrCode,
    title: "Create & Generate",
    description: "Easily create products and generate secure QR codes that link to your blockchain-verified data.",
  },
  {
    icon: History,
    title: "Scan & Update",
    description: "At each checkpoint, scan and update the product journey with cryptographic proofs that can't be tampered with.",
  },
  {
    icon: BarChart3,
    title: "Verify & Visualize",
    description: "Customers can verify authenticity and visualize the complete journey of products from origin to delivery.",
  },
];

const benefits = [
  "Prevent counterfeiting with cryptographic proof of authenticity",
  "Improve recall efficiency with precise tracking",
  "Build consumer trust with transparent supply chains",
  "Comply with regulatory requirements for traceability",
  "Protect your brand reputation with verifiable authenticity",
];

export default HomePage;