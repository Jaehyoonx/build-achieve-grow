// View: Contact
// Purpose: Displays team member information with LinkedIn and other details.
// Allows users to learn more about the team members.

import './Contact.css';

export default function Contact() {
  const teamMembers = [
    {
      name: 'Ryan Bui',
      role: 'Full Stack Developer',
      linkedin: 'https://www.linkedin.com/in/ryan-vinh-bui/',
      email: 'vinhryan@outlook.com',
      bio: '5th Semester Computer Science Student at Dawson College'
    },
    {
      name: 'Christian Graceffa',
      role: 'Full Stack Developer',
      linkedin: 'https://www.linkedin.com/in/christiam-graceffa-16910b1b1/',
      email: 'christian.graceffa@dawsoncollege.qc.ca',
      bio: '5th Semester Computer Science Student at Dawson College'
    },
    {
      name: 'Haider Ahmed',
      role: 'Full Stack Developer',
      linkedin: 'https://www.linkedin.com/in/haiderahmed1/',
      email: 'haiderahhmed@gmail.com',
      bio: '5th Semester Computer Science Student at Dawson College'
    }
  ];

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>About Us</h1>
        <p>Meet the team behind BAG - Build, Achieve, Grow</p>
      </div>

      <div className="team-grid">
        {teamMembers.map((member, index) =>
          <div key={index} className="team-card">
            <h2>{member.name}</h2>
            <p className="role">{member.role}</p>
            <p className="bio">{member.bio}</p>
            
            <div className="contact-links">
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link linkedin"
              >
                LinkedIn
              </a>
              <a
                href={`mailto:${member.email}`}
                className="contact-link email"
              >
                Email
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="contact-info">
        <h2>Get in Touch</h2>
        <p>
          Have questions about our project? Want to collaborate or provide feedback?
          Feel free to reach out to any of our team members!
        </p>
      </div>
    </div>
  );
}
