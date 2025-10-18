import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Report from '../components/Report';
import Loader from '../components/Loader';
import { getReport } from '../services/api';
import '../styles/App.css';

const ReportPage = () => {
  const { testCode } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReport();
  }, [testCode]);

  const fetchReport = async () => {
    try {
      const response = await getReport(testCode);
      setReport(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch report');
      toast.error('Failed to fetch report');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container">
        <Loader text="Loading report..." />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
            <h2 style={{ marginBottom: '8px' }}>Report Not Found</h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              {error || 'The report you\'re looking for doesn\'t exist or has expired.'}
            </p>
            <button className="btn btn-primary" onClick={handleBack}>
              <ArrowLeft size={18} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>📊 Email Deliverability Report</h1>
        <p>Detailed analysis of your email test</p>
      </div>

      <button 
        className="btn btn-secondary" 
        onClick={handleBack}
        style={{ marginBottom: '20px' }}
      >
        <ArrowLeft size={18} />
        Back to Home
      </button>

      <Report report={report} />
    </div>
  );
};

export default ReportPage;