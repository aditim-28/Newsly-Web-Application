import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { epaperService } from '../services/api';
import Navbar from '../components/Navbar';
import './ViewPaper.css';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';

export default function ViewPaper() {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paper, setPaper] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPaper = async () => {
    try {
      setLoading(true);
      const response = await epaperService.getEpaper(paperId);
      setPaper(response.data);

      const pdfResponse = await epaperService.getPdfLink(paperId);
      setPdfUrl(pdfResponse.data.pdfUrl);
      setError('');
    } catch (err) {
      setError('Failed to load paper');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    fetchPaper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paperId, user, navigate]);

  if (!user) return null;

  return (
    <div className="view-paper-page">
      <Navbar />

      <div className="paper-header">
        <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
          <button className="back-btn" onClick={() => navigate('/epaper')}>
            <FiArrowLeft /> Back to E-Papers
          </button>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <FiArrowLeft /> Back to Dashboard
          </button>
        </div>
        {paper && <h1>{paper.name}</h1>}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading paper...</p>
        </div>
      ) : (
        <div className="paper-container">
          {pdfUrl ? (
            <>
              <div className="pdf-viewer">
                <iframe
                  src={pdfUrl}
                  type="application/pdf"
                  width="100%"
                  height="600"
                  title="PDF Viewer"
                ></iframe>
              </div>
              <div className="paper-actions">
                <a href={pdfUrl} download className="download-btn">
                  <FiDownload /> Download PDF
                </a>
                {paper?.url && (
                  <a href={paper.url} target="_blank" rel="noopener noreferrer" className="source-btn">
                    View on Source Website
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className="no-pdf">
              <p>PDF not available at this moment.</p>
              {paper?.url && (
                <a href={paper.url} target="_blank" rel="noopener noreferrer" className="source-link">
                  Visit source website instead
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
