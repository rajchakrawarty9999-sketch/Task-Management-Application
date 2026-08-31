import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Bell, 
  Users, 
  Sparkles, 
  Search, 
  Filter, 
  X, 
  Tag, 
  GripVertical,
  CalendarDays,
  ListOrdered,
  CalendarRange,
  Flame,
  Check,
  Trash2,
  Bookmark,
  CalendarCheck,
  ChevronDown,
  Layers
} from 'lucide-react';

export const CalendarView = () => {
  const { tasks, openEditModal, openCreateModal, updateStatus, addToast } = useTasks();
  const { user, teamMembers } = useAuth();

  // State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 8)); // September 2026 default
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 8, 8));
  const [activeCalendarView, setActiveCalendarView] = useState('month'); // 'month' | 'week' | 'day' | 'agenda'
  const [eventTypeFilter, setEventTypeFilter] = useState('all'); // 'all' | 'tasks' | 'reminders' | 'meetings' | 'holidays'
  const [calendarSearch, setCalendarSearch] = useState('');
  
  const [holidays, setHolidays] = useState([]);
  const [customEvents, setCustomEvents] = useState([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const [newEventForm, setNewEventForm] = useState({
    title: '',
    type: 'meeting',
    date: '',
    start_time: '10:00 AM',
    end_time: '11:00 AM',
    priority: 'medium',
    location: 'Google Meet'
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Fetch holidays & custom events from API
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const [holidaysRes, eventsRes] = await Promise.all([
          api.getHolidays(year),
          api.getCalendarEvents()
        ]);
        if (holidaysRes && holidaysRes.holidays) {
          setHolidays(holidaysRes.holidays);
        }
        if (eventsRes && eventsRes.events) {
          setCustomEvents(eventsRes.events);
        }
      } catch (err) {
        console.error('Failed to load calendar data:', err);
      }
    };
    fetchCalendarData();
  }, [year]);

  // Date Navigation Handlers
  const prevDate = () => {
    if (activeCalendarView === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (activeCalendarView === 'week') {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setCurrentDate(prevWeek);
      setSelectedDate(prevWeek);
    } else {
      const prevDay = new Date(selectedDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setCurrentDate(prevDay);
      setSelectedDate(prevDay);
    }
  };

  const nextDate = () => {
    if (activeCalendarView === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (activeCalendarView === 'week') {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setCurrentDate(nextWeek);
      setSelectedDate(nextWeek);
    } else {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCurrentDate(nextDay);
      setSelectedDate(nextDay);
    }
  };

  const goToToday = () => {
    const now = new Date(2026, 8, 8);
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fullDaysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const shortDaysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const microDaysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Helper format YYYY-MM-DD
  const formatDateStr = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Build 35 or 42-day Month Calendar Grid (Monday-based grid)
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfWeek = (y, m) => {
    const day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1; // 0 = Mon, 6 = Sun
  };

  const daysInCurrentMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  const calendarCells = [];

  // Previous Month Overflow Days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const dateObj = new Date(year, month - 1, dayNum);
    calendarCells.push({
      date: dateObj,
      dateStr: formatDateStr(dateObj),
      dayNum,
      isCurrentMonth: false,
      isWeekend: dateObj.getDay() === 0 || dateObj.getDay() === 6
    });
  }

  // Current Month Days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dateObj = new Date(year, month, d);
    calendarCells.push({
      date: dateObj,
      dateStr: formatDateStr(dateObj),
      dayNum: d,
      isCurrentMonth: true,
      isWeekend: dateObj.getDay() === 0 || dateObj.getDay() === 6
    });
  }

  // Next Month Overflow Days
  const targetTotal = calendarCells.length > 35 ? 42 : 35;
  const remainingCells = targetTotal - calendarCells.length;
  for (let n = 1; n <= remainingCells; n++) {
    const dateObj = new Date(year, month + 1, n);
    calendarCells.push({
      date: dateObj,
      dateStr: formatDateStr(dateObj),
      dayNum: n,
      isCurrentMonth: false,
      isWeekend: dateObj.getDay() === 0 || dateObj.getDay() === 6
    });
  }

  // Get tasks, events, and holidays for a given dateStr
  const getItemsForDate = (dateStr) => {
    const dateTasks = tasks.filter(t => {
      if (!t.due_date) return false;
      const matchesDate = t.due_date.startsWith(dateStr);
      if (!matchesDate) return false;
      if (calendarSearch) {
        return t.title.toLowerCase().includes(calendarSearch.toLowerCase()) || 
               t.category?.toLowerCase().includes(calendarSearch.toLowerCase());
      }
      return true;
    });

    const dateEvents = customEvents.filter(e => {
      const matchesDate = e.date === dateStr;
      if (!matchesDate) return false;
      if (calendarSearch) {
        return e.title.toLowerCase().includes(calendarSearch.toLowerCase());
      }
      return true;
    });

    const dateHolidays = holidays.filter(h => h.date === dateStr);

    return {
      tasks: eventTypeFilter === 'all' || eventTypeFilter === 'tasks' ? dateTasks : [],
      events: eventTypeFilter === 'all' || eventTypeFilter === 'reminders' || eventTypeFilter === 'meetings' ? dateEvents : [],
      holidays: eventTypeFilter === 'all' || eventTypeFilter === 'holidays' ? dateHolidays : [],
      allCount: dateTasks.length + dateEvents.length + dateHolidays.length,
      rawTasks: dateTasks,
      rawEvents: dateEvents,
      rawHolidays: dateHolidays
    };
  };

  // Drag and drop task rescheduling handler
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnDate = async (e, targetDateStr) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;

    try {
      await api.updateTaskDueDate(taskId, targetDateStr);
      addToast(`Task moved to ${new Date(targetDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to reschedule task', 'error');
    } finally {
      setDraggedTaskId(null);
    }
  };

  // Add custom reminder / meeting
  const handleCreateCustomEvent = async (e) => {
    e.preventDefault();
    if (!newEventForm.title.trim()) return;

    try {
      const res = await api.createCalendarEvent({
        ...newEventForm,
        date: newEventForm.date || formatDateStr(selectedDate)
      });
      if (res && res.event) {
        setCustomEvents(prev => [res.event, ...prev]);
        addToast(`Scheduled ${newEventForm.type}: ${newEventForm.title}`, 'success');
        setIsAddEventModalOpen(false);
        setNewEventForm({
          title: '',
          type: 'meeting',
          date: '',
          start_time: '10:00 AM',
          end_time: '11:00 AM',
          priority: 'medium',
          location: 'Google Meet'
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectedDateStr = formatDateStr(selectedDate);
  const selectedItems = getItemsForDate(selectedDateStr);
  const isTodayDate = (dStr) => dStr === '2026-09-08' || dStr === formatDateStr(new Date());

  return (
    <div className="space-y-4 animate-fade-in w-full min-w-0 max-w-full">
      {/* ============================================================ */}
      {/* 1. OBSIDIAN SHELL TOOLBAR WITH GOLD ACCENTS                 */}
      {/* ============================================================ */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#0e0e10] border border-[#d4af5a]/25 shadow-card-dark space-y-3 min-w-0 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 min-w-0">
          {/* Left: Branding, Month Name & Navigation Arrows */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#17171a] border border-[#d4af5a]/40 flex items-center justify-center text-[#d4af5a] shadow-sm flex-shrink-0">
              <CalendarIcon className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight truncate">
                {monthNames[month]} {year}
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#d4af5a]/15 text-[#e7c873] border border-[#d4af5a]/40 hidden sm:inline-block">
                Warm Ivory Suite
              </span>
            </div>

            {/* Date Navigation */}
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={prevDate}
                className="h-8 w-8 rounded-xl btn-dark-gold flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Previous"
                aria-label="Previous"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#d4af5a]" />
              </button>
              <button
                onClick={goToToday}
                className="h-8 px-2.5 rounded-xl btn-dark-gold text-[11px] font-mono font-bold text-[#e7c873] flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#d4af5a]" />
                <span>Today</span>
              </button>
              <button
                onClick={nextDate}
                className="h-8 w-8 rounded-xl btn-dark-gold flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Next"
                aria-label="Next"
              >
                <ChevronRight className="w-3.5 h-3.5 text-[#d4af5a]" />
              </button>
            </div>
          </div>

          {/* Right: View Switcher, Filter & Actions */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end flex-wrap min-w-0">
            {/* View Switcher Tabs */}
            <div className="flex items-center p-0.5 rounded-xl bg-[#141418] border border-white/[0.08] text-xs flex-shrink-0">
              {['month', 'week', 'day', 'agenda'].map((viewMode) => (
                <button
                  key={viewMode}
                  onClick={() => setActiveCalendarView(viewMode)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    activeCalendarView === viewMode
                      ? 'bg-[#d4af5a] text-[#171717] shadow-sm font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {viewMode}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => {
                  setNewEventForm(prev => ({ ...prev, date: formatDateStr(selectedDate) }));
                  setIsAddEventModalOpen(true);
                }}
                className="h-8 px-2.5 rounded-xl btn-dark-gold text-xs font-semibold flex items-center gap-1.5"
                title="Schedule meeting or reminder"
              >
                <Bell className="w-3.5 h-3.5 text-[#d4af5a]" />
                <span className="hidden lg:inline">Schedule</span>
              </button>
              <button
                onClick={() => openCreateModal('backlog')}
                className="h-8 px-3 rounded-xl btn-gold text-xs font-bold flex items-center gap-1 shadow-gold-sm"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Search Row */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 min-w-0">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[10px] text-[#706a5d] font-mono mr-1 font-bold">FILTER:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'tasks', label: 'Tasks' },
              { id: 'reminders', label: 'Reminders' },
              { id: 'meetings', label: 'Meetings' },
              { id: 'holidays', label: 'Festivals' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setEventTypeFilter(tab.id)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-colors ${
                  eventTypeFilter === tab.id
                    ? 'bg-[#d4af5a]/20 text-[#e7c873] border border-[#d4af5a]/40 font-bold'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-52 lg:w-60 min-w-0">
            <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search in calendar..."
              value={calendarSearch}
              onChange={(e) => setCalendarSearch(e.target.value)}
              className="w-full h-7.5 bg-[#141418] border border-white/[0.08] focus:border-[#d4af5a]/60 rounded-xl pl-7 pr-6 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
            {calendarSearch && (
              <button
                onClick={() => setCalendarSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. WARM IVORY CALENDAR GRID + SELECTED DATE PANEL            */}
      {/* ============================================================ */}
      <div className="flex flex-col 2xl:flex-row items-start gap-4 min-w-0 w-full">
        {/* Main Grid Area (100% fluid) */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {/* ============================================================ */}
          {/* MONTH VIEW: WARM IVORY & CHAMPAGNE CELLS (#F5F1E8)          */}
          {/* ============================================================ */}
          {activeCalendarView === 'month' && (
            <div className="rounded-2xl border border-[#d4af5a]/20 bg-[#0e0e10] p-2.5 sm:p-3.5 shadow-2xl overflow-hidden min-w-0 w-full">
              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1.5 text-center min-w-0">
                {fullDaysOfWeek.map((day, idx) => (
                  <div
                    key={day}
                    className={`py-1 text-[10px] sm:text-xs font-mono font-extrabold tracking-wider truncate ${
                      idx >= 5 ? 'text-[#d4af5a]' : 'text-[#8c8273]'
                    }`}
                  >
                    <span className="hidden lg:inline">{day}</span>
                    <span className="hidden sm:inline lg:hidden">{shortDaysOfWeek[idx]}</span>
                    <span className="sm:hidden">{microDaysOfWeek[idx]}</span>
                  </div>
                ))}
              </div>

              {/* WARM IVORY DATE CELLS GRID (#F5F1E8) */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5 min-w-0 w-full">
                {calendarCells.map((cell, index) => {
                  const { tasks: dayTasks, events: dayEvents, holidays: dayHolidays, allCount } = getItemsForDate(cell.dateStr);
                  const isSelected = formatDateStr(selectedDate) === cell.dateStr;
                  const isToday = isTodayDate(cell.dateStr);

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedDate(cell.date);
                        if (!cell.isCurrentMonth) {
                          setCurrentDate(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
                        }
                      }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnDate(e, cell.dateStr)}
                      className={`min-h-[70px] sm:min-h-[95px] md:min-h-[110px] lg:min-h-[120px] xl:min-h-[125px] rounded-xl p-1 sm:p-1.5 md:p-2 flex flex-col justify-between transition-all duration-150 cursor-pointer relative group min-w-0 overflow-hidden ${
                        // WARM IVORY LUXURY PAPYRUS PALETTE (#F5F1E8 / #EEE7D8):
                        cell.isCurrentMonth
                          ? cell.isWeekend
                            ? 'bg-[#ede7da] text-[#171717] border border-[#d8cdb8] shadow-2xs hover:bg-[#eee7d8] hover:border-[#d4af5a]'
                            : 'bg-[#f5f1e8] text-[#171717] border border-[#d8cdb8] shadow-2xs hover:bg-[#eee7d8] hover:border-[#d4af5a]'
                          : 'bg-[#ddd6c7] text-[#6b665c] border border-[#cfc4ad]/60 opacity-60'
                      } ${
                        isSelected
                          ? 'ring-2 ring-[#d4af5a] border-[#d4af5a] bg-[#e8d4a0] shadow-md z-10'
                          : ''
                      }`}
                    >
                      {/* Top Bar: Date Number + Today Badge (#D4AF5A) */}
                      <div className="flex items-center justify-between gap-1 mb-0.5 min-w-0">
                        <div className="flex items-center gap-1 min-w-0">
                          <span
                            className={`text-xs sm:text-sm font-extrabold font-mono inline-flex items-center justify-center leading-none ${
                              isToday
                                ? 'bg-[#d4af5a] text-[#171717] px-1.5 py-0.5 rounded font-extrabold shadow-sm ring-1 ring-[#e7c873]'
                                : cell.isCurrentMonth
                                ? 'text-[#171717] font-extrabold'
                                : 'text-[#6b665c]'
                            }`}
                          >
                            {cell.dayNum}
                          </span>
                          {isToday && (
                            <span className="hidden xl:inline text-[8px] font-mono font-bold text-[#453205] bg-[#d4af5a]/40 px-1 py-0.2 rounded border border-[#d4af5a] uppercase">
                              TODAY
                            </span>
                          )}
                        </div>

                        {/* Hover Quick Add Task Trigger */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDate(cell.date);
                            openCreateModal('backlog');
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[#6b665c] hover:text-[#171717] hover:bg-[#d8cdb8]/60 transition-opacity hidden sm:block"
                          title={`Add task on ${cell.dateStr}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Middle: Harmonized Softer Event Chips */}
                      <div className="hidden sm:flex flex-col gap-0.5 overflow-hidden flex-1 min-w-0">
                        {/* 1. Indian Festivals / Holidays (Warm Champagne Gold) */}
                        {dayHolidays.map((h, hIdx) => (
                          <div
                            key={`h-${hIdx}`}
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#ebdcb4] text-[#453205] border border-[#d4af5a]/60 truncate flex items-center gap-1 min-w-0 shadow-2xs"
                            title={`${h.icon} ${h.name} (${h.national ? 'National Holiday' : 'Festival'})`}
                          >
                            <span className="text-[10px] flex-shrink-0">{h.icon || '🪔'}</span>
                            <span className="truncate">{h.name}</span>
                          </div>
                        ))}

                        {/* 2. Custom Meetings & Reminders (Warm Ivory Tinted Chips) */}
                        {dayEvents.map((evt) => (
                          <div
                            key={evt.id}
                            className={`text-[9px] font-medium px-1.5 py-0.5 rounded truncate flex items-center justify-between gap-1 min-w-0 shadow-2xs ${
                              evt.type === 'meeting'
                                ? 'bg-[#dfe6ed] text-[#142634] border border-[#bccad6]'
                                : evt.type === 'deadline'
                                ? 'bg-[#eed7d7] text-[#421515] border border-[#d8b0b0]'
                                : 'bg-[#e7e0eb] text-[#2e1d3d] border border-[#cbbed4]'
                            }`}
                            title={`${evt.start_time}: ${evt.title} (${evt.location})`}
                          >
                            <div className="flex items-center gap-1 truncate min-w-0">
                              {evt.type === 'meeting' ? (
                                <Users className="w-2.5 h-2.5 text-[#2d5f8b] flex-shrink-0" />
                              ) : evt.type === 'deadline' ? (
                                <AlertCircle className="w-2.5 h-2.5 text-[#9e2c2c] flex-shrink-0" />
                              ) : (
                                <Bell className="w-2.5 h-2.5 text-[#6c4885] flex-shrink-0" />
                              )}
                              <span className="truncate">{evt.title}</span>
                            </div>
                          </div>
                        ))}

                        {/* 3. Assigned Tasks with Soft Executive Ivory Chips */}
                        {dayTasks.slice(0, 2).map((task) => {
                          const isDone = task.status === 'completed';
                          return (
                            <div
                              key={task.id}
                              draggable
                              onDragStart={(e) => {
                                e.stopPropagation();
                                e.dataTransfer.setData('text/plain', task.id);
                                setDraggedTaskId(task.id);
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(task);
                              }}
                              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded cursor-grab active:cursor-grabbing truncate flex items-center justify-between gap-1 min-w-0 transition-all shadow-2xs ${
                                isDone
                                  ? 'bg-[#d8e6db] text-[#183921] border border-[#b2cfb7] line-through opacity-75'
                                  : task.priority === 'urgent'
                                  ? 'bg-[#eed7d7] text-[#421515] border border-[#d8b0b0]'
                                  : task.status === 'in_progress'
                                  ? 'bg-[#dfe6ed] text-[#142634] border border-[#bccad6]'
                                  : task.status === 'in_review'
                                  ? 'bg-[#ebe1cc] text-[#453205] border border-[#d4af5a]/50'
                                  : 'bg-[#e8e2d5] text-[#24211d] border border-[#d3c9b7]'
                              }`}
                              title={task.title}
                            >
                              <div className="flex items-center gap-1 truncate min-w-0">
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  isDone 
                                    ? 'bg-[#2b723c]' 
                                    : task.priority === 'urgent' 
                                    ? 'bg-[#ab2f2f] animate-pulse' 
                                    : task.status === 'in_progress'
                                    ? 'bg-[#2d5f8b]'
                                    : task.status === 'in_review'
                                    ? 'bg-[#d4af5a]'
                                    : 'bg-[#6b665c]'
                                }`} />
                                <span className="truncate">{task.title}</span>
                              </div>
                            </div>
                          );
                        })}

                        {/* Overflow counter */}
                        {dayTasks.length > 2 && (
                          <div className="text-[8px] font-bold font-mono text-[#6b665c] text-right pr-0.5">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>

                      {/* Mobile compact dot indicators */}
                      <div className="sm:hidden flex flex-wrap items-center gap-1 mt-0.5 justify-center">
                        {dayHolidays.length > 0 && (
                          <span className="text-[9px]" title={dayHolidays[0].name}>
                            {dayHolidays[0].icon || '🪔'}
                          </span>
                        )}
                        {dayTasks.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${
                              t.status === 'completed'
                                ? 'bg-emerald-600'
                                : t.priority === 'urgent'
                                ? 'bg-rose-600'
                                : 'bg-[#d4af5a]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* WEEK VIEW: Interactive 7-Day Time Slots Grid                 */}
          {/* ============================================================ */}
          {activeCalendarView === 'week' && (
            <div className="rounded-2xl border border-[#d4af5a]/20 bg-[#0e0e10] p-3 sm:p-4 shadow-2xl overflow-x-auto min-w-0 w-full">
              <div className="min-w-[650px] space-y-2">
                <div className="grid grid-cols-8 gap-1.5 pb-2 border-b border-white/[0.06] text-center font-mono text-xs">
                  <div className="font-bold text-[#d4af5a]">TIME</div>
                  {shortDaysOfWeek.map((d) => (
                    <div key={d} className="font-bold text-white uppercase">
                      {d}
                    </div>
                  ))}
                </div>

                {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'].map((slot, sIdx) => (
                  <div key={slot} className="grid grid-cols-8 gap-1.5 min-h-[55px] items-start border-b border-white/[0.03]">
                    <div className="text-[10px] font-mono text-slate-400 pt-1">{slot}</div>
                    {Array.from({ length: 7 }).map((_, dIdx) => (
                      <div
                        key={dIdx}
                        className="bg-[#f5f1e8] rounded-lg p-1 min-h-[48px] border border-[#d8cdb8] text-[#171717] text-[9px] shadow-2xs hover:border-[#d4af5a] transition-all"
                      >
                        {sIdx === 1 && dIdx === 1 && (
                          <div className="p-1 rounded bg-[#dfe6ed] text-[#142634] font-bold border border-[#bccad6] flex items-center gap-1">
                            <Users className="w-2.5 h-2.5 text-[#2d5f8b] flex-shrink-0" />
                            <span className="truncate">Sprint Planning</span>
                          </div>
                        )}
                        {sIdx === 3 && dIdx === 3 && (
                          <div className="p-1 rounded bg-[#ebdcb4] text-[#453205] font-bold border border-[#d4af5a]/60 flex items-center gap-1">
                            <Bell className="w-2.5 h-2.5 text-[#a87f22] flex-shrink-0" />
                            <span className="truncate">Architecture Sync</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* DAY VIEW: Single Day Timeline Stream                         */}
          {/* ============================================================ */}
          {activeCalendarView === 'day' && (
            <div className="rounded-2xl border border-[#d4af5a]/20 bg-[#0e0e10] p-4 sm:p-5 shadow-2xl space-y-3 min-w-0 w-full">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div>
                  <h3 className="text-base font-bold text-white font-mono">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Focused Daily Timeline Schedule</p>
                </div>
                <button
                  onClick={() => openCreateModal('backlog')}
                  className="h-8 px-3 rounded-xl btn-gold text-xs font-bold flex items-center gap-1.5 shadow-gold-sm"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Task
                </button>
              </div>

              <div className="space-y-2">
                {['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'].map((time, idx) => (
                  <div key={time} className="flex items-start gap-3 p-2.5 rounded-xl bg-[#141418] border border-white/[0.05]">
                    <span className="text-xs font-mono font-bold text-[#d4af5a] w-18 flex-shrink-0 pt-0.5">{time}</span>
                    <div className="flex-1 bg-[#f5f1e8] p-2.5 rounded-xl border border-[#d8cdb8] text-[#171717] shadow-sm flex items-center justify-between min-w-0">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-[#171717] truncate">
                          {idx === 0 ? 'Daily Standup & Sprint Sync' : idx === 2 ? 'Architecture Review' : 'Deliverable Focus Block'}
                        </p>
                        <p className="text-[10px] text-[#6b665c] font-mono truncate">Scheduled workspace focus slot</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#ebdcb4] text-[#453205] text-[10px] font-bold border border-[#d4af5a]/60 flex-shrink-0">
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* AGENDA VIEW: Chronological Upcoming Feed                     */}
          {/* ============================================================ */}
          {activeCalendarView === 'agenda' && (
            <div className="rounded-2xl border border-[#d4af5a]/20 bg-[#0e0e10] p-4 sm:p-5 shadow-2xl space-y-3 min-w-0 w-full">
              <div className="pb-3 border-b border-white/[0.06]">
                <h3 className="text-base font-bold text-white">Upcoming Sprint Deliverables & Milestones</h3>
                <p className="text-xs text-slate-400 font-mono">Chronological sequence of all deliverables and team meetings</p>
              </div>

              <div className="space-y-2">
                {tasks.slice(0, 10).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => openEditModal(task)}
                    className="p-3 rounded-xl bg-[#f5f1e8] text-[#171717] border border-[#d8cdb8] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer hover:border-[#d4af5a] hover:shadow-sm transition-all min-w-0"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#ebdcb4] border border-[#d4af5a]/60 flex items-center justify-center text-[#453205] flex-shrink-0">
                        <CalendarIcon className="w-3.5 h-3.5 text-[#d4af5a]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] font-mono uppercase font-bold text-[#6b665c] bg-[#e8e2d5] px-1.5 py-0.2 rounded border border-[#d8cdb8]">
                            {task.category || 'BACKEND'}
                          </span>
                          <span className={`text-[9px] font-mono font-bold ${
                            task.priority === 'urgent' ? 'text-[#9e2c2c]' : 'text-[#825c0e]'
                          }`}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#171717] truncate">{task.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center text-xs font-mono text-[#6b665c] flex-shrink-0">
                      <span>{task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Sep 8'}</span>
                      {task.assignee && (
                        <img src={task.assignee.avatar} alt="User" className="w-5 h-5 rounded-full border border-[#d8cdb8] object-cover" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 3. SELECTED DATE DETAIL PANEL (Warm Ivory & Champagne Cards) */}
        {/* ============================================================ */}
        <div className="w-full 2xl:w-80 space-y-4 flex-shrink-0 min-w-0">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0e0e10] border border-[#d4af5a]/25 shadow-card-dark space-y-3.5 min-w-0">
            {/* Header: Selected Date Title */}
            <div className="pb-2.5 border-b border-white/[0.06] flex items-center justify-between min-w-0">
              <div className="min-w-0">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#d4af5a]">
                  SELECTED DATE OVERVIEW
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5 truncate">
                  {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </h3>
                <p className="text-[11px] text-[#8c8273] font-mono">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
              </div>
            </div>

            {/* 4 Summary Badges */}
            <div className="grid grid-cols-4 sm:grid-cols-4 2xl:grid-cols-2 gap-1.5">
              <div className="p-2 rounded-xl bg-[#17171a] border border-white/[0.05] text-center">
                <span className="text-[9px] font-mono text-[#8c8273] font-bold uppercase">Tasks</span>
                <p className="text-sm sm:text-base font-extrabold font-mono text-white mt-0.5">{selectedItems.tasks.length}</p>
              </div>
              <div className="p-2 rounded-xl bg-[#17171a] border border-white/[0.05] text-center">
                <span className="text-[9px] font-mono text-[#8c8273] font-bold uppercase">Meetings</span>
                <p className="text-sm sm:text-base font-extrabold font-mono text-[#e7c873] mt-0.5">
                  {selectedItems.events.filter(e => e.type === 'meeting').length}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-[#17171a] border border-white/[0.05] text-center">
                <span className="text-[9px] font-mono text-[#8c8273] font-bold uppercase">Reminders</span>
                <p className="text-sm sm:text-base font-extrabold font-mono text-purple-300 mt-0.5">
                  {selectedItems.events.filter(e => e.type === 'reminder').length}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-[#17171a] border border-white/[0.05] text-center">
                <span className="text-[9px] font-mono text-[#8c8273] font-bold uppercase">Holidays</span>
                <p className="text-sm sm:text-base font-extrabold font-mono text-[#d4af5a] mt-0.5">{selectedItems.holidays.length}</p>
              </div>
            </div>

            {/* Detailed Event List for Selected Date */}
            <div className="space-y-2 max-h-[300px] sm:max-h-[340px] overflow-y-auto pr-0.5 scrollbar-thin min-w-0">
              {/* Holidays */}
              {selectedItems.holidays.map((h, i) => (
                <div key={`h-det-${i}`} className="p-2.5 rounded-xl bg-[#ebdcb4] text-[#453205] border border-[#d4af5a]/60 shadow-2xs">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span className="text-sm">{h.icon}</span>
                    <span className="truncate">{h.name}</span>
                  </div>
                  <p className="text-[9px] text-[#63490b] font-mono mt-0.5 truncate">
                    {h.national ? '🇮🇳 Gazetted National Holiday' : 'Festival / Observance'}
                  </p>
                </div>
              ))}

              {/* Reminders / Meetings */}
              {selectedItems.events.map((evt) => (
                <div key={evt.id} className="p-2.5 rounded-xl bg-[#f5f1e8] text-[#171717] border border-[#d8cdb8] shadow-2xs space-y-1 min-w-0">
                  <div className="flex items-center justify-between text-xs min-w-0 gap-1">
                    <span className="font-bold text-[#171717] flex items-center gap-1.5 truncate">
                      {evt.type === 'meeting' ? <Users className="w-3 h-3 text-[#2d5f8b] flex-shrink-0" /> : <Bell className="w-3 h-3 text-[#6c4885] flex-shrink-0" />}
                      <span className="truncate">{evt.title}</span>
                    </span>
                    <span className="text-[9px] font-mono font-bold text-[#6b665c] flex-shrink-0">{evt.start_time}</span>
                  </div>
                  <p className="text-[10px] text-[#6b665c] font-mono truncate">{evt.location}</p>
                </div>
              ))}

              {/* Tasks on Selected Date */}
              {selectedItems.tasks.map((task) => {
                const isDone = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    onClick={() => openEditModal(task)}
                    className="p-2.5 rounded-xl bg-[#f5f1e8] text-[#171717] border border-[#d8cdb8] shadow-2xs hover:border-[#d4af5a] cursor-pointer space-y-1 transition-all min-w-0"
                  >
                    <div className="flex items-center justify-between text-xs min-w-0">
                      <span className="text-[8px] font-mono uppercase font-bold text-[#6b665c] bg-[#e8e2d5] px-1.5 py-0.2 rounded border border-[#d8cdb8]">
                        {task.category || 'GENERAL'}
                      </span>
                      <span className={`text-[9px] font-mono font-bold ${isDone ? 'text-emerald-700' : 'text-[#825c0e]'}`}>
                        {task.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold text-[#171717] leading-snug truncate ${isDone ? 'line-through text-[#8c8273]' : ''}`}>
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between pt-1 border-t border-[#d8cdb8]/60 text-[9px] text-[#6b665c] font-mono">
                      <span>Priority: <strong className="text-[#171717] capitalize">{task.priority}</strong></span>
                      {task.assignee && (
                        <div className="flex items-center gap-1">
                          <img src={task.assignee.avatar} alt="User" className="w-3.5 h-3.5 rounded-full" />
                          <span className="truncate">{task.assignee.name.split(' ')[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {selectedItems.allCount === 0 && (
                <div className="py-6 text-center bg-[#17171a] rounded-xl border border-dashed border-white/[0.06] text-slate-500 text-xs">
                  <CalendarDays className="w-5 h-5 mx-auto mb-1 text-slate-600" />
                  <p>No deliverables on this date</p>
                  <button
                    onClick={() => openCreateModal('backlog')}
                    className="mt-1.5 text-xs font-bold text-[#e7c873] hover:underline"
                  >
                    + Add Task
                  </button>
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            <div className="pt-2 border-t border-white/[0.06]">
              <button
                onClick={() => openCreateModal('backlog')}
                className="w-full h-9 rounded-xl btn-gold text-xs font-bold flex items-center justify-center gap-1.5 shadow-gold-sm"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Task on This Date</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. ADD EVENT / REMINDER MODAL                                */}
      {/* ============================================================ */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-md bg-[#0f1118] border border-[#d4af5a]/40 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#d4af5a]" />
                <h3 className="font-bold text-sm text-white font-mono uppercase">Schedule Reminder / Meeting</h3>
              </div>
              <button
                onClick={() => setIsAddEventModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomEvent} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 font-bold">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sprint Planning / Code Review"
                  value={newEventForm.title}
                  onChange={(e) => setNewEventForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full h-9.5 gold-input rounded-xl px-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 font-bold">Event Type</label>
                  <select
                    value={newEventForm.type}
                    onChange={(e) => setNewEventForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full h-9 gold-input rounded-xl px-2.5 text-xs text-slate-200"
                  >
                    <option value="meeting">Team Meeting</option>
                    <option value="reminder">Reminder</option>
                    <option value="deadline">Sprint Deadline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 font-bold">Date</label>
                  <input
                    type="date"
                    required
                    value={newEventForm.date || formatDateStr(selectedDate)}
                    onChange={(e) => setNewEventForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full h-9 gold-input rounded-xl px-2.5 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 font-bold">Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={newEventForm.start_time}
                    onChange={(e) => setNewEventForm(prev => ({ ...prev, start_time: e.target.value }))}
                    className="w-full h-9 gold-input rounded-xl px-2.5 text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 font-bold">Location / Link</label>
                  <input
                    type="text"
                    placeholder="Google Meet / Room 3B"
                    value={newEventForm.location}
                    onChange={(e) => setNewEventForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full h-9 gold-input rounded-xl px-2.5 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="h-8.5 px-3.5 rounded-xl btn-dark-gold text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8.5 px-4 rounded-xl btn-gold text-xs font-bold shadow-gold-sm"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
