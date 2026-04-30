import { Star } from "lucide-react";

const reviews = [
  { name: "Anil Kumar", initials: "AN", tag: "Regular Customer • Monthly Rentals", text: "Aim Car Travels has been my go-to for years. Cars are always spotless and pricing is honest. Booking is just a WhatsApp message away." },
  { name: "Sai Priya", initials: "SP", tag: "Rented Mahindra Thar • Wedding", text: "Booked the Thar for our wedding shoot — the car looked stunning and the whole process was smooth. Highly recommend!" },
  { name: "Rajesh K.", initials: "RK", tag: "Rented Innova Crysta • Family Trip", text: "Perfect for our family trip to Vizag. The Innova was clean, fuelled, and ready right on time. Will rent again." },
  { name: "Meena Reddy", initials: "MR", tag: "Self-Drive • Weekend Getaway", text: "First time renting self-drive and they made it super easy. No hidden charges, and the team explained everything clearly." },
  { name: "Vikram S.", initials: "VS", tag: "Outstation • Hyderabad Trip", text: "Drove to Hyderabad and back — the Creta performed beautifully. Loved the transparent kilometre policy." },
  { name: "Divya N.", initials: "DN", tag: "Corporate Monthly Rental", text: "Booked a sedan for a month for office commute. Best rates in Vijayawada and zero hassle." },
];

const Reviews = () => {
  return (
    <section id="reviews" className="py-24 sm:py-32 overflow-hidden">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="accent-rule">Customer Stories</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mt-4 mb-4">
            Loved by <span className="text-gradient">240+ Drivers</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-lg">
            <div className="flex">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-primary text-primary" />)}
            </div>
            <span className="font-semibold">4.9</span>
            <span className="text-muted-foreground">on Google Reviews</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <div
              key={r.name}
              className="card-elevated rounded-3xl p-6 border border-border/60 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-display font-bold">
                  {r.initials}
                </div>
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.tag}</div>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
