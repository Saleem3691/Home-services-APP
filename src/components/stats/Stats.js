// components/stats/Stats.jsx
export default function Stats() {
    const stats = [
      { id: 1, name: 'Happy Customers', value: '10,000+' },
      { id: 2, name: 'Services Offered', value: '50+' },
      { id: 3, name: 'Professional Experts', value: '500+' },
      { id: 4, name: 'Cities Served', value: '25+' },
    ];
  
    return (
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <p className="text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-lg font-medium text-slate-300">{stat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }