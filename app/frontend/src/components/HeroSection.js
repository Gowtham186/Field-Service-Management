import { FaTools, FaPaintRoller, FaWrench, FaPlug } from "react-icons/fa"; // Sample icons
import { useSelector } from "react-redux";

export default function HeroSection() {
  const services = [
    { name: "Plumbing", icon: <FaWrench />, bookings: 120, experts: 15 },
    { name: "Painting", icon: <FaPaintRoller />, bookings: 85, experts: 10 },
    { name: "Electrical", icon: <FaPlug />, bookings: 95, experts: 12 },
    { name: "General Repairs", icon: <FaTools />, bookings: 75, experts: 8 },
  ];

  return (
    <section className="w-full bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 px-6">
        {/* Left Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Services We Are Providing
          </h1>
          <p className="mt-4 text-gray-600">
            Find skilled professionals for all your home services.
          </p>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 grid grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-4 shadow-lg rounded-xl flex flex-col items-center text-center"
            >
              <div className="text-blue-500 text-4xl">{service.icon}</div>
              <h2 className="text-xl font-semibold mt-2">{service.name}</h2>
              <p className="text-gray-600 text-sm mt-1">
                {service.bookings} bookings
              </p>
              <p className="text-green-600 font-medium">{service.experts} experts</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
