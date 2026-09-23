import React from "react";
import Title from "../components/Title";

const SearchIcon = () => (
  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const CardIcon = () => (
  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-9-9.75h19.5A2.25 2.25 0 0 1 21.75 9v6.75A2.25 2.25 0 0 1 19.5 18H4.5a2.25 2.25 0 0 1-2.25-2.25V9A2.25 2.25 0 0 1 4.5 6.75Z" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5 9 7.5l3.75 3.75L21 3M21 3h-5.25M21 3v5.25M3 19.5h18" />
  </svg>
);

const guestPoints = [
  { icon: SearchIcon, text: "Search by destination and compare rooms and amenities" },
  { icon: CardIcon, text: "Book and pay directly — no middleman, no hidden fees" },
];

const ownerPoints = [
  { icon: DashboardIcon, text: "One dashboard to list rooms, manage availability and offers" },
  { icon: ChartIcon, text: "Track bookings and revenue in real time" },
];

const About = () => {
  return (
    <div className="pt-32 pb-20 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        align="left"
        font="playfair"
        title="About WanderLust"
        subTitle="A simple idea: make finding and booking the right room easier for guests, and easier to manage for hotel owners."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14 max-w-4xl">
        <div
          className="animate-fade-in-up border border-gray-200 rounded-xl p-6 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
          style={{ animationDelay: "0s" }}
        >
          <p className="text-lg font-playfair text-gray-800 mb-4">For Guests</p>
          <div className="space-y-4">
            {guestPoints.map((point, i) => {
              const Icon = point.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon />
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed pt-1.5">{point.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="animate-fade-in-up border border-gray-200 rounded-xl p-6 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
          style={{ animationDelay: "0.12s" }}
        >
          <p className="text-lg font-playfair text-gray-800 mb-4">For Hotel Owners</p>
          <div className="space-y-4">
            {ownerPoints.map((point, i) => {
              const Icon = point.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon />
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed pt-1.5">{point.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;