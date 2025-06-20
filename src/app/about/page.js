import Image from "next/image";
import ourteam from '../../images/ourteam.jpg';
import {
  FaTools,
  FaHandsHelping,
  FaShieldAlt,
  FaStar,
  FaHome,
} from "react-icons/fa";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-rich-slate text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            About HomePro Services
          </h1>
          <p className="text-xl text-light-slate max-w-3xl mx-auto">
            Trusted professionals delivering quality home services since 2015
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 relative pb-2">
                <span className="absolute bottom-0 left-0 w-16 h-1 bg-accent"></span>
                Our Story
              </h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Founded in 2015, HomePro Services began with a simple mission:
                to make home maintenance hassle-free for busy homeowners. What
                started as a small team of skilled technicians has grown into
                the most trusted home services platform in the region.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Today, we connect thousands of homeowners with vetted
                professionals for all their maintenance and repair needs,
                ensuring quality service with every booking.
              </p>
            </div>
            <div className="lg:w-1/2 order-1 lg:order-2">
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <Image
                  src={ourteam} 
                  alt="Our professional team at work"
                  width={800}
                  height={600}
                  className="object-cover w-full h-auto"
                  priority
                />
                <div className="absolute inset-0 bg-rich-slate opacity-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <div className="w-20 h-1 bg-accent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="text-accent text-4xl mb-6">
                <FaTools />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Expert Craftsmanship
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our professionals are highly skilled and continuously trained to
                deliver exceptional workmanship on every job.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="text-accent text-4xl mb-6">
                <FaHandsHelping />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Customer First</h3>
              <p className="text-gray-600 leading-relaxed">
                Your satisfaction is our priority. We listen carefully and
                tailor our services to your specific needs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="text-accent text-4xl mb-6">
                <FaShieldAlt />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Reliability</h3>
              <p className="text-gray-600 leading-relaxed">
                We show up on time, communicate clearly, and stand behind our
                work with solid guarantees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-rich-slate text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl font-bold mb-3">8+</div>
              <div className="text-light-slate uppercase tracking-wider text-sm font-medium">Years in Business</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold mb-3">5K+</div>
              <div className="text-light-slate uppercase tracking-wider text-sm font-medium">Happy Customers</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold mb-3">200+</div>
              <div className="text-light-slate uppercase tracking-wider text-sm font-medium">Skilled Professionals</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold mb-3">98%</div>
              <div className="text-light-slate uppercase tracking-wider text-sm font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="bg-accent-light text-accent text-4xl mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full">
              <FaHome />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Join Our Team of Professionals
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              We're always looking for skilled technicians who share our
              commitment to quality service. Become part of the HomePro family
              today.
            </p>
            <button className="bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg">
              Apply Now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}