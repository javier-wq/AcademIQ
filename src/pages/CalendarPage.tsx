import React, { useState } from 'react';
import { Plus, X, Calendar } from 'lucide-react';

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

// Simulamos FullCalendar con una vista simple
const SimpleCalendarView: React.FC<{
  schedules: ClassSchedule[];
  subjects: any[];
  teachers: any[];
  onEventClick: (schedule: ClassSchedule) => void;
}> = ({ schedules, subjects, teachers, onEventClick }) => {
  const timeSlots = [];
  for (let hour = 7; hour <= 21; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  const getScheduleForTimeAndDay = (time: string, dayOfWeek: number) => {
    return schedules.find(schedule => {
      const startHour = parseInt(schedule.startTime.split(':')[0]);
      const currentHour = parseInt(time.split(':')[0]);
      const endHour = parseInt(schedule.endTime.split(':')[0]);
      
      return schedule.daysOfWeek.includes(dayOfWeek) && 
             currentHour >= startHour && 
             currentHour < endHour;
    });
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="grid grid-cols-8 bg-gray-50">
        <div className="p-3 font-medium text-gray-700 border-r">Hora</div>
        {weekDays.map((day, index) => (
          <div key={index} className="p-3 font-medium text-gray-700 text-center border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      
      {timeSlots.map((time, timeIndex) => (
        <div key={time} className="grid grid-cols-8 border-t">
          <div className="p-3 text-sm text-gray-600 border-r bg-gray-50">
            {time}
          </div>
          {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => {
            const schedule = getScheduleForTimeAndDay(time, dayOfWeek);
            if (schedule) {
              const subject = subjects.find(s => s.id === schedule.subjectId);
              const teacher = teachers.find(t => t.id === schedule.teacherId);
              
              return (
                <div 
                  key={dayOfWeek} 
                  className={`p-2 border-r last:border-r-0 cursor-pointer hover:opacity-80 ${
                    schedule.type === 'theory' ? 'bg-blue-100 border-blue-300' : 'bg-purple-100 border-purple-300'
                  }`}
                  onClick={() => onEventClick(schedule)}
                >
                  <div className="text-xs font-medium text-gray-800">
                    {subject?.name || 'Materia Desconocida'}
                  </div>
                  <div className="text-xs text-gray-600">{schedule.classroom}</div>
                  <div className="text-xs text-gray-600">{teacher?.name || 'Profesor Desconocido'}</div>
                  <div className="text-xs text-gray-500">
                    {schedule.startTime}-{schedule.endTime}
                  </div>
                </div>
              );
            }
            
            return (
              <div key={dayOfWeek} className="p-3 border-r last:border-r-0 min-h-[60px]">
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const CalendarPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null);
  
  // Mock data
  const subjects = [
    { id: '1', name: 'Matemáticas' },
    { id: '2', name: 'Física' },
    { id: '3', name: 'Literatura' },
    { id: '4', name: 'Química' },
    { id: '5', name: 'Historia' },
  ];
  
  const teachers = [
    { id: '1', name: 'Prof. Castro' },
    { id: '2', name: 'Prof. Johnson' },
    { id: '3', name: 'Prof. Brown' },
    { id: '4', name: 'Prof. García' },
    { id: '5', name: 'Prof. López' },
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
    
    // Validación adicional
    if (formData.daysOfWeek.length === 0) {
      alert('Por favor selecciona al menos un día de la semana');
      return;
    }
    
    if (formData.startTime >= formData.endTime) {
      alert('La hora de inicio debe ser menor que la hora de fin');
      return;
    }
    
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
  
  const handleEventClick = (schedule: ClassSchedule) => {
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
  };
  
  const handleDeleteSchedule = () => {
    if (editingSchedule && window.confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      setSchedules(schedules.filter(sch => sch.id !== editingSchedule.id));
      setShowForm(false);
      setEditingSchedule(null);
      setFormData(initialFormState);
    }
  };
  
  const weekdays = [
    { id: 0, name: 'Domingo' },
    { id: 1, name: 'Lunes' },
    { id: 2, name: 'Martes' },
    { id: 3, name: 'Miércoles' },
    { id: 4, name: 'Jueves' },
    { id: 5, name: 'Viernes' },
    { id: 6, name: 'Sábado' },
  ];
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Horario de Clases</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Agregar Horario
        </button>
      </div>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingSchedule ? 'Editar Horario de Clase' : 'Agregar Nuevo Horario'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingSchedule(null);
                  setFormData(initialFormState);
                }}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Materia *
                </label>
                <select
                  required
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profesor *
                </label>
                <select
                  required
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona un profesor</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aula *
                </label>
                <input
                  type="text"
                  required
                  value={formData.classroom}
                  onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ingresa el aula (ej: A22, Lab01)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Días de Clase *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {weekdays.map((day) => (
                    <label key={day.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.daysOfWeek.includes(day.id)}
                        onChange={(e) => {
                          const newDays = e.target.checked
                            ? [...formData.daysOfWeek, day.id]
                            : formData.daysOfWeek.filter(d => d !== day.id);
                          setFormData({ ...formData, daysOfWeek: newDays });
                        }}
                        className="text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <span className="text-sm">{day.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora de Inicio *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora de Fin *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Fin *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Clase
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="theory"
                      checked={formData.type === 'theory'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as ClassSchedule['type'] })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Teoría</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="laboratory"
                      checked={formData.type === 'laboratory'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as ClassSchedule['type'] })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Laboratorio</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-between gap-2 pt-4 border-t">
                <div>
                  {editingSchedule && (
                    <button
                      type="button"
                      onClick={handleDeleteSchedule}
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
                      setEditingSchedule(null);
                      setFormData(initialFormState);
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingSchedule ? 'Actualizar' : 'Guardar'} Horario
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium text-gray-800">Vista Semanal</h3>
          <p className="text-sm text-gray-600 mt-1">
            Haz clic en cualquier clase para editarla
          </p>
        </div>
        
        <div className="p-4">
          <SimpleCalendarView
            schedules={schedules}
            subjects={subjects}
            teachers={teachers}
            onEventClick={handleEventClick}
          />
        </div>
      </div>
      
      {schedules.length === 0 && (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay horarios programados</h3>
          <p className="text-gray-600 mb-4">Comienza agregando tu primer horario de clase</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Agregar Primer Horario
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;