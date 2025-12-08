import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaProjectDiagram, FaCode, FaUsers, FaChartLine, FaArrowUp, FaUserPlus, FaPlusCircle, FaPlus, FaClock, FaTrash, FaSync, FaBell, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import ChartOne from '../../components/Charts/ChartOne';
import ChartTwo from '../../components/Charts/ChartTwo';
import TableOne from '../../components/Tables/TableOne';

const ECommerce: React.FC = () => {
  const [collabCount, setCollabCount] = useState<number>(0);
  const [skillCount, setSkillCount] = useState<number>(0);
  const [projectCount, setProjectCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  // Real-time tracking states
  const [realTimeData, setRealTimeData] = useState<any>({
    projects: [],
    skills: [],
    users: [],
    projectStats: { created: 0, updated: 0, deleted: 0 },
    skillStats: { created: 0, updated: 0, deleted: 0 },
    userStats: { created: 0, active: 0, inactive: 0 },
    systemHealth: { status: 'healthy', lastCheck: new Date() }
  });
  
  const [previousData, setPreviousData] = useState<any>({});
  const [changeIndicators, setChangeIndicators] = useState<any>({});
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState<boolean>(true);
  const wsRef = useRef<WebSocket | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Comprehensive real-time data fetching with change detection
  const fetchAllData = useCallback(async () => {
    try {
      console.log('🔄 Fetching dashboard data...');
      
      const [
        projectsRes,
        skillsRes, 
        personsRes
      ] = await Promise.all([
        fetch('http://localhost:8080/api/projects'),
        fetch('http://localhost:8080/api/skills'),
        fetch('http://localhost:8080/api/person')
      ]);

      console.log('📡 API Response status:', {
        projects: projectsRes.status,
        skills: skillsRes.status,
        persons: personsRes.status
      });

      const [
        projectsData,
        skillsData,
        personsData
      ] = await Promise.all([
        projectsRes.json(),
        skillsRes.json(),
        personsRes.json()
      ]);

      console.log('📊 Raw API responses:', {
        projects: projectsData,
        skills: skillsData,
        persons: personsData
      });

      // Detailed logging for projects and skills structure
      console.log('🔍 Projects structure analysis:', {
        isProjectsArray: Array.isArray(projectsData),
        projectsKeys: Object.keys(projectsData || {}),
        projectsDataProperty: projectsData.data,
        projectsDataLength: (projectsData.data || []).length,
        fullProjectsObject: JSON.stringify(projectsData, null, 2)
      });

      console.log('🔍 Skills structure analysis:', {
        isSkillsArray: Array.isArray(skillsData),
        skillsKeys: Object.keys(skillsData || {}),
        skillsDataProperty: skillsData.data,
        skillsDataLength: (skillsData.data || []).length,
        fullSkillsObject: JSON.stringify(skillsData, null, 2)
      });

      // Extract data arrays correctly based on actual API response structure
      const projectsArray = Array.isArray(projectsData) ? projectsData : (projectsData.projects || projectsData.data || []);
      const skillsArray = Array.isArray(skillsData) ? skillsData : (skillsData.skills || skillsData.data || []);
      const personsArray = Array.isArray(personsData) ? personsData : (personsData.data || []);

      // Calculate actual counts from the data arrays
      const actualProjectCount = projectsArray.length;
      const actualSkillCount = skillsArray.length;
      const actualCollabCount = personsArray.length;

      console.log('🔢 Calculated counts:', {
        projects: actualProjectCount,
        skills: actualSkillCount,
        collaborators: actualCollabCount,
        projectsArray: projectsArray,
        skillsArray: skillsArray,
        personsArray: personsArray
      });

      const newData = {
        projects: projectsArray,
        skills: skillsArray,
        users: personsArray,
        collabCount: actualCollabCount,
        skillCount: actualSkillCount,
        projectCount: actualProjectCount,
        timestamp: new Date()
      };

      console.log('✅ Final data object:', newData);

      // Detect changes
      const changes = detectChanges(previousData, newData);
      
      // Update change indicators
      if (Object.keys(changes).length > 0) {
        setChangeIndicators(changes);
        generateNotifications(changes);
        
        // Auto-clear indicators after 3 seconds
        setTimeout(() => setChangeIndicators({}), 3000);
      }

      // Update all state
      setCollabCount(newData.collabCount);
      setSkillCount(newData.skillCount);
      setProjectCount(newData.projectCount);
      setRealTimeData((prev: any) => ({
        ...prev,
        projects: newData.projects,
        skills: newData.skills,
        users: newData.users,
        projectStats: calculateStats(prev.projectStats, newData.projects),
        skillStats: calculateStats(prev.skillStats, newData.skills),
        userStats: calculateStats(prev.userStats, newData.users),
        systemHealth: { status: 'healthy', lastCheck: new Date() }
      }));
      
      setPreviousData(newData);
      setLastUpdate(new Date());
      
      // Generate activities
      await generateActivities(newData);
      
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      setRealTimeData((prev: any) => ({
        ...prev,
        systemHealth: { status: 'error', lastCheck: new Date(), error: (error as Error).message }
      }));
      
      // Still try to get basic data even if some APIs fail
      try {
        const [projectsRes, skillsRes, personsRes] = await Promise.all([
          fetch('http://localhost:8080/api/projects').catch(() => ({ json: () => ({ data: [] }) })),
          fetch('http://localhost:8080/api/skills').catch(() => ({ json: () => ({ data: [] }) })),
          fetch('http://localhost:8080/api/person').catch(() => ({ json: () => ({ data: [] }) }))
        ]);

        const [projectsData, skillsData, personsData] = await Promise.all([
          projectsRes.json(),
          skillsRes.json(),
          personsRes.json()
        ]);

        // Calculate counts from actual data
        const actualProjectCount = (projectsData.data || []).length;
        const actualSkillCount = (skillsData.data || []).length;
        const actualCollabCount = (personsData.data || []).length;

        setCollabCount(actualCollabCount);
        setSkillCount(actualSkillCount);
        setProjectCount(actualProjectCount);

        console.log('Fallback counts from data:', {
          projects: actualProjectCount,
          skills: actualSkillCount,
          collaborators: actualCollabCount
        });
      } catch (countError) {
        console.error('Error fetching fallback data:', countError);
        // Set default values
        setCollabCount(0);
        setSkillCount(0);
        setProjectCount(0);
      }
      
      // Generate default activities
      setRecentActivities([
        {
          id: 'system-1',
          title: 'Dashboard initialized',
          description: 'System started - some data may be unavailable',
          timestamp: new Date().toISOString(),
          icon: FaClock,
          color: 'gray',
          action: 'system'
        }
      ]);
    } finally {
      // Ensure loading is set to false
      setLoading(false);
    }
  }, [previousData]);

  // Change detection algorithm
  const detectChanges = (prev: any, curr: any) => {
    const changes: any = {};
    
    if (!prev || !curr) return changes;
    
    // Count changes
    const prevProjects = prev.projects?.length || 0;
    const currProjects = curr.projects?.length || 0;
    if (prevProjects !== currProjects) {
      changes.projects = currProjects > prevProjects ? 'added' : 'removed';
      changes.projectCount = currProjects - prevProjects;
    }
    
    const prevSkills = prev.skills?.length || 0;
    const currSkills = curr.skills?.length || 0;
    if (prevSkills !== currSkills) {
      changes.skills = currSkills > prevSkills ? 'added' : 'removed';
      changes.skillCount = currSkills - prevSkills;
    }
    
    const prevUsers = prev.users?.length || 0;
    const currUsers = curr.users?.length || 0;
    if (prevUsers !== currUsers) {
      changes.users = currUsers > prevUsers ? 'added' : 'removed';
      changes.userCount = currUsers - prevUsers;
    }
    
    return changes;
  };

  // Calculate statistics
  const calculateStats = (prevStats: any, data: any[]) => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentItems = data.filter((item: any) => {
      const itemDate = new Date(item.created_at || item.updated_at || item.datebegin || now);
      return itemDate > oneDayAgo;
    });
    
    return {
      created: recentItems.length,
      updated: data.filter((item: any) => {
        const updatedDate = new Date(item.updated_at || now);
        return updatedDate > oneDayAgo;
      }).length,
      deleted: prevStats?.deleted || 0, // Would need deletion tracking
      total: data.length
    };
  };

  // Generate notifications for changes
  const generateNotifications = (changes: any) => {
    const newNotifications: any[] = [];
    
    if (changes.projects) {
      newNotifications.push({
        id: `proj-${Date.now()}`,
        type: 'project',
        message: `${Math.abs(changes.projectCount)} project(s) ${changes.projects}`,
        icon: changes.projects === 'added' ? FaPlusCircle : FaTrash,
        color: changes.projects === 'added' ? 'green' : 'red',
        timestamp: new Date()
      });
    }
    
    if (changes.skills) {
      newNotifications.push({
        id: `skill-${Date.now()}`,
        type: 'skill',
        message: `${Math.abs(changes.skillCount)} skill(s) ${changes.skills}`,
        icon: changes.skills === 'added' ? FaPlusCircle : FaTrash,
        color: changes.skills === 'added' ? 'purple' : 'red',
        timestamp: new Date()
      });
    }
    
    if (changes.users) {
      newNotifications.push({
        id: `user-${Date.now()}`,
        type: 'user',
        message: `${Math.abs(changes.userCount)} user(s) ${changes.users}`,
        icon: changes.users === 'added' ? FaUserPlus : FaTrash,
        color: changes.users === 'added' ? 'blue' : 'red',
        timestamp: new Date()
      });
    }
    
    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev].slice(0, 10)); // Keep latest 10
    }
  };

  // Enhanced activity generation
  const generateActivities = async (data: any) => {
    const activities: any[] = [];
    
    // Recent project activities
    if (data.projects && Array.isArray(data.projects)) {
      data.projects.slice(0, 5).forEach((project: any) => {
        activities.push({
          id: `project-${project.id}`,
          type: 'project',
          title: `Project "${project.name}"`,
          description: `Status: ${project.etat || 'Active'} | ${project.nbrperson || 0} team members`,
          timestamp: project.created_at || new Date().toISOString(),
          icon: FaProjectDiagram,
          color: 'blue',
          action: 'created',
          metadata: {
            id: project.id,
            status: project.etat,
            teamSize: project.nbrperson
          }
        });
      });
    }
    
    // Recent skill activities
    if (data.skills && Array.isArray(data.skills)) {
      data.skills.slice(0, 3).forEach((skill: any) => {
        activities.push({
          id: `skill-${skill.id}`,
          type: 'skill',
          title: `Skill "${skill.name}"`,
          description: skill.description || 'Technical skill available',
          timestamp: skill.updated_at || skill.created_at || new Date().toISOString(),
          icon: FaCode,
          color: 'purple',
          action: 'updated',
          metadata: {
            id: skill.id,
            level: skill.level || 'intermediate'
          }
        });
      });
    }
    
    // Recent user activities
    if (data.users && Array.isArray(data.users)) {
      data.users.slice(0, 3).forEach((user: any) => {
        activities.push({
          id: `user-${user.id}`,
          type: 'user',
          title: `User "${user.name} ${user.firstname}"`,
          description: `${user.email} | ${user.telephone || 'No phone'}`,
          timestamp: user.created_at || new Date().toISOString(),
          icon: FaUserPlus,
          color: 'green',
          action: 'registered',
          metadata: {
            id: user.id,
            email: user.email,
            phone: user.telephone
          }
        });
      });
    }
    
    // Sort by timestamp and take latest
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setRecentActivities(activities.slice(0, 8));
  };

  // Function to fetch recent activities (legacy - now integrated)
  // Note: This function is kept for compatibility but no longer used
  // const fetchRecentActivities = async () => {
  //   await fetchAllData();
  // };

  useEffect(() => {
    // Initialize real-time data
    fetchAllData();
    
    // Set up real-time updates
    if (isRealTimeEnabled) {
      // Fast polling for real-time updates (every 5 seconds)
      pollingIntervalRef.current = setInterval(fetchAllData, 5000);
      
      // Optional: WebSocket connection for true real-time
      // This would require WebSocket server implementation
      try {
        const ws = new WebSocket('ws://localhost:8080/ws');
        wsRef.current = ws;
        
        ws.onopen = () => {
          console.log('WebSocket connected for real-time updates');
        };
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'data_change') {
            fetchAllData(); // Refresh data on change notification
          }
        };
        
        ws.onerror = (error) => {
          console.log('WebSocket error, falling back to polling:', error);
        };
        
        ws.onclose = () => {
          console.log('WebSocket disconnected, using polling');
        };
      } catch (error) {
        console.log('WebSocket not available, using polling only');
      }
    }
    
    // Cleanup
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isRealTimeEnabled, fetchAllData]);

  // Update loading state - show dashboard after initial load attempt
  useEffect(() => {
    // Set a timeout to ensure dashboard shows even if APIs fail
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds max wait time

    // Also set loading to false if we have any data
    if (realTimeData.projects.length > 0 || realTimeData.skills.length > 0 || realTimeData.users.length > 0) {
      setLoading(false);
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [realTimeData]);

  // Helper function to format time ago
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return time.toLocaleDateString();
  };

  // Get icon color based on activity type
  const getActivityColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30',
      purple: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30',
      green: 'bg-green-500/20 text-green-400 hover:bg-green-500/30',
      red: 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
      gray: 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
    };
    return colorMap[color] || colorMap.gray;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-6">
        {/* Header with Real-time Status */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Real-Time Dashboard
              </h1>
              <p className="text-gray-400 text-lg">
                Live monitoring of TalentIA system
              </p>
            </div>
            
            {/* Real-time Controls */}
            <div className="flex items-center gap-4">
              {/* System Health */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                realTimeData.systemHealth.status === 'healthy' 
                  ? 'bg-green-500/20 border-green-500/30 text-green-400'
                  : 'bg-red-500/20 border-red-500/30 text-red-400'
              }`}>
                {realTimeData.systemHealth.status === 'healthy' ? (
                  <FaCheckCircle className="text-sm" />
                ) : (
                  <FaExclamationTriangle className="text-sm" />
                )}
                <span className="text-sm font-medium">
                  {realTimeData.systemHealth.status === 'healthy' ? 'System Healthy' : 'System Error'}
                </span>
              </div>
              
              {/* Real-time Toggle */}
              <button
                onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                  isRealTimeEnabled 
                    ? 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
                    : 'bg-gray-500/20 border-gray-500/30 text-gray-400 hover:bg-gray-500/30'
                }`}
              >
                <FaSync className={`text-sm ${isRealTimeEnabled ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">
                  {isRealTimeEnabled ? 'Real-time ON' : 'Real-time OFF'}
                </span>
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-700/70 transition-all duration-300">
                  <FaBell className="text-sm" />
                  <span className="text-sm font-medium">Alerts</span>
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Last Update & Change Indicators */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FaClock className="text-xs" />
              <span>Last updated: {formatTimeAgo(lastUpdate.toISOString())}</span>
            </div>
            
            {Object.keys(changeIndicators).length > 0 && (
              <div className="flex items-center gap-4 animate-pulse">
                {changeIndicators.projects && (
                  <span className="flex items-center gap-1 text-blue-400">
                    <FaProjectDiagram className="text-xs" />
                    {changeIndicators.projectCount > 0 ? '+' : ''}{changeIndicators.projectCount} projects
                  </span>
                )}
                {changeIndicators.skills && (
                  <span className="flex items-center gap-1 text-purple-400">
                    <FaCode className="text-xs" />
                    {changeIndicators.skillCount > 0 ? '+' : ''}{changeIndicators.skillCount} skills
                  </span>
                )}
                {changeIndicators.users && (
                  <span className="flex items-center gap-1 text-green-400">
                    <FaUsers className="text-xs" />
                    {changeIndicators.userCount > 0 ? '+' : ''}{changeIndicators.userCount} users
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Notifications Panel */}
        {notifications.length > 0 && (
          <div className="mb-6 animate-slide-down">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <FaBell className="text-sm" />
                  Recent Changes
                </h3>
                <button
                  onClick={() => setNotifications([])}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-2">
                {notifications.slice(0, 3).map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div key={notification.id} className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg">
                      <div className={`w-8 h-8 bg-${notification.color}-500/20 rounded-lg flex items-center justify-center`}>
                        <IconComponent className={`text-${notification.color}-400 text-sm`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{notification.message}</p>
                        <p className="text-gray-400 text-xs">{formatTimeAgo(notification.timestamp.toISOString())}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Projects Card */}
          <div className={`bg-gradient-to-br from-gray-800 to-gray-900 border rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20 animate-slide-up ${
            changeIndicators.projects ? 'border-blue-500 animate-pulse' : 'border-gray-700'
          }`} style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FaProjectDiagram className="text-white text-xl" />
              </div>
              <div className="text-blue-400 text-sm font-medium flex items-center">
                {changeIndicators.projects ? (
                  <>
                    <FaArrowUp className="mr-1 animate-bounce" />
                    {changeIndicators.projectCount > 0 ? '+' : ''}{changeIndicators.projectCount}
                  </>
                ) : (
                  <>
                    <FaArrowUp className="mr-1" />
                    {realTimeData.projectStats.total > 0 ? Math.round((realTimeData.projectStats.created / realTimeData.projectStats.total) * 100) : 0}%
                  </>
                )}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{projectCount}</h3>
            <p className="text-gray-400 text-sm">Total Projects</p>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Created today</span>
                <span className="text-blue-400">{realTimeData.projectStats.created}</span>
              </div>
            </div>
          </div>

          {/* Skills Card */}
          <div className={`bg-gradient-to-br from-gray-800 to-gray-900 border rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/20 animate-slide-up ${
            changeIndicators.skills ? 'border-purple-500 animate-pulse' : 'border-gray-700'
          }`} style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FaCode className="text-white text-xl" />
              </div>
              <div className="text-purple-400 text-sm font-medium flex items-center">
                {changeIndicators.skills ? (
                  <>
                    <FaArrowUp className="mr-1 animate-bounce" />
                    {changeIndicators.skillCount > 0 ? '+' : ''}{changeIndicators.skillCount}
                  </>
                ) : (
                  <>
                    <FaArrowUp className="mr-1" />
                    {realTimeData.skillStats.total > 0 ? Math.round((realTimeData.skillStats.created / realTimeData.skillStats.total) * 100) : 0}%
                  </>
                )}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{skillCount}</h3>
            <p className="text-gray-400 text-sm">Total Skills</p>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Updated today</span>
                <span className="text-purple-400">{realTimeData.skillStats.updated}</span>
              </div>
            </div>
          </div>

          {/* Users Card */}
          <div className={`bg-gradient-to-br from-gray-800 to-gray-900 border rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:border-green-500 hover:shadow-xl hover:shadow-green-500/20 animate-slide-up ${
            changeIndicators.users ? 'border-green-500 animate-pulse' : 'border-gray-700'
          }`} style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <FaUsers className="text-white text-xl" />
              </div>
              <div className="text-green-400 text-sm font-medium flex items-center">
                {changeIndicators.users ? (
                  <>
                    <FaArrowUp className="mr-1 animate-bounce" />
                    {changeIndicators.userCount > 0 ? '+' : ''}{changeIndicators.userCount}
                  </>
                ) : (
                  <>
                    <FaArrowUp className="mr-1" />
                    {realTimeData.userStats.total > 0 ? Math.round((realTimeData.userStats.created / realTimeData.userStats.total) * 100) : 0}%
                  </>
                )}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{collabCount}</h3>
            <p className="text-gray-400 text-sm">Total Collaborators</p>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Joined today</span>
                <span className="text-green-400">{realTimeData.userStats.created}</span>
              </div>
            </div>
          </div>

          {/* System Efficiency Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <FaChartLine className="text-white text-xl" />
              </div>
              <div className="text-orange-400 text-sm font-medium">
                <FaArrowUp className="mr-1" />
                {isRealTimeEnabled ? 'Live' : 'Offline'}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {isRealTimeEnabled ? '100%' : '95%'}
            </h3>
            <p className="text-gray-400 text-sm">System Efficiency</p>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Response time</span>
                <span className="text-orange-400">{isRealTimeEnabled ? '< 1s' : '~5s'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <FaClock className="text-xs" />
              <span>Updated {formatTimeAgo(lastUpdate.toISOString())}</span>
            </div>
          </div>
          
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div 
                    key={activity.id} 
                    className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl border border-gray-600 hover:bg-gray-700/70 transition-all duration-300 cursor-pointer group"
                  >
                    <div className={`w-10 h-10 ${getActivityColor(activity.color).split(' ')[0]} rounded-lg flex items-center justify-center ${getActivityColor(activity.color).split(' ').slice(1).join(' ')} transition-colors`}>
                      <IconComponent className="text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{activity.title}</p>
                      <p className="text-gray-400 text-sm truncate">{activity.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-gray-400 text-xs">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-400">No recent activity</p>
            </div>
          )}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-2xl font-bold text-white mb-6">Performance Overview</h2>
            <ChartOne />
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <h2 className="text-2xl font-bold text-white mb-6">Skills Distribution</h2>
            <ChartTwo />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Projects</h2>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              <FaPlus className="mr-2" />
              New Project
            </button>
          </div>
          <TableOne />
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out both;
        }
      `}</style>
    </>
  );
};

export default ECommerce;
