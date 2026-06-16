import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Upload, ShieldCheck, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function VerificationPage() {
  const [status, setStatus] = useState('Submitted'); // 'Submitted', 'Under Review', 'Approved', 'Rejected'
  const [documents, setDocuments] = useState({
    nationalId: { name: 'ID_Passport_Scan.pdf', uploaded: true },
    driverLicense: { name: 'Commercial_Driver_License.pdf', uploaded: true },
    hazmatPermit: { name: '', uploaded: false },
    vehicleRegistration: { name: 'Tanker_Safety_Certificate.pdf', uploaded: true }
  });

  const handleMockUpload = (docKey) => {
    setDocuments((prev) => ({
      ...prev,
      [docKey]: { name: `${docKey.toUpperCase()}_verification.pdf`, uploaded: true }
    }));
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'danger';
      case 'Under Review': return 'warning';
      case 'Submitted':
      default:
        return 'primary';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div className="flex justify-between items-center pb-4 border-b border-borders-outline/10">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-dark">Compliance & Verification</h1>
          <p className="text-xs text-text-secondary mt-0.5">Commercial refuelling drivers must verify certifications before going online.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-text-secondary">AUDIT STATE:</span>
          <Badge variant={getStatusColor()}>{status.toUpperCase()}</Badge>
        </div>
      </div>

      {/* Status Alert Panels */}
      {status === 'Submitted' && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-card flex items-start gap-3 text-blue-800 text-xs">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <h4 className="font-bold">Verification Dossier Submitted</h4>
            <p className="leading-relaxed">Your submitted driver and vehicle files are locked in the operations queue. Refuel matching is deactivated until checks pass.</p>
          </div>
        </div>
      )}

      {status === 'Under Review' && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-card flex items-start gap-3 text-amber-800 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Verification Audit In Progress</h4>
            <p className="leading-relaxed">An NexFuel safety compliance officer is auditing your Hazmat credentials. Expected response time: 2 hours.</p>
          </div>
        </div>
      )}

      {status === 'Approved' && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-card flex items-start gap-3 text-emerald-800 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Credential Verification Approved</h4>
            <p className="leading-relaxed">All licensing bounds verified. You are legally cleared to start refueling duty. Go to your dashboard to turn shifts online.</p>
          </div>
        </div>
      )}

      {status === 'Rejected' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-card flex items-start gap-3 text-red-800 text-xs">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">Verification Credentials Rejected</h4>
            <p className="leading-relaxed">Reason: Uploaded Hazmat certificate is expired. Please re-upload a valid license to resume auditing.</p>
          </div>
        </div>
      )}

      {/* Documents Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Docs */}
        <Card title="Driver Credentials" subtitle="Verify identity and heavy vehicle licensing">
          <div className="space-y-4">
            
            {/* National ID */}
            <div className="p-3 bg-surface-low rounded-input border border-borders-outline/10 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-primary" />
                <div>
                  <p className="font-bold text-text-primary">National ID Scan</p>
                  <p className="text-[10px] text-text-secondary font-mono truncate max-w-[150px]">
                    {documents.nationalId.uploaded ? documents.nationalId.name : 'No file uploaded'}
                  </p>
                </div>
              </div>
              {documents.nationalId.uploaded ? (
                <Badge variant="success">Uploaded</Badge>
              ) : (
                <button
                  onClick={() => handleMockUpload('nationalId')}
                  className="px-3 py-1 bg-brand-primary text-white rounded-btn hover:bg-brand-primary-container text-[10px] font-mono font-bold cursor-pointer"
                >
                  Upload File
                </button>
              )}
            </div>

            {/* CDL License */}
            <div className="p-3 bg-surface-low rounded-input border border-borders-outline/10 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-primary" />
                <div>
                  <p className="font-bold text-text-primary">Commercial License (CDL)</p>
                  <p className="text-[10px] text-text-secondary font-mono truncate max-w-[150px]">
                    {documents.driverLicense.uploaded ? documents.driverLicense.name : 'No file uploaded'}
                  </p>
                </div>
              </div>
              {documents.driverLicense.uploaded ? (
                <Badge variant="success">Uploaded</Badge>
              ) : (
                <button
                  onClick={() => handleMockUpload('driverLicense')}
                  className="px-3 py-1 bg-brand-primary text-white rounded-btn hover:bg-brand-primary-container text-[10px] font-mono font-bold cursor-pointer"
                >
                  Upload File
                </button>
              )}
            </div>

          </div>
        </Card>

        {/* Vehicle & Hazmat Docs */}
        <Card title="Hazmat & Vehicle Safety" subtitle="Verify safety permits and calibrations">
          <div className="space-y-4">
            
            {/* Hazmat Permit */}
            <div className="p-3 bg-surface-low rounded-input border border-borders-outline/10 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-primary" />
                <div>
                  <p className="font-bold text-text-primary">Hazmat Clearance Permit</p>
                  <p className="text-[10px] text-text-secondary font-mono truncate max-w-[150px]">
                    {documents.hazmatPermit.uploaded ? documents.hazmatPermit.name : 'No file uploaded'}
                  </p>
                </div>
              </div>
              {documents.hazmatPermit.uploaded ? (
                <Badge variant="success">Uploaded</Badge>
              ) : (
                <button
                  onClick={() => handleMockUpload('hazmatPermit')}
                  className="px-3 py-1 bg-brand-primary text-white rounded-btn hover:bg-brand-primary-container text-[10px] font-mono font-bold cursor-pointer"
                >
                  Upload File
                </button>
              )}
            </div>

            {/* Vehicle Registration */}
            <div className="p-3 bg-surface-low rounded-input border border-borders-outline/10 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-primary" />
                <div>
                  <p className="font-bold text-text-primary">Tanker Safety Registration</p>
                  <p className="text-[10px] text-text-secondary font-mono truncate max-w-[150px]">
                    {documents.vehicleRegistration.uploaded ? documents.vehicleRegistration.name : 'No file uploaded'}
                  </p>
                </div>
              </div>
              {documents.vehicleRegistration.uploaded ? (
                <Badge variant="success">Uploaded</Badge>
              ) : (
                <button
                  onClick={() => handleMockUpload('vehicleRegistration')}
                  className="px-3 py-1 bg-brand-primary text-white rounded-btn hover:bg-brand-primary-container text-[10px] font-mono font-bold cursor-pointer"
                >
                  Upload File
                </button>
              )}
            </div>

          </div>
        </Card>

      </div>

      {/* Operational State Controller for Testing/Auditing */}
      <Card title="Compliance Debug Interface" subtitle="Verify status overlays (Development utility)">
        <div className="flex gap-2.5 font-mono text-xs">
          {['Submitted', 'Under Review', 'Approved', 'Rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 border rounded-btn font-bold cursor-pointer transition-all ${
                status === s
                  ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                  : 'border-borders-outline/15 hover:border-borders-outline/35 bg-white text-text-muted'
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </Card>

    </div>
  );
}
