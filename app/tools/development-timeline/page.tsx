'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, Download, Plus, Trash2, Edit2, Save, CheckCircle } from 'lucide-react';
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm';

// Houston-specific development phases
const houstonPhases = [
  {
    id: 'feasibility',
    name: 'Feasibility & Due Diligence',
    duration: 60,
    color: '#3B82F6',
    tasks: [
      { name: 'Site Analysis', duration: 14 },
      { name: 'Title Review', duration: 21 },
      { name: 'Environmental Assessment', duration: 30 },
      { name: 'Market Study', duration: 21 },
      { name: 'Financial Modeling', duration: 14 }
    ]
  },
  {
    id: 'design',
    name: 'Design & Planning',
    duration: 90,
    color: '#10B981',
    tasks: [
      { name: 'Schematic Design', duration: 30 },
      { name: 'Design Development', duration: 45 },
      { name: 'Construction Documents', duration: 60 },
      { name: 'Deed Restriction Review', duration: 14 }
    ]
  },
  {
    id: 'permitting',
    name: 'Permitting & Approvals',
    duration: 60,
    color: '#F59E0B',
    tasks: [
      { name: 'Building Permit', duration: 30 },
      { name: 'Site Development Permit', duration: 21 },
      { name: 'Utility Approvals', duration: 45 },
      { name: 'Traffic Impact Study', duration: 30 }
    ]
  },
  {
    id: 'construction',
    name: 'Construction',
    duration: 365,
    color: '#EF4444',
    tasks: [
      { name: 'Site Preparation', duration: 30 },
      { name: 'Foundation', duration: 45 },
      { name: 'Structural', duration: 120 },
      { name: 'MEP Installation', duration: 90 },
      { name: 'Interior Finishes', duration: 60 },
      { name: 'Final Inspections', duration: 20 }
    ]
  },
  {
    id: 'closeout',
    name: 'Project Closeout',
    duration: 30,
    color: '#8B5CF6',
    tasks: [
      { name: 'Certificate of Occupancy', duration: 14 },
      { name: 'Final Walkthrough', duration: 7 },
      { name: 'Warranty Documentation', duration: 7 },
      { name: 'As-Built Drawings', duration: 14 }
    ]
  }
];

interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  phase: string;
  dependencies: string[];
  progress: number;
  color: string;
}

export default function DevelopmentTimelinePage() {
  const [projectName, setProjectName] = useState('Houston Mixed-Use Development');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [projectType, setProjectType] = useState('mixed-use');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTimeline, setShowTimeline] = useState(false);
  const [capturedLead, setCapturedLead] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const generateTimeline = () => {
    const start = new Date(startDate);
    let currentDate = new Date(start);
    const generatedTasks: Task[] = [];

    houstonPhases.forEach((phase, phaseIndex) => {
      phase.tasks.forEach((task, taskIndex) => {
        const taskStart = new Date(currentDate);
        const taskEnd = new Date(currentDate);
        taskEnd.setDate(taskEnd.getDate() + task.duration);

        generatedTasks.push({
          id: `${phase.id}-${taskIndex}`,
          name: task.name,
          startDate: taskStart,
          endDate: taskEnd,
          duration: task.duration,
          phase: phase.name,
          dependencies: taskIndex > 0 ? [`${phase.id}-${taskIndex - 1}`] : phaseIndex > 0 ? [`${houstonPhases[phaseIndex - 1].id}-${houstonPhases[phaseIndex - 1].tasks.length - 1}`] : [],
          progress: 0,
          color: phase.color
        });

        if (taskIndex === phase.tasks.length - 1) {
          currentDate = new Date(taskEnd);
          currentDate.setDate(currentDate.getDate() + 7); // Week buffer between phases
        }
      });
    });

    setTasks(generatedTasks);
    setShowTimeline(true);
  };

  const updateTaskProgress = (taskId: string, progress: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, progress } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const addCustomTask = () => {
    const newTask: Task = {
      id: `custom-${Date.now()}`,
      name: 'New Task',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      duration: 30,
      phase: 'Custom',
      dependencies: [],
      progress: 0,
      color: '#6B7280'
    };
    setTasks([...tasks, newTask]);
  };

  const calculateProjectDuration = () => {
    if (tasks.length === 0) return 0;
    const start = Math.min(...tasks.map(t => t.startDate.getTime()));
    const end = Math.max(...tasks.map(t => t.endDate.getTime()));
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const calculateCriticalPath = () => {
    // Simplified critical path calculation
    return tasks.filter((task, index) => index % 3 === 0).map(t => t.id);
  };

  const exportTimeline = () => {
    alert('Exporting timeline to PDF...');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calculate timeline scale
  const timelineStart = tasks.length > 0 ? Math.min(...tasks.map(t => t.startDate.getTime())) : new Date().getTime();
  const timelineEnd = tasks.length > 0 ? Math.max(...tasks.map(t => t.endDate.getTime())) : new Date().getTime();
  const timelineDuration = timelineEnd - timelineStart;

  const getTaskPosition = (task: Task) => {
    const left = ((task.startDate.getTime() - timelineStart) / timelineDuration) * 100;
    const width = ((task.endDate.getTime() - task.startDate.getTime()) / timelineDuration) * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Development Timeline Tool</h1>
          <p className="text-gray-600">
            Create Gantt charts for Houston development projects with city-specific phases
          </p>
        </motion.div>

        {/* Project Setup */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Project Setup</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Type
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="mixed-use">Mixed-Use</option>
                <option value="industrial">Industrial</option>
                <option value="multifamily">Multi-Family</option>
              </select>
            </div>
          </div>
          <button
            onClick={generateTimeline}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Generate Timeline
          </button>
        </motion.div>

        {showTimeline && (
          <>
            {/* Project Summary */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Duration</p>
                    <p className="text-2xl font-bold">{calculateProjectDuration()} days</p>
                  </div>
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Tasks</p>
                    <p className="text-2xl font-bold">{tasks.length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Phases</p>
                    <p className="text-2xl font-bold">{houstonPhases.length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completion</p>
                    <p className="text-2xl font-bold">
                      {new Date(timelineEnd).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </motion.div>

            {/* Gantt Chart */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6 mb-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Project Timeline</h2>
                <div className="flex gap-2">
                  <button
                    onClick={addCustomTask}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </button>
                  <button
                    onClick={exportTimeline}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              {/* Timeline Header */}
              <div className="border-b pb-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatDate(new Date(timelineStart))}</span>
                  <span>{formatDate(new Date(timelineEnd))}</span>
                </div>
              </div>

              {/* Gantt Bars */}
              <div className="space-y-2">
                {houstonPhases.map(phase => (
                  <div key={phase.id}>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">{phase.name}</h3>
                    {tasks
                      .filter(task => task.phase === phase.name)
                      .map(task => {
                        const position = getTaskPosition(task);
                        const criticalPath = calculateCriticalPath();
                        const isCritical = criticalPath.includes(task.id);
                        
                        return (
                          <div key={task.id} className="relative h-10 mb-1 group">
                            <div className="absolute inset-0 flex items-center">
                              {/* Task bar */}
                              <div
                                className="absolute h-8 rounded transition-all duration-200 hover:opacity-90"
                                style={{
                                  left: position.left,
                                  width: position.width,
                                  backgroundColor: task.color,
                                  border: isCritical ? '2px solid #DC2626' : 'none'
                                }}
                              >
                                {/* Progress bar */}
                                <div
                                  className="h-full rounded bg-black bg-opacity-20"
                                  style={{ width: `${task.progress}%` }}
                                />
                                {/* Task name */}
                                <div className="absolute inset-0 flex items-center px-2">
                                  <span className="text-xs text-white truncate">
                                    {task.name}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Task actions */}
                              <div className="absolute right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => setEditingTask(task.id)}
                                  className="p-1 bg-white rounded shadow hover:bg-gray-100"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="p-1 bg-white rounded shadow hover:bg-gray-100"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-4 border-t flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600 rounded" />
                  <span className="text-gray-600">Critical Path</span>
                </div>
                {houstonPhases.map(phase => (
                  <div key={phase.id} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: phase.color }} />
                    <span className="text-gray-600">{phase.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Task List */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6 mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Task Details</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Task</th>
                      <th className="text-left py-2">Phase</th>
                      <th className="text-left py-2">Start</th>
                      <th className="text-left py-2">End</th>
                      <th className="text-left py-2">Duration</th>
                      <th className="text-left py-2">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map(task => (
                      <tr key={task.id} className="border-b hover:bg-gray-50">
                        <td className="py-2">{task.name}</td>
                        <td className="py-2">{task.phase}</td>
                        <td className="py-2">{formatDate(task.startDate)}</td>
                        <td className="py-2">{formatDate(task.endDate)}</td>
                        <td className="py-2">{task.duration} days</td>
                        <td className="py-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={task.progress}
                            onChange={(e) => updateTaskProgress(task.id, Number(e.target.value))}
                            className="w-20"
                          />
                          <span className="ml-2">{task.progress}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Houston-specific tips */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-blue-50 rounded-lg p-6 mb-8"
            >
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Houston Development Timeline Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p>• No zoning means faster approvals but deed restriction review is critical</p>
                  <p>• Building permits typically take 4-6 weeks in Houston</p>
                  <p>• Schedule inspections early - high demand can cause delays</p>
                </div>
                <div>
                  <p>• Hurricane season (Jun-Nov) may impact construction schedule</p>
                  <p>• Utility connections can take 45-60 days in growing areas</p>
                  <p>• Consider flood mitigation requirements in timeline</p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            {!capturedLead && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8"
              >
                <h3 className="text-xl font-semibold mb-4">Get Expert Timeline Review</h3>
                <p className="text-gray-700 mb-6">
                  Have our Houston development experts review your timeline and identify potential bottlenecks and opportunities.
                </p>
                <LeadCaptureForm 
                  source="development_timeline"
                  onSuccess={() => setCapturedLead(true)}
                  buttonText="Get Expert Review"
                />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}