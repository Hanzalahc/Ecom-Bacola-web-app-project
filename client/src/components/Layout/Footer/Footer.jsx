import { memo } from "react";
import { CiChat1 } from "react-icons/ci";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <footer className="py-6 bg-white border-t border-[rgba(0,0,0,0.2)]">
        <div className="w-[95%] mx-auto">
          <div className="flex flex-col md:flex-row gap-6 py-8">
            {/* Contact Section */}
            <div className="w-full md:w-[25%] border-b md:border-b-0 md:border-r border-[rgba(0,0,0,0.2)] pb-6 md:pb-0 text-center md:text-left">
              <h3 className="mb-4">Contact Us</h3>
              <p className="pb-4">ClassyShop / Mega-Superstore</p>
              <Link className="text-sm" to="mailto:someone@example.com">
                sales@yourcompany.com
              </Link>
              <span className="text-sm font-semibold block mt-3 text-primary mb-5">
                +92 9876543010
              </span>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <CiChat1 className="text-4xl text-primary" />
                <span className="text-sm font-medium">
                  Online Chat <br /> Get Expert Help
                </span>
              </div>
            </div>

            {/* Products & Company Section */}
            <div className="w-full md:w-[40%] flex flex-col md:flex-row gap-6 md:pl-8 text-center md:text-left">
              <div className="w-full md:w-[50%]">
                <h3 className="mb-4">Products</h3>
                <ul>
                  {[
                    "All Products",
                    "New Arrivals",
                    "Best Sellers",
                    "Special Offers",
                    "Reviews",
                    "FAQ",
                  ].map((item) => (
                    <li key={item} className="mb-2">
                      <Link className="link" to="/products">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full md:w-[50%]">
                <h3 className="mb-4">Our Company</h3>
                <ul>
                  {[
                    "About Us",
                    "Careers",
                    "Blog",
                    "Terms & Conditions",
                    "Privacy Policy",
                    "Contact Us",
                  ].map((item) => (
                    <li key={item} className="mb-2">
                      <Link className="link" to="/products">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="w-full md:w-[35%] text-center md:text-left">
              <h3 className="mb-4">Newsletter</h3>
              <p className="mb-4">
                Subscribe to our newsletter and get the latest news and offers
              </p>
              <form className="flex flex-col md:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full md:w-auto border border-[#FF5252] p-2"
                />
                <button
                  type="submit"
                  className="btn btn-primary w-full md:w-auto"
                >
                  Subscribe
                </button>
              </form>

              {/* Social Media Icons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                {[
                  "facebook",
                  "twitter",
                  "instagram-new--v1",
                  "linkedin",
                  "youtube-play",
                  "pinterest",
                ].map((icon) => (
                  <Link key={icon} to={`/${icon}`}>
                    <img
                      src={`https://img.icons8.com/color/48/000000/${icon}.png`}
                      alt={icon}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Strip */}
      <div className="text-white text-center py-2 bg-gray-900">
        <p className="text-sm">
          © 2025 ClassyShop. All Rights Reserved. Designed by
          <Link to="/company" className="text-primary">
            {" "}
            Company
          </Link>
        </p>
      </div>

      {/* Scroll to Top Button */}
      {/* <button
        className="fixed bottom-5 right-5 bg-primary text-white p-2 rounded-full shadow-lg"
        onClick={() => window.scrollTo(0, 0)}
      >
        <span className="text-xl">^</span>
      </button> */}
    </>
  );
}

export default memo(Footer);
