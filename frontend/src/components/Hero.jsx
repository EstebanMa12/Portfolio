import React from 'react';

export default function Hero() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Esteban
          <span className="block text-4xl md:text-5xl mt-2">Ingeniero de Software</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Transformando ideas en soluciones digitales innovadoras
        </p>
        <div className="space-x-4">
          <a
            href="#proyectos"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Ver Proyectos
          </a>
          <a
            href="#contacto"
            className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Contactar
          </a>
        </div>
      </div>
    </section>
  );
} 