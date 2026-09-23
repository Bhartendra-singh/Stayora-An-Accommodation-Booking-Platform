import React from "react";
import Title from "../components/Title";

const ShieldIcon = () => (
  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M12 3l7.5 3v5.25c0 4.556-3.093 8.658-7.5 9.75-4.407-1.092-7.5-5.194-7.5-9.75V6l7.5-3Z" />
  </svg>
);

const BoltIcon = () => (
  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5 9 3.75l1.5 6.75h9L13.5 20.25 12 13.5h-8.25Z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 10.5h7.5m-7.5 3h4.5m4.5-9H4.5A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5h3.243l3.257 3 3.257-3H19.5a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5Z" />
  </svg>
);

const experiencePoints = [
  {
    icon: ShieldIcon,
    title: "Handpicked Rooms",
    text: "Every listing on WanderLust is added by a verified hotel owner — real photos, real amenities, real pricing. No surprises at check-in.",
  },
  {
    icon: BoltIcon,
    title: "Simple Booking",
    text: "Check availability, book, and pay securely through Razorpay — all in a few clicks, with instant confirmation.",
  },
  {
    icon: ChatIcon,
    title: "Direct Support",
    text: "Every booking connects you to the room's hotel directly, so any questions before your stay get a real answer, fast.",
  },
];

const Experience = () => {
  return (
    <div className="pt-32 pb-20 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        align="left"
        font="playfair"
        title="The WanderLust Experience"
        subTitle="What makes staying with us different — handpicked rooms, real amenities, and a booking flow that gets out of your way."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
        {experiencePoints.map((point, i) => {
          const Icon = point.icon;
          return (
            <div
              key={i}
              className="animate-fade-in-up border border-gray-200 rounded-xl p-6 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Icon />
              </div>
              <p className="text-lg font-playfair text-gray-800 mb-2">{point.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{point.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Experience;