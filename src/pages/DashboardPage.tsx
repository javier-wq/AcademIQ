import React from 'react';
import { 
  BarChart3, 
  Clock, 
  CalendarCheck, 
  BookOpen, 
  ListTodo, 
  Timer 
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  // Mock data for the dashboard
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const upcomingTasks = [
    { id: '1', title: 'Submit Physics Assignment', due: '2 days left', subject: 'Physics', percentage: 15 },
    { id: '2', title: 'Calculus Test', due: 'Tomorrow', subject: 'Mathematics', percentage: 25 },
    { id: '3', title: 'Research Paper Draft', due: '5 days left', subject: 'Literature', percentage: 30 },
  ];
  
  const weeklyStudyHours = [
    { day: 'Mon', hours: 3 },
    { day: 'Tue', hours: 5 },
    { day: 'Wed', hours: 2.5 },
    { day: 'Thu', hours: 4 },
    { day: 'Fri', hours: 3.5 },
    { day: 'Sat', hours: 1 },
    { day: 'Sun', hours: 0.5 },
  ];
  
  const todayClasses = [
    { id: '1', subject: 'Physics', time: '10:00 AM - 11:30 AM', room: 'Room 203' },
    { id: '2', subject: 'Mathematics', time: '1:00 PM - 2:30 PM', room: 'Room 105' },
    { id: '3', subject: 'Literature', time: '3:00 PM - 4:30 PM', room: 'Room 302' },
  ];
  
  const totalStudyHours = weeklyStudyHours.reduce((sum, day) => sum + day.hours, 0);
  const completedTasks = 12;
  const pendingTasks = 8;

  // Maximum height for the bar chart
  const maxBarHeight = 100;
  const maxHours = Math.max(...weeklyStudyHours.map(day => day.hours));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={18} />
          <span className="font-semibold">{currentTime}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Timer size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Total Study Time</h2>
              <p className="text-2xl font-bold text-gray-800">{totalStudyHours} hours</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <CalendarCheck size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Completed Tasks</h2>
              <p className="text-2xl font-bold text-gray-800">{completedTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <ListTodo size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Pending Tasks</h2>
              <p className="text-2xl font-bold text-gray-800">{pendingTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Study Chart and Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 size={18} />
              Weekly Study Hours
            </h2>
          </div>
          
          <div className="flex items-end justify-between h-[200px]">
            {weeklyStudyHours.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-2 w-full">
                <div 
                  className="w-full max-w-[40px] bg-blue-500 rounded-t-sm transition-all duration-500 ease-in-out hover:bg-blue-600"
                  style={{ 
                    height: `${(day.hours / maxHours) * maxBarHeight}%`,
                    minHeight: day.hours > 0 ? '10px' : '0'
                  }}
                ></div>
                <div className="text-xs font-medium text-gray-600">{day.day}</div>
                <div className="text-xs text-gray-500">{day.hours}h</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <ListTodo size={18} />
              Upcoming Tasks
            </h2>
            <a href="/tasks" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All
            </a>
          </div>
          
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium text-gray-800">{task.title}</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {task.percentage}%
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{task.subject}</span>
                  <span className="text-amber-600 font-medium">{task.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Classes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BookOpen size={18} />
            Today's Classes
          </h2>
          <a href="/schedule" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View Schedule
          </a>
        </div>
        
        <div className="space-y-4">
          {todayClasses.map((cls) => (
            <div key={cls.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-3 h-14 bg-blue-500 rounded-full mr-4"></div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{cls.subject}</h3>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>{cls.time}</span>
                  <span>{cls.room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;