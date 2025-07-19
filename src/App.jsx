import { useState, useMemo } from "react";
import "./App.css";
import {
  WORK_ROLES,
  TOPICS,
  getTopicsForWorkRole,
  getWorkRolesForTopic,
  SORT_OPTIONS,
} from "./exactData.js";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentView, setCurrentView] = useState("workroles"); // 'workroles' or 'topics'
  const [selectedWorkRole, setSelectedWorkRole] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const filteredAndSortedWorkRoles = useMemo(() => {
    let filtered = WORK_ROLES.filter(
      (role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "count":
          return b.topicCount - a.topicCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, sortBy]);

  const filteredAndSortedTopics = useMemo(() => {
    let filtered = TOPICS.filter((topic) =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "count":
          return b.workRoleCount - a.workRoleCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, sortBy]);

  const handleWorkRoleClick = (workRole) => {
    setSelectedWorkRole(workRole);
    setSelectedTopic(null);
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setSelectedWorkRole(null);
  };

  const clearSelection = () => {
    setSelectedWorkRole(null);
    setSelectedTopic(null);
  };

  const relatedTopics = selectedWorkRole
    ? getTopicsForWorkRole(selectedWorkRole.id)
    : [];
  const relatedWorkRoles = selectedTopic
    ? getWorkRolesForTopic(selectedTopic.id)
    : [];

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 Work Roles & Topics Explorer</h1>
        <p>
          Explore the relationships between work roles and topics from your
          Excel data
        </p>
        <div className="stats">
          <span>{WORK_ROLES.length} work roles</span>
          <span>•</span>
          <span>{TOPICS.length} topics</span>
          <span>•</span>
          <span>420 connections</span>
        </div>
      </header>

      <div className="app-content">
        {/* Controls */}
        <div className="controls-section">
          <div className="view-toggle">
            <button
              className={`toggle-btn ${
                currentView === "workroles" ? "active" : ""
              }`}
              onClick={() => {
                setCurrentView("workroles");
                clearSelection();
              }}
            >
              Work Roles ({WORK_ROLES.length})
            </button>
            <button
              className={`toggle-btn ${
                currentView === "topics" ? "active" : ""
              }`}
              onClick={() => {
                setCurrentView("topics");
                clearSelection();
              }}
            >
              Topics ({TOPICS.length})
            </button>
          </div>

          <div className="filters">
            <div className="search-bar">
              <input
                type="text"
                placeholder={`Search ${currentView}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="sort-controls">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Left Panel - List */}
          <div className="list-panel">
            <div className="panel-header">
              <h3>
                {currentView === "workroles" ? "Work Roles" : "Topics"}(
                {currentView === "workroles"
                  ? filteredAndSortedWorkRoles.length
                  : filteredAndSortedTopics.length}
                )
              </h3>
            </div>

            <div className="items-list">
              {currentView === "workroles"
                ? filteredAndSortedWorkRoles.map((workRole) => (
                    <div
                      key={workRole.id}
                      className={`list-item ${
                        selectedWorkRole?.id === workRole.id ? "selected" : ""
                      }`}
                      onClick={() => handleWorkRoleClick(workRole)}
                    >
                      <div className="item-header">
                        <h4 className="item-name">{workRole.name}</h4>
                        <span className="item-code">{workRole.code}</span>
                      </div>
                      <div className="item-meta">
                        <span className="count-badge">
                          {workRole.topicCount} topics
                        </span>
                      </div>
                    </div>
                  ))
                : filteredAndSortedTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className={`list-item ${
                        selectedTopic?.id === topic.id ? "selected" : ""
                      }`}
                      onClick={() => handleTopicClick(topic)}
                    >
                      <div className="item-header">
                        <h4 className="item-name">{topic.name}</h4>
                      </div>
                      <div className="item-meta">
                        <span className="count-badge">
                          {topic.workRoleCount} work roles
                        </span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          {/* Right Panel - Related Items */}
          <div className="detail-panel">
            {selectedWorkRole && (
              <div className="detail-content">
                <div className="detail-header">
                  <h3>📋 Topics for Work Role</h3>
                  <button onClick={clearSelection} className="close-btn">
                    ✕
                  </button>
                </div>

                <div className="selected-item">
                  <h4>{selectedWorkRole.name}</h4>
                  <span className="code-badge">{selectedWorkRole.code}</span>
                  <p>{relatedTopics.length} related topics</p>
                </div>

                <div className="related-items">
                  {relatedTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="related-item"
                      onClick={() => {
                        setCurrentView("topics");
                        handleTopicClick(topic);
                      }}
                    >
                      <span className="item-text">{topic.name}</span>
                      <span className="connection-count">
                        {topic.workRoleCount} roles
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTopic && (
              <div className="detail-content">
                <div className="detail-header">
                  <h3>🎯 Work Roles for Topic</h3>
                  <button onClick={clearSelection} className="close-btn">
                    ✕
                  </button>
                </div>

                <div className="selected-item">
                  <h4>{selectedTopic.name}</h4>
                  <p>{relatedWorkRoles.length} related work roles</p>
                </div>

                <div className="related-items">
                  {relatedWorkRoles.map((workRole) => (
                    <div
                      key={workRole.id}
                      className="related-item"
                      onClick={() => {
                        setCurrentView("workroles");
                        handleWorkRoleClick(workRole);
                      }}
                    >
                      <div className="related-item-content">
                        <span className="item-text">{workRole.name}</span>
                        <span className="item-code">{workRole.code}</span>
                      </div>
                      <span className="connection-count">
                        {workRole.topicCount} topics
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!selectedWorkRole && !selectedTopic && (
              <div className="detail-placeholder">
                <div className="placeholder-content">
                  <h3>
                    👆 Click on{" "}
                    {currentView === "workroles" ? "a work role" : "a topic"}
                  </h3>
                  <p>
                    {currentView === "workroles"
                      ? "Select a work role to see all its related topics"
                      : "Select a topic to see all work roles that include it"}
                  </p>
                  <div className="example-connections">
                    <div className="connection-example">
                      <strong>Example:</strong> One work role can have many
                      topics
                      <br />
                      One topic can satisfy many work roles
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
