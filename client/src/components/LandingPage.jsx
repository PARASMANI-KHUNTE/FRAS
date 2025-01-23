import { Link } from "react-router-dom";
import { useState } from "react";

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className="relative bg-gradient-to-b from-purple-100 to-blue-100">
        <header className="absolute inset-x-0 top-0 z-10 w-full">
          <div className="px-4 mx-auto sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <div className="flex-shrink-0">
                <a href="#" title="Attendance App" className="flex items-center gap-2">
                  <img className="w-auto h-8" src="logo.png" alt="Logo" />
                  <h1 className="font-semibold">FRAS</h1>
                </a>
              </div>

              <button
                type="button"
                className="inline-flex items-center p-2 text-sm text-white uppercase transition-all duration-200 bg-black lg:hidden focus:bg-gray-800 hover:bg-gray-800"
                onClick={toggleMenu}
              >
                {menuOpen ? (
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
                Menu
              </button>

              <div
                className={`absolute top-16 left-0 w-full bg-white shadow-lg lg:hidden transition-all duration-300 ${
                  menuOpen ? "block" : "hidden"
                }`}
              >
                <nav className="px-4 py-2">
                  <a href="#features" className="block py-2 text-black hover:text-opacity-80">
                    Features
                  </a>
                  <a href="#pricing" className="block py-2 text-black hover:text-opacity-80">
                    Pricing
                  </a>
                  <a href="#contact" className="block py-2 text-black hover:text-opacity-80">
                    Contact
                  </a>
                  <Link to={'/adminDashboard'} className="block py-2 text-black hover:text-opacity-80">
                    Admin
                  </Link>
                  <Link
                    to="/signup"
                    className="block py-2 text-black font-semibold border-t mt-2 pt-2 hover:bg-gray-200"
                  >
                    Get Started
                  </Link>
                </nav>
              </div>

              <div className="hidden lg:flex lg:items-center lg:justify-center lg:ml-10 lg:mr-auto lg:space-x-10">
                <a href="#features" title="Features" className="text-base text-black transition-all duration-200 hover:text-opacity-80">
                  Features
                </a>
                <a href="#pricing" title="Pricing" className="text-base text-black transition-all duration-200 hover:text-opacity-80">
                  Pricing
                </a>
                <a href="#contact" title="Contact Us" className="text-base text-black transition-all duration-200 hover:text-opacity-80">
                  Contact
                </a>
                <Link to={'/adminDashboard'} className="block py-2 text-black hover:text-opacity-80">
                    Admin
                  </Link>
              </div>

              <Link
                to="/signup"
                title="Get Started"
                className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold text-black border-2 border-black hover:bg-black hover:text-white transition-all duration-200 focus:bg-black focus:text-white"
                role="button"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        <section className="overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:max-h-[900px] lg:min-h-[900px]">
            <div className="flex items-center justify-center w-full lg:order-2 lg:w-7/12">
              <div className="h-full px-4 pt-24 pb-16 sm:px-6 lg:px-24 2xl:px-32 lg:pt-40 lg:pb-14">
                <div className="flex flex-col justify-between flex-1 h-full">
                  <div>
                    <h1 className="text-4xl font-bold text-black sm:text-6xl xl:text-7xl">
                      Track Attendance <br />
                      with Ease
                    </h1>
                    <p className="mt-6 text-base text-black sm:text-xl">
                      Our app leverages facial recognition to simplify attendance tracking, manage schedules, and generate detailed reports in real time.
                    </p>
                    <Link
                      to="/signup"
                      title="Get Started"
                      className="inline-flex items-center px-6 py-5 text-base font-semibold text-black transition-all duration-200 bg-blue-300 mt-9 hover:bg-blue-400 focus:bg-blue-400"
                      role="button"
                    >
                      Start Free Trial
                    </Link>
                  </div>

                  <div className="mt-8 border-t-2 border-black lg:mt-auto sm:mt-14">
                    <div className="pt-8 sm:flex sm:items-center sm:justify-between sm:pt-14">
                      <p className="text-base font-semibold text-black">App available on</p>
                      <div className="flex items-center mt-5 space-x-5 sm:mt-0">
                        <a
                          href="#"
                          title="App Store"
                          className="block transition-all duration-200 hover:opacity-80 focus:opacity-80"
                          role="button"
                        >
                          <img
                            className="w-auto rounded h-14 sm:h-16"
                            src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/4/app-store-button.png"
                            alt="App Store"
                          />
                        </a>
                        <a
                          href="#"
                          title="Play Store"
                          className="block transition-all duration-200 hover:opacity-80 focus:opacity-80"
                          role="button"
                        >
                          <img
                            className="w-auto rounded h-14 sm:h-16"
                            src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/4/play-store-button.png"
                            alt="Play Store"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative w-full overflow-hidden lg:w-5/12 lg:order-1">
              <div className=" lg:absolute lg:bottom-60 lg:left-0">
                <img className="max-w-full" src="prevApp.png" alt="App Preview" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;
