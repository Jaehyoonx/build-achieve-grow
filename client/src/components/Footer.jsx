// Component: Footer
// Purpose: Displays team names and dataset/library attributions for academic credit.

import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-team">
        <p><strong>B.A.G. Build, Achieve, Grow</strong></p>
        <p>Haider Ahmed · Ryan Bui · Christian Graceffa</p>
      </div>

      <div className="footer-credits">
        <p>Course: 420-520-DW, Dawson College</p>
        <p>Semester: Fall 2025</p>
        <p>Built with React · Express · MongoDB</p>

        <p>
          Data sourced for educational use from:{' '}
          <a
            href="https://www.kaggle.com/datasets/jacksoncrow/stock-market-dataset"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stock Market Dataset
          </a>{' '}
          and{' '}
          <a
            href="https://www.kaggle.com/datasets/ankurzing/sentiment-analysis-for-financial-news"
            target="_blank"
            rel="noopener noreferrer"
          >
            Financial News Headlines Dataset
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
