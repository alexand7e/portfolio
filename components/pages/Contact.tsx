import SectionBody from "@/components/ui/SectionBody";
import DefaultSection from "@/components/ui/Section";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiMail, FiGithub, FiLinkedin, FiPhone } from "react-icons/fi";
import SectionTitle from "@/components/ui/SectionTitle";
import emailjs from '@emailjs/browser';

const socialLinks = [
  {
    name: "Email",
    icon: <FiMail size={24} />,
    link: "mailto:alexand7e@gmail.com"
  },
  {
    name: "GitHub",
    icon: <FiGithub size={24} />,
    link: "https://github.com/alexand7e"
  },
  {
    name: "LinkedIn",
    icon: <FiLinkedin size={24} />,
    link: "https://www.linkedin.com/in/alexandre-barros-dos-santos-4b67a9233/"
  },
  {
    name: "Telefone",
    icon: <FiPhone size={24} />,
    link: "tel:+5586981813317"
  }
];

export default function Contact({
  ref,
  id
}: {
  ref?: React.Ref<any>
  id?: string
}) {
  const form = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    if (!form.current) {
      setSubmitError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
      return;
    }

    // Adicionar data automaticamente
    const formData = new FormData(form.current);
    formData.append('date', new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
        setSubmitError("Email configuration is missing. Please contact the administrator.");
        setIsSubmitting(false);
        return;
    }

    // Usar EmailJS com os dados atualizados
    emailjs.send(serviceId, templateId, {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      date: formData.get('date')
    }, publicKey)
      .then(() => {
        setSubmitSuccess(true);
        form.current?.reset();
        setTimeout(() => setSubmitSuccess(false), 5000);
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        setSubmitError("Something went wrong. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  return (
    <DefaultSection
      ref={ref}
      id={`${id}`}
      className={"!bg-primary"}
    >
      <SectionBody>
        <SectionTitle 
          title="Contact"
          subtitle="Have a project in mind or want to chat? Feel free to reach out!"
        />
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-tertiary mb-6">Get in touch</h3>
            <p className="text-tertiary mb-8">
              I&apos;m currently working as AI Programs Manager at the Piauí State Secretariat of Artificial Intelligence. 
              I&apos;m open to collaborations in data science, AI projects, and digital transformation initiatives. 
              Whether you have a question or want to discuss potential partnerships, I&apos;ll be happy to connect!
            </p>
            
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-secondary border border-accent rounded-lg px-4 py-2 text-tertiary hover:text-accent hover:border-accent transition-colors"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                  <span>{social.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form ref={form} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-tertiary mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full bg-secondary border border-accent rounded-lg px-4 py-2 text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-tertiary mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full bg-secondary border border-accent rounded-lg px-4 py-2 text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-tertiary mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full bg-secondary border border-accent rounded-lg px-4 py-2 text-tertiary focus:outline-none focus:ring-accent"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-accent text-primary font-bold py-3 rounded-lg transition-all ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-[#00e187]"
                }`}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
              
              {submitSuccess && (
                <div className="p-3 bg-green-900 text-green-200 rounded-lg">
                  Message sent successfully! I&apos;ll get back to you soon.
                </div>
              )}
              
              {submitError && (
                <div className="p-3 bg-red-900 text-red-200 rounded-lg">
                  {submitError}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </SectionBody>
    </DefaultSection>
  )
}