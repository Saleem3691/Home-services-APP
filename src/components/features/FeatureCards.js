// components/features/FeatureCards.jsx
import { CheckCircleIcon, ClockIcon, ShieldCheckIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const features = [
  {
    name: 'Verified Professionals',
    description: 'All service providers are thoroughly vetted with background checks and verified credentials.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Quick Response',
    description: 'Get matched with available professionals in your area within minutes, not days.',
    icon: ClockIcon,
  },
  {
    name: 'Satisfaction Guaranteed',
    description: 'We stand behind our services with a 100% satisfaction guarantee policy.',
    icon: CheckCircleIcon,
  },
  {
    name: '24/7 Support',
    description: 'Our customer support team is available round the clock to assist you.',
    icon: UserGroupIcon,
  },
];

export default function FeatureCards() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => (
        <div key={feature.name} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rich-slate text-white">
              <feature.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="ml-4 text-lg font-medium text-slate-900">{feature.name}</h3>
          </div>
          <p className="mt-2 text-slate-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}