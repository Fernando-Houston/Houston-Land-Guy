'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Activity,
  MessageSquare,
  FileText,
  Calculator,
  Eye,
  Plus,
  Edit,
  Save,
  X,
  Star,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface Lead {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  company?: string;
  source: string;
  status: string;
  score: number;
  neighborhoods: string[];
  projectTypes: string[];
  budgetMin?: number;
  budgetMax?: number;
  timeline?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
  interactions: any[];
  calculatorResults: any[];
}

const statusColors = {
  NEW: { bg: 'bg-blue-100', text: 'text-blue-800' },
  QUALIFIED: { bg: 'bg-green-100', text: 'text-green-800' },
  CONTACTED: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  CONVERTED: { bg: 'bg-purple-100', text: 'text-purple-800' }
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    fetchLead();
  }, [params.id]);

  const fetchLead = async () => {
    try {
      const response = await fetch(`/api/leads/${params.id}`);
      const data = await response.json();
      
      if (data) {
        setLead(data);
        setEditedLead(data);
        // Mock notes for now
        setNotes([
          { id: 1, text: 'Initial contact made via email', createdAt: new Date().toISOString(), author: 'Admin' },
          { id: 2, text: 'Interested in 10-20 acre development in Katy area', createdAt: new Date().toISOString(), author: 'Admin' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/leads/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedLead)
      });
      
      if (response.ok) {
        const updated = await response.json();
        setLead(updated);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: notes.length + 1,
        text: newNote,
        createdAt: new Date().toISOString(),
        author: 'Admin'
      };
      setNotes([note, ...notes]);
      setNewNote('');
      // TODO: Save note to database
    }
  };

  const calculateEngagementScore = () => {
    if (!lead) return 0;
    const interactionScore = (lead.interactions?.length || 0) * 5;
    const calculatorScore = (lead.calculatorResults?.length || 0) * 10;
    const baseScore = lead.score || 0;
    return Math.min(100, baseScore + interactionScore + calculatorScore);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lead not found</h2>
          <Link href="/admin/leads" className="text-green-600 hover:text-green-700">
            Back to leads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/leads"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to leads
          </Link>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {lead.name || 'Unknown Lead'}
              </h1>
              <p className="text-gray-600 mt-1">{lead.email}</p>
            </div>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditedLead(lead);
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lead Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Lead Information</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedLead.name || ''}
                      onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-900">{lead.name || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedLead.company || ''}
                      onChange={(e) => setEditedLead({ ...editedLead, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-900">{lead.company || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={editedLead.phone || ''}
                      onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {lead.phone ? (
                        <a href={`tel:${lead.phone}`} className="text-blue-600 hover:text-blue-700">
                          {lead.phone}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  {editMode ? (
                    <select
                      value={editedLead.status}
                      onChange={(e) => setEditedLead({ ...editedLead, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="NEW">New</option>
                      <option value="QUALIFIED">Qualified</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="CONVERTED">Converted</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-sm rounded-full ${statusColors[lead.status as keyof typeof statusColors].bg} ${statusColors[lead.status as keyof typeof statusColors].text}`}>
                      {lead.status}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Project Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                  <p className="text-gray-900">
                    {lead.budgetMin || lead.budgetMax ? (
                      `$${lead.budgetMin?.toLocaleString() || '0'} - $${lead.budgetMax?.toLocaleString() || '∞'}`
                    ) : (
                      'Not specified'
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                  <p className="text-gray-900">{lead.timeline || 'Not specified'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interested Neighborhoods</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {lead.neighborhoods.length > 0 ? (
                      lead.neighborhoods.map((neighborhood, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {neighborhood}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">None specified</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Types</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {lead.projectTypes.length > 0 ? (
                      lead.projectTypes.map((type, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {type.replace(/_/g, ' ')}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">None specified</span>
                    )}
                  </div>
                </div>

                {lead.message && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Message</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{lead.message}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Activity Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>
              
              <div className="space-y-4">
                {lead.interactions.map((interaction, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{interaction.type}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(interaction.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
                
                {lead.interactions.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No activity recorded yet</p>
                )}
              </div>
            </motion.div>

            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Notes</h2>
              
              <div className="mb-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
                <button
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Note
                </button>
              </div>

              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900">{note.text}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {note.author} • {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lead Score */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Lead Score</h3>
              <div className="text-center">
                <div className="relative inline-flex">
                  <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-3xl font-bold text-green-600">
                      {calculateEngagementScore()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Engagement Score</p>
                
                <div className="mt-4 space-y-2 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Score</span>
                    <span className="font-medium">{lead.score}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Page Views</span>
                    <span className="font-medium">{lead.interactions?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tool Uses</span>
                    <span className="font-medium">{lead.calculatorResults?.length || 0}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <a
                  href={`mailto:${lead.email}`}
                  className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </a>
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone}`}
                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                )}
                <button className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Calendar className="w-4 h-4" />
                  Schedule Meeting
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <FileText className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            </motion.div>

            {/* Lead Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Lead Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Source</p>
                  <p className="font-medium">{lead.source.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium">
                    {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium">
                    {format(new Date(lead.updatedAt), 'MMM d, yyyy')}
                  </p>
                </div>
                {lead.lastContactedAt && (
                  <div>
                    <p className="text-sm text-gray-600">Last Contacted</p>
                    <p className="font-medium">
                      {format(new Date(lead.lastContactedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}