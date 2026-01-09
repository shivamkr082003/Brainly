import { NavLink } from "react-router";
import Navbar from "../components/ui/Navbar";
import Button from "../components/ui/Button";
import StorageIcon from "../components/icons/StorageIcon";
import CollabIcon from "../components/icons/CollabIcon";
import MultimediaIcon from '../components/icons/MultimediaIcon';

const Home = () => {
  const features = [
    {
      title: "Centralized Storage",
      description:
        "Save content from various sources like Twitter, YouTube, and Google Docs in one place.",
      icon: <StorageIcon extraClasses="w-12 h-12" />,
    },
    {
      title: "Seamless Collaboration",
      description: "Share and collaborate on content effortlessly with teammates or friends in real-time.",
      icon: <CollabIcon extraClasses="w-12 h-12" />,
    },
    {
      title: "Multi-Media Support",
      description: "Save, view, and interact with YouTube videos, tweets and more",
      icon: <MultimediaIcon extraClasses="w-12 h-12" />,
    },
  ];

  return (
    <div className="bg-secondary min-h-screen flex flex-col">
      <div className="py-5">
        <Navbar />
      </div>
      
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-12 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img
                className="w-full max-w-2xl mx-auto md:mx-0 rounded-lg  transform transition-transform duration-500 hover:scale-105"
                src="./images/HeroImage.png"
                alt="Hero Image"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h1 className="text-primary text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Your Second Brain, Simplified
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Effortlessly save and organize content from Twitter, YouTube, Google
                Docs, and more—all in one centralized place. Turn your information
                into actionable insights. Future-ready with powerful search and
                AI-driven embeddings to explore your knowledge like never before.
              </p>
              <div className="w-full flex justify-center md:justify-start">
              <NavLink to="/dashboard">
                <Button 
                  variant="primary" 
                  size="lg" 
                  text="Try Now" 
                  extraClasses="text-lg px-8 py-3 rounded-full transition-transform duration-300 transform hover:scale-105"
                />
              </NavLink>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
              Why Choose Second Brain?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="text-primary mb-6 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Brainly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

