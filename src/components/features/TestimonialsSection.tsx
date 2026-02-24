import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      state: 'Rajasthan',
      position: 'District Project Manager',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      review: 'Great opportunity to work on a government project. The support from the team has been excellent.',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      state: 'Karnataka',
      position: 'Project Facilitator',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      review: 'Professional work environment and timely salary. Happy to be part of clean energy mission.',
      rating: 5,
    },
    {
      name: 'Amit Patel',
      state: 'Telangana',
      position: 'State Project Manager',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      review: 'Challenging and rewarding role. Making real impact on sustainable energy adoption in our state.',
      rating: 5,
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            What Our Team Says
          </h2>
          <div className="w-24 h-1 bg-saffron mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Hear from professionals already working with us
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-saffron"
                />
                <div>
                  <h3 className="font-bold text-navy">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.position}</p>
                  <p className="text-xs text-saffron">{testimonial.state}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 italic leading-relaxed">"{testimonial.review}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}