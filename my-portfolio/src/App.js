import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Menu, X, Linkedin, Mail, FileText, Award, Code, Database, Cloud, Server, Users, MessageSquare, Send, Bot } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@5.1.91/build/pdf.worker.min.mjs`



// Test Gemini API key - replace with your actual key
// In production, use environment variables or a secure backend
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY; 

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! I\'m Varun\'s AI assistant. Ask me anything about his skills, experience, or background.' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [resumeContext, setResumeContext] = useState('');
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [formStatus, setFormStatus] = useState('idle'); 
 
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setFormStatus('submitting');
      const form = e.target;
      const formData = new FormData(form);
      
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setFormStatus('success');
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form error:', error);
      setFormStatus('error');
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to bottom of messages when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load and process PDF when app initializes
  useEffect(() => {
    const loadResumePDF = async () => {
      try {
        // Note: In actual deployment, this would be the path to your PDF in the public folder
        // For testing, you might need to adjust this path
        const pdfPath = `${process.env.PUBLIC_URL}/assets/varun-resume.pdf`;
        
        console.log('Attempting to load PDF from:', pdfPath);
        
        // Fetch the PDF file from the public directory
        const response = await fetch(pdfPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Load the PDF
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        console.log(`PDF loaded successfully with ${pdf.numPages} pages`);
        
        let fullText = '';
        
        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }
        
        console.log('PDF text extracted successfully');
        
        // Process the extracted text - in a real implementation, 
        // you would parse this more intelligently
        const context = processResumeText(fullText);
        setResumeContext(context);
        setPdfLoaded(true);
      } catch (error) {
        console.error('Error loading or processing PDF:', error);
        // Fall back to hardcoded context if PDF processing fails
        setResumeContext(`
          Information about Varun Mehra:
          - Currently Staff Software Engineer at Guidewire Software (Nov 2021-Present)
          - Previously App Engineering Lead at Guidewire/Cyence (2017-2021)
          - Led team of 8 engineers at Guidewire
          - Specializes in AWS cloud technologies and cyber insurance industry
          - Achieved 70% reduction in EC2 costs (~$200k saved annually) in Project Sandman
          - Skills: Python, JavaScript, Angular, AWS, PostgreSQL, Kubernetes, Docker, FastAPI
          - AWS Certified Solutions Architect (2023), Certified Scrum Product Owner (2023)
          - Bachelor's in Computer Science and Engineering from Medi-Caps (2010)
          - Contact: varunmehra003@gmail.com, +91-9677135061, linkedin.com/in/varunmehra003
        `);
        setPdfLoaded(true);
      }
    };
    
    loadResumePDF();
  });
  
  // Process the extracted text from PDF
  const processResumeText = (text) => {
    // This is a simplified version - you would want to enhance this
    // with better text extraction logic based on your PDF structure
    
    // Basic extraction of key information
    const positions = extractPositions(text);
    const skills = extractSkills(text);
    const certifications = extractCertifications(text);
    const education = extractEducation(text);
    const contact = extractContact(text);
    
    return `
Information about Varun Mehra:
${positions}
- Specializes in AWS cloud technologies and cyber insurance industry
- Achieved 70% reduction in EC2 costs (~$200k saved annually) in Project Sandman
${skills}
${certifications}
${education}
${contact}
    `.trim();
  };
  
  // Basic extraction helpers - these would be more sophisticated in production
  const extractPositions = (text) => {
    return `
- Currently Staff Software Engineer at Guidewire Software (Nov 2021-Present)
- Previously App Engineering Lead at Guidewire/Cyence (2017-2021) and Senior Programmer Analyst at Cyence (2015-2017)
- Led team of 8 engineers at Guidewire`;
  };
  
  const extractSkills = (text) => {
    return `- Skills: Python, JavaScript, Angular, AWS, PostgreSQL, Kubernetes, Docker, FastAPI`;
  };
  
  const extractCertifications = (text) => {
    return `- AWS Certified Solutions Architect (2023), Certified Scrum Product Owner (2023)`;
  };
  
  const extractEducation = (text) => {
    return `- Bachelor's in Computer Science and Engineering from Medi-Caps (2010)`;
  };
  
  const extractContact = (text) => {
    return `- Contact: varunmehra003@gmail.com, +91-9677135061, linkedin.com/in/varunmehra003`;
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Function to handle AI response using Gemini API
  const getAIResponse = async (question) => {
    // Set loading state to true
    setLoading(true);
    
    try {
      console.log('Calling Gemini API with context:', resumeContext);
      
      // Call Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an AI assistant for a software professional. ${resumeContext}. The following is a question from someone viewing the portfolio: "${question}". 
                  Please provide a concise, professional response based on the information above. If you don't know the answer, suggest the visitor contact Varun directly.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 800,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new Error(`Failed to get response from Gemini API: ${response.status}`);
      }

      const data = await response.json();
      console.log('Gemini API response:', data);
      
      // Extract the text from the Gemini response
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Add the response to messages
      setMessages(prev => [...prev, { sender: 'bot', text: aiResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Fallback response if API call fails
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "I'm sorry, I'm having trouble connecting to my knowledge base. Please try asking about Varun's experience, skills, or background directly, or contact him at varunmehra003@gmail.com." 
      }]);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: newMessage }]);
    
    // Get AI response
    getAIResponse(newMessage);
    
    // Clear input
    setNewMessage('');
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'contact', label: 'Contact' }
  ];

  const experience = [
    {
      title: 'Staff Software Engineer',
      company: 'Guidewire Software',
      period: 'November 2021 - January 2025',
      description: 'Led and managed a team of 8 engineers, driving architectural decisions for new product initiatives in the cyber insurance domain. Enhanced system reliability and security by identifying and resolving codebase vulnerabilities.',
      technologies: 'Python, Nodejs, Angular, AWS Services, PostgreSQL, Kubernetes, FastAPI, Docker'
    },
    {
      title: 'App Engineering Lead',
      company: 'Guidewire Software (formerly Cyence)',
      period: 'November 2017 - November 2021',
      description: 'Re-architected the Cyence Risk Analytics application using AWS Well-Architected Framework best practices. Collaborated with the OPS team to identify infrastructure cost-saving measures, achieving a 70% reduction in EC2 costs.',
      technologies: 'Python, Nodejs, Angular, R, AWS Services, PostgreSQL, Puppet'
    },
    {
      title: 'Senior Programmer Analyst',
      company: 'Cyence',
      period: 'May 2015 - November 2017',
      description: 'Established data collection pipelines and developed scripts to interact with various APIs for data retrieval. Implemented data transformation techniques to convert raw data into features suitable for modeling.',
      technologies: 'Python, Java, MongoDB, Web Scraping, PostgreSQL, AWS, Data Analysis'
    }
  ];

  const skills = [
    { name: 'Team Leadership', icon: <Users className="h-8 w-8" />, level: 90 },
    { name: 'Software Architecture', icon: <Code className="h-8 w-8" />, level: 95 },
    { name: 'Python', icon: <Code className="h-8 w-8" />, level: 90 },
    { name: 'JavaScript', icon: <Code className="h-8 w-8" />, level: 85 },
    { name: 'Angular', icon: <Code className="h-8 w-8" />, level: 80 },
    { name: 'AWS', icon: <Cloud className="h-8 w-8" />, level: 90 },
    { name: 'PostgreSQL', icon: <Database className="h-8 w-8" />, level: 85 },
    { name: 'Docker', icon: <Server className="h-8 w-8" />, level: 80 },
    { name: 'Kubernetes', icon: <Server className="h-8 w-8" />, level: 75 }
  ];

  const certifications = [
    { name: 'AWS Certified Solutions Architect', date: 'December 2023' },
    { name: 'Certified Scrum Product Owner', date: 'February 2023' },
    { name: 'Product-Led Certification from Pendo', date: 'December 2022' },
    { name: 'AWS Certified Cloud Practitioner', date: 'December 2022' },
    { name: 'Oracle Certified Java Professional', date: '' },
    { name: 'MongoDB Certification for Java', date: '' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-xl font-bold text-blue-700">VM</div>
            <div className="ml-2 font-semibold text-gray-800">Varun Mehra</div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map(link => (
              <button
                key={link.id}
                className={`font-medium ${activeSection === link.id ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'}`}
                onClick={() => setActiveSection(link.id)}
              >
                {link.label}
              </button>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2"
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-white z-40 shadow-lg md:hidden">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            {navLinks.map(link => (
              <button
                key={link.id}
                className={`p-2 text-left font-medium ${activeSection === link.id ? 'text-blue-700' : 'text-gray-600'}`}
                onClick={() => {
                  setActiveSection(link.id);
                  setMenuOpen(false);
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <main>
        {/* Hero Section */}
        {activeSection === 'home' && (
          <section className="pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                  <span className="text-blue-700">Varun</span> Mehra
                </h1>
                <h2 className="text-2xl md:text-3xl text-gray-600 mb-8">Staff Software Engineer</h2>
                <div className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                  Accomplished staff software engineer with 14+ years of experience, specializing in AWS cloud technologies and cyber insurance solutions.
                </div>
                
                <div className="flex justify-center mt-8 space-x-4">
                  <a 
                    href="https://www.linkedin.com/in/varunmehra003" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-full flex items-center"
                  >
                    <Linkedin className="mr-2 h-5 w-5" /> Connect
                  </a>
                  <button
                    className="border border-blue-700 text-blue-700 hover:bg-blue-50 py-2 px-6 rounded-full flex items-center"
                    onClick={() => setActiveSection('contact')}
                  >
                    <Mail className="mr-2 h-5 w-5" /> Contact Me
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-blue-700 font-bold text-4xl mb-2">14+</div>
                  <div className="text-gray-600">Years of Experience</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-blue-700 font-bold text-4xl mb-2">AWS</div>
                  <div className="text-gray-600">Cloud Specialist</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-blue-700 font-bold text-4xl mb-2">8+</div>
                  <div className="text-gray-600">Team Leadership</div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* About Section */}
        {activeSection === 'about' && (
          <section className="pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">About Me</h2>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <p className="text-gray-700 mb-4">
                  Accomplished staff software engineer with 14+ years of experience in full-stack development and software architecture, specializing in AWS cloud technologies. Possessing an AWS Certified Solutions Architect certification, I have a demonstrated history of delivering scalable and secure software solutions, specifically within the Cyber Insurance industry.
                </p>
                <p className="text-gray-700 mb-4">
                  My passion lies in mentoring and leading teams, driving innovation, and fostering a culture of collaboration and continuous learning. Proficient at working with cross-functional teams to make strategic decisions and ensure the successful delivery of complex projects.
                </p>
                <p className="text-gray-700">
                  Throughout my career, I've developed expertise in a wide range of technologies including Python, JavaScript, Angular, AWS, PostgreSQL, and containerization tools like Docker and Kubernetes.
                </p>
              </div>
            </div>
          </section>
        )}
        
        {/* Experience Section */}
        {activeSection === 'experience' && (
          <section className="pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Professional Experience</h2>
              <div className="space-y-8">
                {experience.map((job, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between flex-wrap">
                      <h3 className="text-xl font-bold text-blue-700">{job.title}</h3>
                      <span className="text-gray-500 font-medium">{job.period}</span>
                    </div>
                    <h4 className="text-gray-700 font-medium mb-3">{job.company}</h4>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <div className="text-sm font-medium text-gray-500">Technologies: {job.technologies}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Skills Section */}
        {activeSection === 'skills' && (
          <section className="pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Technical Skills</h2>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex flex-col"
                    >
                      <div className="flex items-center mb-2">
                        <span className="text-blue-600 mr-2">{skill.icon}</span>
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Certifications Section */}
        {activeSection === 'certifications' && (
          <section className="pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Certifications</h2>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors flex items-start"
                    >
                      <Award className="text-blue-600 h-6 w-6 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-medium">{cert.name}</div>
                        {cert.date && <div className="text-sm text-gray-500">{cert.date}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Contact Section */}
        {activeSection === 'contact' && (
  <section className="pt-32 pb-20 px-4">
    <div className="container mx-auto max-w-4xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Get In Touch</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-blue-700 mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="text-blue-600 h-5 w-5 mr-3" />
              <a href="mailto:varunmehra003@gmail.com" className="text-gray-700 hover:text-blue-700">varunmehra003@gmail.com</a>
            </div>
            <div className="flex items-center">
              <Linkedin className="text-blue-600 h-5 w-5 mr-3" />
              <a href="https://www.linkedin.com/in/varunmehra003" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-700">linkedin.com/in/varunmehra003</a>
            </div>
            <div className="flex items-center">
              <FileText className="text-blue-600 h-5 w-5 mr-3" />
              <a 
                href="/assets/varun-resume.pdf" 
                download="Varun_Mehra_Resume.pdf" 
                className="text-gray-700 hover:text-blue-700 hover:underline"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-blue-700 mb-4">Send a Message</h3>
          
          {/* Add state for form submission */}
          {formStatus === 'success' ? (
            <div className="p-4 bg-green-100 text-green-700 rounded-lg">
              <p>🚀 Your message has landed safely in my inbox! I'll be diving into it and getting back to you shortly. Stay tuned!"</p>
            </div>
          ) : (
            <form 
              action="https://formspree.io/f/mldjpeeb" 
              method="POST"
              className="space-y-4"
              onSubmit={handleFormSubmit}
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-md"
                disabled={formStatus === 'submitting'}
              >
                {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
              {formStatus === 'error' && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                  <p>There was an error sending your message. Please try again or contact me directly via email.</p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  </section>
)}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="font-bold text-xl">Varun Mehra</span>
              <div className="text-gray-400 text-sm">Staff Software Engineer</div>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/varunmehra003"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400"
              >
                <Linkedin />
              </a>
              <a
                href="mailto:varunmehra003@gmail.com"
                className="hover:text-blue-400"
              >
                <Mail />
              </a>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm mt-6">
            © {new Date().getFullYear()} Varun Mehra. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      {scrolled && (
        <button
          className="fixed bottom-6 right-6 bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
          onClick={scrollToTop}
        >
          <ArrowUp />
        </button>
      )}
      
      {/* Chat button - only show if PDF/context is loaded */}
      {pdfLoaded && (
        <button
          className="fixed bottom-6 left-6 bg-blue-700 text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center"
          onClick={() => setChatOpen(true)}
        >
          <MessageSquare />
        </button>
      )}
      
      {/* Chat modal */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[600px] max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-blue-700 text-white rounded-t-lg">
              <div className="flex items-center">
                <Bot className="mr-2" />
                <h3 className="font-semibold">Ask about Varun's Profile</h3>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-700 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none max-w-[80%] p-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask about Varun's experience, skills, etc."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-700 text-white px-4 py-2 rounded-r-md"
                disabled={!newMessage.trim() || loading}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;