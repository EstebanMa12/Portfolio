import React from 'react';
import { motion } from 'framer-motion';

export default function About({ aboutData }) {
  return (
    <section id="sobre-mi" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-12"
        >
          {aboutData.title}
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Columna de texto */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              {aboutData.description}
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              {aboutData.secondaryDescription}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-2"
              >
                <h3 className="font-semibold text-gray-900">{aboutData.education.title}</h3>
                <p className="text-gray-600">{aboutData.education.degree}</p>
                <p className="text-gray-600">{aboutData.education.institution}</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="space-y-2"
              >
                <h3 className="font-semibold text-gray-900">{aboutData.location.title}</h3>
                <p className="text-gray-600">{aboutData.location.city}</p>
                <p className="text-gray-600">{aboutData.location.availability}</p>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8"
            >
              <a
                href={aboutData.cvUrl}
                download
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {aboutData.cvButtonText}
              </a>

              <div className="flex space-x-4">
                {aboutData.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {link.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Columna de imagen */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img 
                src={aboutData.image.url} 
                alt={aboutData.image.alternativeText} 
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500 rounded-full opacity-20"
            ></motion.div>
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500 rounded-full opacity-20"
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 