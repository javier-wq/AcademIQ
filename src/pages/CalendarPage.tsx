import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus, X, Calendar as CalendarIcon } from 'lucide-react';

interface ClassSchedule {
  id: string;
  subjectId: string;
  teacherId: string;
  classroom: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  type: 'theory' | 'laboratory';
}

const CalendarPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null);
  
  // Mock data
  const subjects = [
    { id: '1', name: 'Mathematics' },
    { id: '2', name: 'Physics' },
    { id: '3', name: 'Literature' },
  ];
  
  const teachers = [
    { id: '1', name: 'Will Castro' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'Michael Brown' },
  ];
  
  const initialFormState = {
    subjectId: '',
    teacherId: '',
    classroom: '',
    daysOfWeek: [] as number[],
    startTime: '',
    endTime: '',
    startDate: '',
    endDate: '',
    type: 'theory' as ClassSchedule['type'],
  };
  
  const [formData, setFormData] = useState(initialFormState);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSchedule = {
      id: editingSchedule?.id || Date.now().toString(),
      ...formData,
    };
    
    if (editingSchedule) {
      setSchedules(schedules.map(sch => 
        sch.id === editingSchedule.id ? newSchedule : sch
      ));
    } else {
      setSchedules([...schedules, newSchedule]);
    }
    
    setFormData(initialFormState);
    setShowForm(false);
    setEditingSchedule(null);
  };
  
  const handleEventClick = (info: any) => {
    const schedule = schedules.find(s => s.id === info.event.id);
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        subjectId: schedule.subjectId,
        teacherId: schedule.teacherId,
        classroom: schedule.classroom,
        daysOfWeek: schedule.daysOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        type: schedule.type,
      });
      setShowForm(true);
    }
  };
  
  const weekdays = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
  ];
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Class Schedule</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Class Schedule
        </button>
      </div>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingSchedule ? 'Edit Class Schedule' : 'Add New Class Schedule'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingSchedule(null);
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
                  Subject
                </label>
                <select
                  required
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher
                </label>
                <select
                  required
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classroom
                </label>
                <input
                  type="text"
                  required
                  value={formData.classroom}
                  onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter classroom (e.g., A22)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Days
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {weekdays.map((day) => (
                    <label key={day.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.daysOfWeek.includes(day.id)}
                        onChange={(e) => {
                          const newDays = e.target.checked
                            ? [...formData.daysOfWeek, day.id]
                            : formData.daysOfWeek.filter(d => d !== day.id);
                          setFormData({ ...formData, daysOfWeek: newDays });
                        }}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>{day.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      value="theory"
                      checked={formData.type === 'theory'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as ClassSchedule['type'] })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Theory</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      value="laboratory"
                      checked={formData.type === 'laboratory'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as ClassSchedule['type'] })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Laboratory</span>
                  </label>
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
                    setEditingSchedule(null);
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
                  {editingSchedule ? 'Update' : 'Save'} Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay',
          }}
          events={schedules.map(schedule => {
            const subject = subjects.find(s => s.schedule.subjectId);
            const teacher = teachers.find(t => t.id === schedule.teacherId);
            
            return {
              id: schedule.id,
              title: `${subject?.name || 'Unknown Subject'}\n${schedule.classroom}\n${teacher?.name || 'Unknown Teacher'}`,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              daysOfWeek: schedule.daysOfWeek,
              startRecur: schedule.startDate,
              endRecur: schedule.endDate,
              backgroundColor: schedule.type === 'theory' ? '#3b82f6' : '#8b5cf6',
              borderColor: schedule.type === 'theory' ? '#2563eb' : '#7c3aed',
            };
          })}
          eventClick={handleEventClick}
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          height="auto"
          aspectRatio={1.8}
        />
      </div>
    </div>
  );
};

export default CalendarPage;