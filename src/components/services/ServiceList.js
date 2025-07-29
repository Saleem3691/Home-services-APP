// components/ServiceList.jsx
"use client";
import { services } from "@/src/app/data/page"; // Correct import path
import ServiceCard from "./ServiceCard";

export default function ServiceList({ limit = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {services.slice(0, limit).map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}