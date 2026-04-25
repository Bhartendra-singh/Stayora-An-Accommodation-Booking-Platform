import React, { useEffect, useState } from "react";
import Title from "./Title";
import StarRating from "./StarRating";
import AddReview from "./AddReview";
import { useAppContext } from "../context/AppContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const Testimonial = () => {

  const { axios } = useAppContext();

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get("/api/testimonials");

      if (res.data.success) {
        setTestimonials(res.data.testimonials);
      }

    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <div className="px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-30">

      <Title
        title="What Our Guests Say"
        subTitle="Real experiences shared by our happy customers"
      />

      {loading ? (
        <p className="text-center mt-10">Loading testimonials...</p>
      ) : testimonials.length === 0 ? (
        <p className="text-center mt-10">No testimonials yet</p>
      ) : (
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 2500 }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="mt-20"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item._id}>
              <div className="bg-white p-6 rounded-xl shadow">

                <div className="flex items-center gap-3">
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={item.image}
                    alt={item.name}
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-500 text-sm">{item.address}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <StarRating rating={item.rating} />
                </div>

                <p className="mt-4 text-gray-600">
                  "{item.review}"
                </p>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/*  FORM */}
      <AddReview refresh={fetchTestimonials} />

    </div>
  );
};

export default Testimonial;