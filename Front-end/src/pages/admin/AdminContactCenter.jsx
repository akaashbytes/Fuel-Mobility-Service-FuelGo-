import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useContactStore } from '../../store/useContactStore';
import { useCollaboratorStore } from '../../store/useCollaboratorStore';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Archive,
  Trash2,
  Eye,
  Globe,
  MapPin,
  X,
  Briefcase,
  Layers,
  Activity
} from 'lucide-react';

export default function AdminContactCenter() {
  const requests = useContactStore((state) => state.requests);
  const updateRequestStatus = useContactStore((state) => state.updateRequestStatus);
  const deleteRequest = useContactStore((state) => state.deleteRequest);

  const convertFromLead = useCollaboratorStore((state) => state.convertFromLead);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');

  // Stats calculation
  const totalRequests = requests.length;
  const collabRequests = requests.filter((r) => ['Partnership Request', 'Petrol Bunk Collaboration'].includes(r.category)).length;
  const openRequests = requests.filter((r) => ['New', 'In Review'].includes(r.status)).length;
  const resolvedRequests = requests.filter((r) => r.status === 'Resolved' || r.status === 'Closed').length;

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    return filterCategory === 'ALL' || r.category === filterCategory;
  });

  // Separate requests into General vs. Collaborations
  const generalInquiries = filteredRequests.filter((r) => !['Partnership Request', 'Petrol Bunk Collaboration', 'Business Proposal'].includes(r.category));
  const collaborationProposals = filteredRequests.filter((r) => ['Partnership Request', 'Petrol Bunk Collaboration', 'Business Proposal'].includes(r.category));

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical': return 'danger';
      case 'High': return 'warning';
      case 'Medium': return 'primary';
      case 'Low':
      default:
        return 'ghost';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return 'primary';
      case 'In Review': return 'warning';
      case 'Contacted': return 'info';
      case 'Accepted': return 'success';
      case 'Rejected': return 'danger';
      case 'Closed':
      default:
        return 'ghost';
    }
  };

  const handleAcceptCollaboration = (lead) => {
    if (confirm(`Convert partnership request from "${lead.companyName || lead.name}" into a Prospect Collaborator Partner?`)) {
      // Convert lead to collaborator in useCollaboratorStore
      convertFromLead(lead);
      // Mark lead status as Accepted in useContactStore
      updateRequestStatus(lead.id, 'Accepted');
      alert(`Partnership accepted! "${lead.companyName || lead.name}" has been converted to a Collaborator record with "Prospect" status.`);
    }
  };

  const handleRejectCollaboration = (id) => {
    if (confirm('Mark this partnership proposal as Rejected?')) {
      updateRequestStatus(id, 'Rejected');
    }
  };

  const handleArchiveRequest = (id) => {
    updateRequestStatus(id, 'Closed');
    alert('Request archived and marked as Closed.');
  };

  return (
    <div className="space-y-6 font-sans text-body">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-display text-brand-dark">Admin Contact Center</h1>
        <p className="text-xs text-text-secondary mt-0.5 text-desc">Review public partnership proposals, check inbox questions, and onboard collaborators into active dispatch networks.</p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
        <Card>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">TOTAL REQUESTS</span>
          <span className="text-2xl font-bold text-brand-dark block mt-1">{totalRequests} Leads</span>
        </Card>
        <Card>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">COLLABORATIONS</span>
          <span className="text-2xl font-bold text-brand-primary block mt-1">{collabRequests} Proposals</span>
        </Card>
        <Card>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">OPEN REQUESTS</span>
          <span className="text-2xl font-bold text-warning block mt-1">{openRequests} Awaiting Action</span>
        </Card>
        <Card>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">RESOLVED CHANNELS</span>
          <span className="text-2xl font-bold text-success block mt-1">{resolvedRequests} Settled</span>
        </Card>
      </div>

      {/* Filter HUD */}
      <div className="flex gap-4 font-mono text-xs bg-white border border-borders-outline/10 p-4 rounded-card">
        <div className="space-y-1.5 flex-1 max-w-xs">
          <span className="text-[10px] text-text-secondary uppercase block font-bold">FILTER BY CATEGORY</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-surface-low border border-borders-outline/10 rounded-input py-2 px-3 text-xs focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="General Inquiry">General Inquiries</option>
            <option value="Suggestion">Suggestions</option>
            <option value="Partnership Request">Partnerships</option>
            <option value="Petrol Bunk Collaboration">Bunk Collaborations</option>
            <option value="Business Proposal">Business Proposals</option>
            <option value="Support Request">Support Tickets</option>
          </select>
        </div>
      </div>

      {/* Collaborations Workspace (Accepted/Rejected pipeline) */}
      <Card title="Partnerships & Collaborations Pipeline" subtitle="B2B proposals that can be converted into active collaborator stations">
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-borders-outline/10 text-text-secondary text-desc">
                <th className="py-3 px-2 font-semibold">COMPANY & PROSPECT</th>
                <th className="py-3 px-2 font-semibold">SECTOR & SECTOR</th>
                <th className="py-3 px-2 font-semibold">REGION</th>
                <th className="py-3 px-2 font-semibold">LEAD SOURCE</th>
                <th className="py-3 px-2 font-semibold">PRIORITY</th>
                <th className="py-3 px-2 font-semibold">STATUS</th>
                <th className="py-3 px-2 font-semibold text-right">PIPELINE ACTION</th>
              </tr>
            </thead>
            <tbody>
              {collaborationProposals.length > 0 ? (
                collaborationProposals.map((collab) => (
                  <tr key={collab.id} className="border-b border-borders-outline/5 hover:bg-surface-low/30 text-table">
                    <td className="py-4 px-2">
                      <div className="font-bold text-text-primary">{collab.companyName || 'N/A'}</div>
                      <div className="text-[10px] text-text-muted">{collab.name} ({collab.email})</div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="bg-brand-primary/5 text-brand-primary px-2 py-0.5 rounded border border-brand-primary/10 font-bold uppercase text-[9px]">
                        {collab.businessType || 'Other'}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-text-secondary font-semibold">{collab.serviceRegion || 'N/A'}</td>
                    <td className="py-4 px-2 text-text-muted">{collab.leadSource}</td>
                    <td className="py-4 px-2">
                      <Badge variant={getPriorityBadge(collab.leadPriority)}>{collab.leadPriority.toUpperCase()}</Badge>
                    </td>
                    <td className="py-4 px-2">
                      <Badge variant={getStatusBadge(collab.status)}>{collab.status.toUpperCase()}</Badge>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex gap-1 justify-end font-sans">
                        <button
                          onClick={() => setSelectedRequest(collab)}
                          className="p-1.5 rounded-btn bg-surface-low border border-borders-outline/10 text-text-muted hover:text-text-primary cursor-pointer"
                          title="View Proposal Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        
                        {collab.status === 'New' || collab.status === 'In Review' ? (
                          <>
                            <button
                              onClick={() => handleAcceptCollaboration(collab)}
                              className="p-1.5 rounded-btn bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white cursor-pointer transition-colors"
                              title="Accept & Convert Partner"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRejectCollaboration(collab.id)}
                              className="p-1.5 rounded-btn bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer transition-colors"
                              title="Reject Request"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : null}
                        
                        <button
                          onClick={() => handleArchiveRequest(collab.id)}
                          className="p-1.5 rounded-btn bg-surface-low border border-borders-outline/10 text-text-muted hover:text-amber-600 cursor-pointer"
                          title="Archive"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-text-muted font-mono">
                    NO COLLABORATION OR PARTNERSHIP REQUESTS REGISTERED
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* General Contact Request Inbox Table */}
      <Card title="General inquiries & Support Inbox" subtitle="Public inbox inquiries and customer suggestions logs">
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-borders-outline/10 text-text-secondary text-desc">
                <th className="py-3 px-2 font-semibold">NAME & EMAIL</th>
                <th className="py-3 px-2 font-semibold">CATEGORY</th>
                <th className="py-3 px-2 font-semibold">SUBJECT</th>
                <th className="py-3 px-2 font-semibold">PRIORITY</th>
                <th className="py-3 px-2 font-semibold">STATUS</th>
                <th className="py-3 px-2 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {generalInquiries.length > 0 ? (
                generalInquiries.map((req) => (
                  <tr key={req.id} className="border-b border-borders-outline/5 hover:bg-surface-low/30 text-table">
                    <td className="py-4 px-2">
                      <div className="font-bold text-text-primary">{req.name}</div>
                      <div className="text-[10px] text-text-muted">{req.email}</div>
                    </td>
                    <td className="py-4 px-2 text-text-secondary font-semibold">{req.category}</td>
                    <td className="py-4 px-2 text-text-muted max-w-xs truncate" title={req.subject}>
                      {req.subject}
                    </td>
                    <td className="py-4 px-2">
                      <Badge variant={getPriorityBadge(req.leadPriority)}>{req.leadPriority.toUpperCase()}</Badge>
                    </td>
                    <td className="py-4 px-2">
                      <Badge variant={getStatusBadge(req.status)}>{req.status.toUpperCase()}</Badge>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex gap-1 justify-end font-sans">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="p-1.5 rounded-btn bg-surface-low border border-borders-outline/10 text-text-muted hover:text-text-primary cursor-pointer"
                          title="View Inbox"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        
                        {req.status === 'New' && (
                          <button
                            onClick={() => {
                              updateRequestStatus(req.id, 'Resolved');
                              alert('Request marked as Resolved.');
                            }}
                            className="p-1.5 rounded-btn bg-surface-low border border-borders-outline/10 text-text-muted hover:text-success cursor-pointer"
                            title="Mark Resolved"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (confirm('Delete this contact request permanently?')) {
                              deleteRequest(req.id);
                              alert('Inquiry deleted successfully.');
                            }
                          }}
                          className="p-1.5 rounded-btn bg-surface-low border border-borders-outline/10 text-text-muted hover:text-brand-primary cursor-pointer"
                          title="Delete Request"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-text-muted font-mono">
                    NO GENERAL CONTACT INBOX ITEMS RECEIVED
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Lead details popup modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg bg-[linear-gradient(135deg,#fdf4f5_0%,#f1eef8_100%)] rounded-card shadow-floating border border-borders-outline/10 overflow-hidden relative p-8 flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-borders-outline/10">
              <div>
                <span className="font-mono text-xs font-bold text-brand-primary">CONTACT CENTER INBOX</span>
                <h3 className="text-lg font-bold font-display text-brand-dark mt-0.5">{selectedRequest.subject}</h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1 rounded-btn hover:bg-surface-low text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="py-6 space-y-4 font-mono text-xs text-text-secondary">
              
              <div className="bg-white p-3 rounded-input border border-borders-outline/10 space-y-1">
                <span className="text-[9px] uppercase text-text-muted">Sender Profile</span>
                <p className="font-sans font-bold text-text-primary text-sm">
                  {selectedRequest.name} | {selectedRequest.email} {selectedRequest.phone ? `(${selectedRequest.phone})` : ''}
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">Preferred Channel: {selectedRequest.contactMethod || 'Email'}</p>
              </div>

              {selectedRequest.companyName && (
                <div className="bg-white p-3 rounded-input border border-borders-outline/10 space-y-1">
                  <span className="text-[9px] uppercase text-text-muted">Business Profile</span>
                  <div className="flex justify-between text-text-primary text-xs font-sans font-bold">
                    <span>Company: {selectedRequest.companyName}</span>
                    <span>Sector: {selectedRequest.businessType}</span>
                  </div>
                  {selectedRequest.companyWebsite && (
                    <div className="flex items-center gap-1 text-[10px] text-brand-primary underline mt-1">
                      <Globe className="w-3.5 h-3.5" />
                      <a href={selectedRequest.companyWebsite} target="_blank" rel="noreferrer">
                        {selectedRequest.companyWebsite}
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-white p-3 rounded-input border border-borders-outline/10 space-y-1">
                <span className="text-[9px] uppercase text-text-muted">Inquiry Description</span>
                <p className="font-sans font-semibold text-text-primary text-sm leading-normal">
                  "{selectedRequest.description}"
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-surface-low p-3 rounded-input border border-borders-outline/5 text-center text-[10px]">
                <div>
                  <span className="text-text-muted block uppercase text-[8px]">Category</span>
                  <span className="font-bold text-text-primary mt-0.5 block">{selectedRequest.category}</span>
                </div>
                <div>
                  <span className="text-text-muted block uppercase text-[8px]">Priority</span>
                  <span className="font-bold text-text-primary mt-0.5 block">{selectedRequest.leadPriority}</span>
                </div>
                <div>
                  <span className="text-text-muted block uppercase text-[8px]">Source</span>
                  <span className="font-bold text-text-primary mt-0.5 block">{selectedRequest.leadSource}</span>
                </div>
              </div>

            </div>

            {/* Actions footer */}
            <div className="flex gap-3 pt-4 border-t border-borders-outline/10 font-sans">
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => setSelectedRequest(null)}
              >
                Close Logs
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
