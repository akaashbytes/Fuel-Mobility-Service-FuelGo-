import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useFeedbackStore } from '../../store/useFeedbackStore';
import {
  AlertTriangle,
  Eye,
  CheckCircle2,
  AlertCircle,
  Archive,
  RefreshCw,
  Search,
  Filter,
  X
} from 'lucide-react';

export default function AdminFeedback() {
  const feedbacks = useFeedbackStore((state) => state.feedbacks);
  const updateFeedbackStatus = useFeedbackStore((state) => state.updateFeedbackStatus);
  const archiveFeedback = useFeedbackStore((state) => state.archiveFeedback);

  const [filterRating, setFilterRating] = useState('ALL');
  const [filterProvider, setFilterProvider] = useState('ALL');
  const [selectedReview, setSelectedReview] = useState(null);

  // Statistics calculation
  const totalFeedback = feedbacks.length;
  const totalRatingSum = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = totalFeedback > 0 ? (totalRatingSum / totalFeedback).toFixed(1) : '0.0';
  const positiveReviews = feedbacks.filter((f) => f.rating >= 4).length;
  const negativeReviews = feedbacks.filter((f) => f.rating <= 2).length;

  // Unique list of providers for filter dropdown
  const uniqueProviders = Array.from(new Set(feedbacks.map((f) => f.providerName)));

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesRating = filterRating === 'ALL' || f.rating.toString() === filterRating;
    const matchesProvider = filterProvider === 'ALL' || f.providerName === filterProvider;
    return matchesRating && matchesProvider;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return 'primary';
      case 'Reviewed': return 'info';
      case 'Escalated': return 'warning';
      case 'Resolved':
      default:
        return 'success';
    }
  };

  return (
    <div className="space-y-6 font-sans text-body">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-display text-brand-dark">Customer Reviews Ledger</h1>
        <p className="text-xs text-text-secondary mt-0.5 text-desc">Review rating breakdowns, flag negative feedback anomalies, and archive resolved reviews.</p>
      </div>

      {/* Negative Feedback Alerts Dashboard Warning Banner */}
      {feedbacks.some((f) => f.rating <= 2 && f.status === 'Escalated') && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-card text-xs text-red-800 leading-normal flex items-start gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-950 uppercase font-mono">HIGH PRIORITY FEEDBACK ALERT</h4>
            <p className="mt-1 text-gray-700">
              There are critical negative reviews (rating &le; 2 Stars) that are currently ESCALATED and awaiting urgent review.
            </p>
          </div>
        </div>
      )}

      {/* Metrics overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
        <Card>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">TOTAL REVIEWS</span>
          <span className="text-2xl font-bold text-brand-dark block mt-1">{totalFeedback} Reviews</span>
        </Card>
        <Card>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">AVERAGE RATING</span>
          <span className="text-2xl font-bold text-amber-500 block mt-1">⭐ {averageRating} / 5.0</span>
        </Card>
        <Card>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">POSITIVE FEEDBACKS</span>
          <span className="text-2xl font-bold text-success block mt-1">{positiveReviews} (Good/Excellent)</span>
        </Card>
        <Card>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">NEGATIVE CRITICALS</span>
          <span className="text-2xl font-bold text-emergency block mt-1">{negativeReviews} (&le; 2 Stars)</span>
        </Card>
      </div>

      {/* Filter HUD */}
      <div className="flex gap-4 font-mono text-xs bg-white border border-borders-outline/10 p-4 rounded-card">
        <div className="flex-1 flex flex-col md:flex-row gap-3">
          
          {/* Rating filter */}
          <div className="space-y-1.5 flex-1">
            <span className="text-[10px] text-text-secondary uppercase block font-bold">FILTER BY RATING</span>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full bg-surface-low border border-borders-outline/10 rounded-input py-2 px-3 text-xs focus:outline-none"
            >
              <option value="ALL">All Star Ratings</option>
              <option value="5">⭐ 5 Stars</option>
              <option value="4">⭐ 4 Stars</option>
              <option value="3">⭐ 3 Stars</option>
              <option value="2">⭐ 2 Stars</option>
              <option value="1">⭐ 1 Star</option>
            </select>
          </div>

          {/* Provider filter */}
          <div className="space-y-1.5 flex-1">
            <span className="text-[10px] text-text-secondary uppercase block font-bold">FILTER BY PROVIDER</span>
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="w-full bg-surface-low border border-borders-outline/10 rounded-input py-2 px-3 text-xs focus:outline-none"
            >
              <option value="ALL">All Refuelers</option>
              {uniqueProviders.map((name, i) => (
                <option key={i} value={name}>{name}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Feedback table ledger */}
      <Card title="Customer Feedback Registry" subtitle="Historical logs of dispatcher evaluations">
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-borders-outline/10 text-text-secondary text-desc">
                <th className="py-3 px-2 font-semibold">CUSTOMER</th>
                <th className="py-3 px-2 font-semibold">PROVIDER</th>
                <th className="py-3 px-2 font-semibold text-center">RATING</th>
                <th className="py-3 px-2 font-semibold">CATEGORY</th>
                <th className="py-3 px-2 font-semibold">COMMENT</th>
                <th className="py-3 px-2 font-semibold">STATUS</th>
                <th className="py-3 px-2 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map((f) => (
                  <tr
                    key={f.id}
                    className={`border-b border-borders-outline/5 hover:bg-surface-low/30 text-table ${
                      f.rating <= 2 && f.status === 'Escalated' ? 'bg-red-50/50' : ''
                    }`}
                  >
                    <td className="py-4 px-2 font-bold text-text-primary">{f.customerName}</td>
                    <td className="py-4 px-2 text-text-muted">{f.providerName}</td>
                    <td className="py-4 px-2 text-center text-amber-500 font-bold">
                      ⭐ {f.rating}.0
                    </td>
                    <td className="py-4 px-2 text-text-secondary">
                      <span className="bg-brand-primary/5 text-brand-primary px-2 py-0.5 rounded border border-brand-primary/10 font-bold uppercase text-[9px]">
                        {f.category}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-text-muted max-w-xs truncate" title={f.comment}>
                      {f.comment}
                    </td>
                    <td className="py-4 px-2">
                      <Badge variant={getStatusBadge(f.status)}>{f.status.toUpperCase()}</Badge>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex gap-1 justify-end font-sans">
                        <button
                          onClick={() => setSelectedReview(f)}
                          className="p-1.5 rounded-btn bg-surface-low border border-borders-outline/10 text-text-muted hover:text-text-primary cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        
                        {f.status !== 'Resolved' && (
                          <>
                            <button
                              onClick={() => updateFeedbackStatus(f.id, 'Reviewed')}
                              className="p-1.5 rounded-btn bg-surface-low border border-borders-outline/10 text-text-muted hover:text-success cursor-pointer"
                              title="Mark Reviewed"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => updateFeedbackStatus(f.id, 'Escalated')}
                              className="p-1.5 rounded-btn bg-surface-low border border-borders-outline/10 text-text-muted hover:text-emergency cursor-pointer"
                              title="Escalate"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => archiveFeedback(f.id)}
                              className="p-1.5 rounded-btn bg-surface-low border border-borders-outline/10 text-text-muted hover:text-amber-600 cursor-pointer"
                              title="Resolve & Archive"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-text-muted font-mono">
                    NO CUSTOMER REVIEWS MATCHING SELECTED FILTERS FOUND
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Review details popup modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg bg-[linear-gradient(135deg,#fdf4f5_0%,#f1eef8_100%)] rounded-card shadow-floating border border-borders-outline/10 overflow-hidden relative p-8 flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-borders-outline/10">
              <div>
                <span className="font-mono text-xs font-bold text-brand-primary">CUSTOMER REVENUE AUDIT</span>
                <h3 className="text-lg font-bold font-display text-brand-dark mt-0.5">{selectedReview.customerName}</h3>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-1 rounded-btn hover:bg-surface-low text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="py-6 space-y-4 font-mono text-xs text-text-secondary">
              
              {selectedReview.rating <= 2 && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-btn text-[10px] text-red-700 leading-normal flex items-start gap-1.5 font-sans">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p>High Priority Feedback: This review has been marked as escalated due to critical rating grades.</p>
                </div>
              )}

              <div className="bg-white p-3 rounded-input border border-borders-outline/10 space-y-1">
                <span className="text-[9px] uppercase text-text-muted">Comment / Text description</span>
                <p className="font-sans font-semibold text-text-primary text-sm leading-normal">"{selectedReview.comment}"</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-input border border-borders-outline/10 space-y-0.5">
                  <span className="text-[9px] uppercase text-text-muted">Assigned Provider</span>
                  <p className="font-bold text-text-primary text-xs">{selectedReview.providerName} (ID: {selectedReview.providerId})</p>
                </div>
                <div className="bg-white p-3 rounded-input border border-borders-outline/10 space-y-0.5">
                  <span className="text-[9px] uppercase text-text-muted">Order reference Code</span>
                  <p className="font-bold text-text-primary text-xs">{selectedReview.orderId}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-surface-low p-3 rounded-input border border-borders-outline/5 text-center text-[10px]">
                <div>
                  <span className="text-text-muted block uppercase text-[8px]">Quality</span>
                  <span className="font-bold text-text-primary mt-0.5 block">{selectedReview.quality}</span>
                </div>
                <div>
                  <span className="text-text-muted block uppercase text-[8px]">Behaviour</span>
                  <span className="font-bold text-text-primary mt-0.5 block">{selectedReview.behaviour}</span>
                </div>
                <div>
                  <span className="text-text-muted block uppercase text-[8px]">Experience</span>
                  <span className="font-bold text-text-primary mt-0.5 block">{selectedReview.experience}</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-input border border-borders-outline/10 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-text-muted">Would Recommend:</span>
                  <span className={`font-bold ${selectedReview.recommend === 'Yes' ? 'text-success' : 'text-emergency'}`}>{selectedReview.recommend.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Contact Permission Granted:</span>
                  <span className="font-bold text-text-primary">{selectedReview.contactPermission ? 'YES' : 'NO'}</span>
                </div>
              </div>

            </div>

            {/* Actions footer */}
            <div className="flex gap-3 pt-4 border-t border-borders-outline/10 font-sans">
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => setSelectedReview(null)}
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
