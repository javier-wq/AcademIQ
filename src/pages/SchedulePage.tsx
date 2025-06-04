import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { Plus, X, Calendar as CalendarIcon, Clock, Tag, Paperclip } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  type: 'exam' | 'homework' | 'other';
  subjectId?: string;
  start: string;
  end?: string;
  description?: string;
  importance: 'low' | 'medium' | 'high';
  attachments: File[];
  reminder?: string;
}

const SchedulePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  
  // Mock subjects data
  const subjects = [
    { id: '1', name: 'Mathematics' },
    { id: '2', name: 'Physics' },
    { id: '3', name: 'Literature' },
  ];
  
  const initialFormState = {
    title: '',
    type: 'other' as Activity['type'],
    subjectId: '',
    start: '',
    end: '',
    description: '',
    importance: 'low' as Activity['importance'],
    attachments: [] as File[],
    reminder: '',
  };
  
  const [formData, setFormData] = useState(initialFormState);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newActivity = {
      id: editingActivity?.id || Date.now().toString(),
      ...formData,
    };
    
    if (editingActivity) {
      setActivities(activities.map(act => 
        act.id === editingActivity.id ? newActivity : act
      ));
    } else {
      setActivities([...activities, newActivity]);
    }
    
    setFormData(initialFormState);
    setShowForm(false);
    setEditingActivity(null);
  };
  
  const handleEventClick = (info: any) => {
    const activity = activities.find(a => a.id === info.event.id);
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        title: activity.title,
        type: activity.type,
        subjectId: activity.subjectId || '',
        start: activity.start,
        end: activity.end || '',
        description: activity.description || '',
        importance: activity.importance,
        attachments: [],
        reminder: activity.reminder || '',
      });
      setShowForm(true);
    }
  };
  
  const getEventColor = (importance: Activity['importance']) => {
    switch (importance) {
      case 'low': return '#22c55e';
      case 'medium': return '#eab308';
      case 'high': return '#ef4444';
      default: return '#3b82f6';
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Activity
        </button>
      </div>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingActivity ? 'Edit Activity' : 'Add New Activity'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingActivity(null);
                  setFormData(initialFormState);
                }}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter activity name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Activity['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="exam">Exam</option>
                  <option value="homework">Homework</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {(formData.type === 'exam' || formData.type === 'homework') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="date"
                      required
                      value={formData.start.split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time (Optional)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="time"
                      value={formData.start.split('T')[1] || ''}
                      onChange={(e) => {
                        const date = formData.start.split('T')[0];
                        setFormData({ ...formData, start: `${date}T${e.target.value}` });
                      }}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.end ? parseInt(formData.end) : ''}
                  onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Duration in minutes"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder (Optional)
                </label>
                <select
                  value={formData.reminder}
                  onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">No reminder</option>
                  <option value="5">5 minutes before</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                  <option value="1440">1 day before</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Enter activity description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Importance
                </label>
                <div className="flex gap-4">
                  {['low', 'medium', 'high'].map((level) => (
                    <label key={level} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="importance"
                        value={level}
                        checked={formData.importance === level}
                        onChange={(e) => setFormData({ ...formData, importance: e.target.value as Activity['importance'] })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setFormData({ ...formData, attachments: files });
                    }}
                    className="hidden"
                    id="attachments"
                  />
                  <label
                    htmlFor="attachments"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <Paperclip size={16} />
                    <span>Add Files</span>
                  </label>
                  <span className="text-sm text-gray-500">
                    {formData.attachments.length} files selected
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setFormData(initialFormState)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingActivity(null);
                    setFormData(initialFormState);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingActivity ? 'Update' : 'Save'} Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={activities.map(activity => ({
            id: activity.id,
            title: activity.title,
            start: activity.start,
            end: activity.end,
            backgroundColor: getEventColor(activity.importance),
            borderColor: getEventColor(activity.importance),
          }))}
          eventClick={handleEventClick}
          height="auto"
          aspectRatio={1.8}
        />
      </div>
    </div>
  );
};

export default SchedulePage;