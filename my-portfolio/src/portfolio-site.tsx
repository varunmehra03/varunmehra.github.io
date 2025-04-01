import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Menu, X, Linkedin, Mail, FileText, Award, Code, Database, Cloud, Server, Users, MessageSquare, Send, Bot } from 'lucide-react';

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
  
  // Function to handle AI response based on resume context
  const getAIResponse = (question) => {
    // Set loading state to true
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let response = "I'm not sure about that. Could you ask something about Varun's experience, skills, or background?";
      
      // Simple keyword matching for questions
      const lowerQuestion = question.toLowerCase();
      
      if (lowerQuestion.includes('experience') || lowerQuestion.includes('work') || lowerQuestion.includes('job')) {
        response = "Varun has over 14 years of experience in software engineering. He's currently a Staff Software Engineer at Guidewire Software, where he leads a team of 8 engineers. Previously, he was an App Engineering Lead at Cyence (acquired by Guidewire) and has experience at Lister Technologies and Infosys as well.";
      } else if (lowerQuestion.includes('skill') || lowerQuestion.includes('technology') || lowerQuestion.includes('tech stack')) {
        response = "Varun is skilled in Python, JavaScript, Angular, AWS services, PostgreSQL, Kubernetes, Docker, and FastAPI. He's particularly strong in cloud architecture, team leadership, and software design.";
      } else if (lowerQuestion.includes('aws') || lowerQuestion.includes('cloud')) {
        response = "Varun is an AWS Certified Solutions Architect and has extensive experience with AWS cloud technologies. He re-architected the Cyence Risk Analytics application using AWS Well-Architected Framework best practices and implemented cost-saving measures that reduced EC2 costs by 70%.";
      } else if (lowerQuestion.includes('education') || lowerQuestion.includes('study') || lowerQuestion.includes('degree')) {
        response = "Varun holds a Bachelor of Engineering (Hons.) in Computer Science and Engineering from Medi-Caps Institute of Technology & Management, which he completed in 2010.";
      } else if (lowerQuestion.includes('certification') || lowerQuestion.includes('certified')) {
        response = "Varun holds several certifications including AWS Certified Solutions Architect (2023), Certified Scrum Product Owner (2023), Product-Led Certification from Pendo (2022), AWS Certified Cloud Practitioner (2022), Oracle Certified Java Professional, and MongoDB Certification for Java.";
      } else if (lowerQuestion.includes('project') || lowerQuestion.includes('achievement')) {
        response = "One of Varun's notable achievements was collaborating with the OPS team on Project Sandman to identify infrastructure cost-saving measures, which achieved a 70% reduction in EC2 costs (~$200k saved annually) and consolidated App/QA Redshift clusters for additional savings of $42k over 12 months.";
      } else if (lowerQuestion.includes('team') || lowerQuestion.includes('leadership') || lowerQuestion.includes('manage')) {
        response = "Varun has strong team leadership skills. At Guidewire, he led and managed a team of 8 engineers, conducting regular one-on-ones to provide guidance, performance feedback, and career development support. He championed code reviews and mentored team members to ensure adherence to industry standards and best practices.";
      } else if (lowerQuestion.includes('cyber') || lowerQuestion.includes('insurance') || lowerQuestion.includes('security')) {
        response = "Varun specializes in the Cyber Insurance industry. At Cyence, he worked on risk analytics for cyber security, helping the insurance industry understand the impact of cyber risk in context of dollars and probabilities. He also served as a Security Champion for products, proactively addressing vulnerabilities and maintaining secure codebases.";
      } else if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('hey')) {
        response = "Hello! I'm Varun's AI assistant. How can I help you learn more about his professional background?";
      } else if (lowerQuestion.includes('thank')) {
        response = "You're welcome! Feel free to ask if you have any other questions about Varun's experience or skills.";
      } else if (lowerQuestion.includes('contact') || lowerQuestion.includes('email') || lowerQuestion.includes('phone') || lowerQuestion.includes('reach')) {
        response = "You can contact Varun via email at varunmehra003@gmail.com or connect with him on LinkedIn at linkedin.com/in/varunmehra003. His phone number is +91-9677135061.";
      }
      
      // Add the response to messages
      setMessages(prev => [...prev, { sender: 'bot', text: response }]);
      setLoading(false);
    }, 1500); // Simulated 1.5 second delay for "thinking"
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
                      <a href="#" className="text-gray-700 hover:text-blue-700">Download Resume</a>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-blue-700 mb-4">Send a Message</h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Email"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Message"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-md"
                    >
                      Send Message
                    </button>
                  </form>
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
      
      {/* Chat button */}
      <button
        className="fixed bottom-6 left-6 bg-blue-700 text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center"
        onClick={() => setChatOpen(true)}
      >
        <MessageSquare />
      </button>
      
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