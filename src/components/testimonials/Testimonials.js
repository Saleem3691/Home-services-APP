// components/testimonials/Testimonials.jsx
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    content: "The plumbing service was exceptional! The technician arrived on time, fixed our issue quickly, and cleaned up afterward. Will definitely use again.",
    rating: 5,
    avatar: "/avatars/sarah_john.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Car Owner",
    content: "Best auto service I've experienced. They diagnosed my car's problem accurately and saved me hundreds compared to the dealership.",
    rating: 5,
    avatar: "/avatars/micahel_chen.jpg"
  },
  {
    id: 3,
    name: "David Rodriguez",
    role: "Business Owner",
    content: "We use their cleaning services for our office regularly. Consistent quality, professional staff, and flexible scheduling.",
    rating: 4,
    avatar: "/avatars/david.jpg"
  }
];

export default function Testimonials() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md border border-slate-100">
          <div className="flex items-center mb-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
              <Image 
                src={testimonial.avatar} 
                alt={testimonial.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
              <p className="text-slate-500 text-sm">{testimonial.role}</p>
            </div>
          </div>
          <p className="text-slate-700 mb-4">{testimonial.content}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-slate-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}