"use client";

import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import {
  SparklesIcon,
  BookOpenIcon,
  FolderIcon,
  PhotoIcon,
  ArrowRightIcon,
  CodeBracketSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import AOS from "aos";
import "aos/dist/aos.css";

const sliderImages = [
  {
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=2070&q=80",
    title: "Developer Stories",
    subtitle:
      "Articles related to software development which deep dive into software architecture, front-end and backend engineering, and modern web development.",
  },
  {
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2075&q=80",
    title: "My Technical Projects",
    subtitle:
      "Explore full-stack applications, open-source tools, APIs, Desktop apps and UI applications.",
  },
  {
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2068&q=80",
    title: "Visual Travel Moments",
    subtitle:
      "A gallery of travel chronicles, photography, my hobbies and experiences.",
  },
];

export default function HomeClient() {
  const { user, isAuthenticated, initializeAuth } = useAuthStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-out-cubic",
    });
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length,
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col font-theme-body transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-main)",
      }}
    >
      <Header />

      <main className="flex-grow">
        {/* Hero Section with Background Slider */}
        <section className="relative overflow-hidden py-32 lg:py-44 px-6 flex items-center justify-center min-h-[720px]">
          <div className="absolute inset-0 z-0">
            {sliderImages.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src={slide.url}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center transform scale-105 filter brightness-75 dark:brightness-[0.4]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 backdrop-blur-[2px]" />
              </div>
            ))}
          </div>

          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] blur-[160px] rounded-full pointer-events-none opacity-30 z-20"
            style={{ backgroundColor: "var(--accent)" }}
          />

          <div className="max-w-5xl mx-auto text-center relative z-30 space-y-8">
            <div
              data-aos="fade-down"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-bold backdrop-blur-md shadow-xl uppercase tracking-wider"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.25)",
                color: "#ffffff",
              }}
            >
              <SparklesIcon
                className="h-4 w-4"
                style={{ color: "var(--accent)" }}
              />
              <span>
                {isAuthenticated && user
                  ? `Welcome back, ${user.username || user.email || "Author"}!`
                  : "Personal Digital Garden & Portfolio"}
              </span>
            </div>

            <div data-aos="fade-up" data-aos-delay="100" className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-theme-heading tracking-tight leading-tight text-white drop-shadow-lg">
                {sliderImages[currentSlide].title}
              </h1>
              <p className="text-base sm:text-xl max-w-2xl mx-auto leading-relaxed text-gray-200 drop-shadow font-theme-body opacity-90">
                {sliderImages[currentSlide].subtitle}
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                href="/blog"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold font-theme-heading transition-all shadow-xl flex items-center justify-center gap-2 group hover:scale-105"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--bg-primary)",
                }}
              >
                <BookOpenIcon className="h-5 w-5" />
                <span>Read Articles</span>
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/projects"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold font-theme-heading border transition-all flex items-center justify-center gap-2 backdrop-blur-md text-white hover:bg-white/10 shadow-lg"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  backgroundColor: "rgba(0, 0, 0, 0.35)",
                }}
              >
                <FolderIcon
                  className="h-5 w-5"
                  style={{ color: "var(--accent)" }}
                />
                <span>View Projects</span>
              </Link>

              <Link
                href="/gallery"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold font-theme-heading border transition-all flex items-center justify-center gap-2 backdrop-blur-md text-white hover:bg-white/10 shadow-lg"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  backgroundColor: "rgba(0, 0, 0, 0.35)",
                }}
              >
                <PhotoIcon
                  className="h-5 w-5"
                  style={{ color: "var(--accent)" }}
                />
                <span>Explore Gallery</span>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-6">
              <button
                onClick={prevSlide}
                className="p-2.5 rounded-full backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer shadow-md"
                aria-label="Previous slide"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                {sliderImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer shadow-sm ${
                      idx === currentSlide
                        ? "w-9 bg-[var(--accent)]"
                        : "w-2.5 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="p-2.5 rounded-full backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer shadow-md"
                aria-label="Next slide"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* 3 Core Platform Sections */}
        <section
          className="py-24 px-6 border-t transition-colors"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4" data-aos="fade-up">
              <span
                className="text-xs uppercase font-extrabold tracking-widest px-3.5 py-1 rounded-full border shadow-sm"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--accent)",
                }}
              >
                Platform Sections
              </span>
              <h2 className="text-3xl sm:text-4xl mt-2 font-extrabold font-theme-heading">
                Explore Gallery, Blog and Projects
              </h2>
              <p
                className="max-w-xl mx-auto opacity-80 text-sm sm:text-base font-theme-body"
                style={{ color: "var(--text-muted)" }}
              >
                Powered by a React and FastAPI stack for content management and
                delivery.
              </p>
            </div>

            <div className="space-y-16">
              {/* 1. Blog Articles Row (Text Left, Image Right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Blog Card */}
                <div
                  data-aos="fade-up"
                  data-aos-delay="100"
                  className="md:col-span-7 p-8 rounded-3xl border space-y-4 transition-all hover:-translate-y-1.5 shadow-md flex flex-col justify-between"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="space-y-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--accent)",
                      }}
                    >
                      <BookOpenIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold font-theme-heading">
                      Blog Articles
                    </h3>
                    <p
                      className="text-sm leading-relaxed opacity-80 font-theme-body"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Technical deep-dives, developer logs, and tutorials
                      written using block-content based editor.
                    </p>
                  </div>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 font-bold text-sm pt-2 group"
                    style={{ color: "var(--accent)" }}
                  >
                    <span>Browse Articles</span>
                    <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Blog Image */}
                <div
                  data-aos="fade-left"
                  className="md:col-span-5 h-[320px] lg:h-[380px] relative rounded-3xl overflow-hidden shadow-lg border"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000"
                    alt="Writing and Blogging"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* 2. Projects Showcase Row (Image Left, Text Right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Projects Image */}
                <div
                  data-aos="fade-right"
                  className="md:col-span-5 h-[320px] lg:h-[380px] relative rounded-3xl overflow-hidden shadow-lg border order-2 md:order-1"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"
                    alt="Software Development"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Projects Card */}
                <div
                  data-aos="fade-up"
                  data-aos-delay="200"
                  className="md:col-span-7 p-8 rounded-3xl border space-y-4 transition-all hover:-translate-y-1.5 shadow-md flex flex-col justify-between order-1 md:order-2"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="space-y-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--accent)",
                      }}
                    >
                      <FolderIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold font-theme-heading">
                      Projects Showcase
                    </h3>
                    <p
                      className="text-sm leading-relaxed opacity-80 font-theme-body"
                      style={{ color: "var(--text-muted)" }}
                    >
                      A portfolio of software applications complete with live
                      links, tech stacks, repository links, and architectural
                      walkthroughs.
                    </p>
                  </div>
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 font-bold text-sm pt-2 group"
                    style={{ color: "var(--accent)" }}
                  >
                    <span>View Projects</span>
                    <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* 3. Gallery Snapshots Row (Text Left, Image Right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Gallery Card */}
                <div
                  data-aos="fade-up"
                  data-aos-delay="300"
                  className="md:col-span-7 p-8 rounded-3xl border space-y-4 transition-all hover:-translate-y-1.5 shadow-md flex flex-col justify-between"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="space-y-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--accent)",
                      }}
                    >
                      <PhotoIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold font-theme-heading">
                      Gallery Snapshots
                    </h3>
                    <p
                      className="text-sm leading-relaxed opacity-80 font-theme-body"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Visual moments, travel photography, hobbies, and everyday life captured through the my camera.
                    </p>
                  </div>
                  <Link
                    href="/gallery"
                    className="inline-flex items-center gap-2 font-bold text-sm pt-2 group"
                    style={{ color: "var(--accent)" }}
                  >
                    <span>Explore Gallery</span>
                    <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Gallery Image */}
                <div
                  data-aos="fade-left"
                  className="md:col-span-5 h-[320px] lg:h-[380px] relative rounded-3xl overflow-hidden shadow-lg border"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000"
                    alt="Photography Gallery"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
