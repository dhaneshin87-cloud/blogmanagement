// src/app/page.js
import HomePageClient from "./HomePageClient";

export const metadata = {
  title: "Blog Application",
  description: "A modern blog application with user authentication and blog management",
};

export default function Page() {
  return <HomePageClient />;
}

