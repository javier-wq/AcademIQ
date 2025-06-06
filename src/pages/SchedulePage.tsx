import React, { useState } from 'react';
import { Plus, X, Calendar, Clock, Tag, Paperclip, AlertCircle } from 'lucide-react';

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

// Simulamos un calendario simple para mostrar actividades
const SimpleActivityCalendar: React.FC<{
  activities: Activity[];
  subjects: any[];
  onEventClick: (activity: Activity) => void;
}> = ({ activities, subjects, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    // Días del mes siguiente
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }
    
    return days;
  };
  
  const getActivitiesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return activities.filter(activity => {
      const activityDate = activity.start.split('T')[0];
      return activityDate === dateStr;
    });
  };
  
  const getImportanceColor = (importance: Activity['importance']) => {
    switch (importance) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };
  
  const getTypeIcon = (type: Activity['type']) => {
    switch (type) {
      case 'exam': return '📝';
      case 'homework': return '📚';
      default: return '📅';
    }
  };
  
  const days = getDaysInMonth(currentDate);
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };
  
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Header del calendario */}
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-200 rounded-md transition-colors"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-200 rounded-md transition-colors"
        >
          →
        </button>
      </div>
      
      {/* Días de la semana */}
      <div className="grid grid-cols-7 bg-gray-50">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center font-medium text-gray-700 border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      
      {/* Días del mes */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayActivities = getActivitiesForDate(day.date);
          const isToday = day.date.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border-r border-b last:border-r-0 ${
                !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
              } ${isToday ? 'bg-blue-50' : ''}`}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                {day.date.getDate()}
              </div>
              
              <div className="space-y-1">
                {dayActivities.slice(0, 2).map((activity) => {
                  const subject = subjects.find(s => s.id === activity.subjectId);
                  return (
                    <div
                      key={activity.id}
                      onClick={() => onEventClick(activity)}
                      className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity border ${getImportanceColor(activity.importance)}`}
                    >
                      <div className="flex items-center gap-1">
                        <span>{getTypeIcon(activity.type)}</span>
                        <span className="truncate">{activity.title}</span>
                      </div>
                      {subject && (
                        <div className="text-xs opacity-75">{subject.name}</div>
                      )}
                    </div>
                  );
                })}
                
                {dayActivities.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayActivities.length - 2} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SchedulePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  
  // Mock subjects data
  const subjects = [
    { id: '1', name: 'Matemáticas' },
    { id: '2', name: 'Física' },
    { id: '3', name: 'Literatura' },
    { id: '4', name: 'Química' },
    { id: '5', name: 'Historia' },
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
    
    // Validaciones adicionales
    if (!formData.start) {
      alert('Por favor selecciona una fecha');
      return;
    }
    
    if ((formData.type === 'exam' || formData.type === 'homework') && !formData.subjectId) {
      alert('Por favor selecciona una materia para exámenes y tareas');
      return;
    }
    
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
  
  const handleEventClick = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      type: activity.type,
      subjectId: activity.subjectId || '',
      start: activity.start,
      end: activity.end || '',
      description: activity.description || '',
      importance: activity.importance,
      attachments: [], // No podemos restaurar archivos
      reminder: activity.reminder || '',
    });
    setShowForm(true);
  };
  
  const handleDeleteActivity = () => {
    if (editingActivity && window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      setActivities(activities.filter(act => act.id !== editingActivity.id));
      setShowForm(false);
      setEditingActivity(null);
      setFormData(initialFormState);
    }
  };
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };
  
  const formatTime = (dateStr: string) => {
    if (!dateStr.includes('T')) return '';
    return dateStr.split('T')[1] || '';
  };
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Agenda de Actividades</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Agregar Actividad
        </button>
      </div>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingActivity ? 'Editar Actividad' : 'Agregar Nueva Actividad'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingActivity(null);
                  setFormData(initialFormState);
                }}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Actividad *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ingresa el nombre de la actividad"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Actividad
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Activity['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="exam">📝 Examen</option>
                  <option value="homework">📚 Tarea</option>
                  <option value="other">📅 Otro</option>
                </select>
              </div>
              
              {(formData.type === 'exam' || formData.type === 'homework') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Materia *
                  </label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecciona una materia</option>
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
                    Fecha *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="date"
                      required
                      value={formatDate(formData.start)}
                      onChange={(e) => {
                        const time = formatTime(formData.start);
                        setFormData({ ...formData, start: time ? `${e.target.value}T${time}` : e.target.value });
                      }}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora (Opcional)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="time"
                      value={formatTime(formData.start)}
                      onChange={(e) => {
                        const date = formatDate(formData.start);
                        setFormData({ ...formData, start: date ? `${date}T${e.target.value}` : `${new Date().toISOString().split('T')[0]}T${e.target.value}` });
                      }}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración (Opcional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.end ? parseInt(formData.end) : ''}
                  onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Duración en minutos"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recordatorio (Opcional)
                </label>
                <select
                  value={formData.reminder}
                  onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sin recordatorio</option>
                  <option value="5">5 minutos antes</option>
                  <option value="15">15 minutos antes</option>
                  <option value="30">30 minutos antes</option>
                  <option value="60">1 hora antes</option>
                  <option value="1440">1 día antes</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Describe la actividad (opcional)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nivel de Importancia
                </label>
                <div className="flex gap-4">
                  {[
                    { value: 'low', label: 'Baja', color: 'text-green-600' },
                    { value: 'medium', label: 'Media', color: 'text-yellow-600' },
                    { value: 'high', label: 'Alta', color: 'text-red-600' }
                  ].map((level) => (
                    <label key={level.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="importance"
                        value={level.value}
                        checked={formData.importance === level.value}
                        onChange={(e) => setFormData({ ...formData, importance: e.target.value as Activity['importance'] })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`font-medium ${level.color}`}>{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Archivos Adjuntos
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
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Paperclip size={16} />
                    <span>Agregar Archivos</span>
                  </label>
                  <span className="text-sm text-gray-500">
                    {formData.attachments.length} archivo(s) seleccionado(s)
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between gap-2 pt-4 border-t">
                <div>
                  {editingActivity && (
                    <button
                      type="button"
                      onClick={handleDeleteActivity}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(initialFormState)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Limpiar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingActivity(null);
                      setFormData(initialFormState);
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingActivity ? 'Actualizar' : 'Guardar'} Actividad
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium text-gray-800">Vista del Calendario</h3>
          <p className="text-sm text-gray-600 mt-1">
            Haz clic en cualquier actividad para editarla
          </p>
        </div>
        
        <div className="p-4">
          <SimpleActivityCalendar
            activities={activities}
            subjects={subjects}
            onEventClick={handleEventClick}
          />
        </div>
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay actividades programadas</h3>
          <p className="text-gray-600 mb-4">Comienza agregando tu primera actividad</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Agregar Primera Actividad
          </button>
        </div>
      )}
      
      {/* Resumen de actividades próximas */}
      {activities.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Próximas Actividades</h3>
          <div className="space-y-3">
            {activities
              .filter(activity => new Date(activity.start) >= new Date())
              .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
              .slice(0, 5)
              .map(activity => {
                const subject = subjects.find(s => s.id === activity.subjectId);
                const date = new Date(activity.start);
                const isUrgent = (date.getTime() - new Date().getTime()) < 24 * 60 * 60 * 1000;
                
                return (
                  <div key={activity.id} className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isUrgent ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="text-2xl">
                      {activity.type === 'exam' ? '📝' : 
                       activity.type === 'homework' ? '📚' : '📅'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        {isUrgent && <AlertCircle className="text-red-500" size={16} />}
                      </div>
                      <div className="text-sm text-gray-600">
                        {subject && <span>{subject.name} • </span>}
                        {date.toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        {activity.start.includes('T') && (
                          <span> a las {date.toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        )}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      activity.importance === 'high' ? 'bg-red-100 text-red-800' :
                      activity.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {activity.importance === 'high' ? 'Alta' :
                       activity.importance === 'medium' ? 'Media' : 'Baja'}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;