import React, { useState } from 'react';
import { FaCalendarAlt, FaPlus, FaChevronLeft, FaChevronRight, FaClock, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const events = [
    { id: 1, title: 'Réunion équipe', date: 15, time: '10:00', type: 'meeting', participants: 5 },
    { id: 2, title: 'Deadline projet', date: 20, time: '18:00', type: 'deadline', participants: 3 },
    { id: 3, title: 'Formation React', date: 8, time: '14:00', type: 'training', participants: 8 },
    { id: 4, title: 'Review Q1', date: 25, time: '15:00', type: 'review', participants: 12 },
  ];

  const getEventForDate = (day: number) => {
    return events.find(event => event.date === day);
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendrier</h1>
            <p className="text-gray-600">Gérez vos événements et échéances</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-1">
              {['month', 'week', 'day'].map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    view === viewType 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {viewType === 'month' ? 'Mois' : viewType === 'week' ? 'Semaine' : 'Jour'}
                </button>
              ))}
            </div>
            <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2">
              <FaPlus className="text-sm" />
              Nouvel Événement
            </button>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigateMonth(-1)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <FaChevronLeft />
          </button>
          <h2 className="text-xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button 
            onClick={() => navigateMonth(1)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-6 shadow-lg">
            {/* Week days */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDay }).map((_, index) => (
                <div key={`empty-${index}`} className="h-24"></div>
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const event = getEventForDate(day);
                const isToday = day === new Date().getDate() && 
                               currentDate.getMonth() === new Date().getMonth() &&
                               currentDate.getFullYear() === new Date().getFullYear();
                const isSelected = day === selectedDate.getDate();

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={`h-24 p-2 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                      isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                    } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {day}
                    </div>
                    {event && (
                      <div className={`text-xs p-1 rounded truncate ${
                        event.type === 'meeting' ? 'bg-blue-100 text-blue-700' :
                        event.type === 'deadline' ? 'bg-red-100 text-red-700' :
                        event.type === 'training' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {event.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Info */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="text-blue-600 text-sm" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {selectedDate.getDate()} {monthNames[selectedDate.getMonth()].toLowerCase()}
              </h3>
            </div>
            
            <div className="space-y-3">
              {getEventForDate(selectedDate.getDate()) ? (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <FaClock className="text-gray-400 text-xs" />
                    <span className="text-sm text-gray-600">
                      {getEventForDate(selectedDate.getDate())?.time}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {getEventForDate(selectedDate.getDate())?.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-gray-400 text-xs" />
                    <span className="text-xs text-gray-500">
                      {getEventForDate(selectedDate.getDate())?.participants} participants
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucun événement prévu</p>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Événements à Venir</h3>
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      event.type === 'meeting' ? 'bg-blue-500' :
                      event.type === 'deadline' ? 'bg-red-500' :
                      event.type === 'training' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">{event.date} {monthNames[currentDate.getMonth()].toLowerCase()}</span>
                        <span className="text-xs text-gray-500">{event.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Légende</h3>
            <div className="space-y-2">
              {[
                { type: 'meeting', label: 'Réunion', color: 'blue' },
                { type: 'deadline', label: 'Deadline', color: 'red' },
                { type: 'training', label: 'Formation', color: 'green' },
                { type: 'review', label: 'Review', color: 'purple' },
              ].map((item) => (
                <div key={item.type} className="flex items-center gap-3">
                  <div className={`w-3 h-3 bg-${item.color}-500 rounded-full`}></div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
