import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink, Calendar, MapPin } from "lucide-react";

type Announcement = {
  id: number;
  type: "sponsor" | "event";
  title: string;
  description: string;
  imageUrl?: string;
  sponsor?: string;
  location?: string;
  date?: string;
  link?: string;
};

const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    type: "sponsor",
    title: "Eco Produtos Sustentáveis",
    description: "Use o cupom ECOHUB10 e ganhe 10% de desconto em produtos ecológicos!",
    sponsor: "Loja Verde",
    link: "https://example.com",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop"
  },
  {
    id: 2,
    type: "event",
    title: "Feira de Reciclagem 2025",
    description: "Grande evento de conscientização ambiental com oficinas e palestras",
    location: "Praça Central, Tibau do Sul",
    date: "15 de Novembro, 2025",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop"
  },
  {
    id: 3,
    type: "sponsor",
    title: "Recicla Mais - Coleta Especializada",
    description: "Parceiro oficial EcoHub. Coleta de eletrônicos e materiais especiais.",
    sponsor: "Recicla Mais",
    link: "https://example.com",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop"
  },
  {
    id: 4,
    type: "event",
    title: "Oficina de Artesanato Sustentável",
    description: "Aprenda a criar objetos incríveis com materiais reciclados",
    location: "Centro Comunitário",
    date: "20 de Novembro, 2025",
    imageUrl: "https://images.unsplash.com/photo-1611432579699-484f7990b127?w=800&h=400&fit=crop"
  }
];

export default function AnnouncementsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockAnnouncements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      prev === 0 ? mockAnnouncements.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % mockAnnouncements.length);
  };

  const currentAnnouncement = mockAnnouncements[currentIndex];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {/* Image Section */}
          <div className="relative h-64 md:h-80 bg-gradient-to-r from-green-500 to-emerald-500 overflow-hidden">
            {currentAnnouncement.imageUrl ? (
              <img
                src={currentAnnouncement.imageUrl}
                alt={currentAnnouncement.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-6xl">🌱</div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Type Badge */}
            <div className="absolute top-4 left-4">
              <Badge 
                className={
                  currentAnnouncement.type === "sponsor" 
                    ? "bg-blue-500 hover:bg-blue-600" 
                    : "bg-purple-500 hover:bg-purple-600"
                }
              >
                {currentAnnouncement.type === "sponsor" ? "Patrocinador" : "Evento"}
              </Badge>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {currentAnnouncement.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {currentAnnouncement.description}
            </p>

            {/* Event Details */}
            {currentAnnouncement.type === "event" && (
              <div className="space-y-2 mb-4">
                {currentAnnouncement.date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{currentAnnouncement.date}</span>
                  </div>
                )}
                {currentAnnouncement.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{currentAnnouncement.location}</span>
                  </div>
                )}
              </div>
            )}

            {/* Sponsor Info */}
            {currentAnnouncement.type === "sponsor" && currentAnnouncement.sponsor && (
              <p className="text-sm text-gray-500 mb-4">
                Patrocinado por <span className="font-semibold">{currentAnnouncement.sponsor}</span>
              </p>
            )}

            {/* Action Button */}
            {currentAnnouncement.link && (
              <Button className="bg-green-600 hover:bg-green-700">
                Saiba Mais
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            )}

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {mockAnnouncements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? "w-8 bg-green-600" 
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
