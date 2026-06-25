/* =====================================================
   ITE STARTUP LAUNCH PAD – MENTOR PAGES (mentor.js)
   ===================================================== */
window.ITE = window.ITE || {};
ITE.Pages = ITE.Pages || {};

ITE.Pages.Mentor = (function () {

  function _rc() { return ITE.App.roleColor; }

  async function renderDashboard() {
    ITE.App.pc().innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading mentor dashboard...</div>`;
    try {
      const user = ITE.Auth.getCurrentUser();
      const [teams, students, anns] = await Promise.all([
        ITE.API.get('/teams'),
        ITE.API.get('/users/students'),
        ITE.API.get('/announcements')
      ]);

      const myTeams = teams.filter(t => t.mentorId === user.id);
      const myStudents = students.filter(s => s.mentorId === user.id);
      const myAnns = anns.filter(a => a.recipients === 'all' || a.recipients === 'mentors' || a.createdBy === user.id || myTeams.some(t => a.recipients === 'team-' + t.id));
      const annsSent = anns.filter(a => a.createdBy === user.id);

      ITE.App.pc().innerHTML = `
<div class="page-header">
  <div class="page-title">Welcome, ${user.name.split(' ').slice(0,2).join(' ')}</div>
  <div class="page-subtitle">${user.specialization||'Faculty Mentor'} · ${myTeams.length} team${myTeams.length!==1?'s':''} assigned</div>
</div>
<div class="stats-grid">
  ${[['My Teams',myTeams.length,'#2563EB'],['Students',myStudents.length,'#10B981'],['Announcements Sent',annsSent.length,'#8B5CF6'],['Avg Stage',myTeams.length?(myTeams.reduce((a,t)=>a+(t.stage||0),0)/myTeams.length).toFixed(1):'—','#F59E0B']].map(([lbl,val,col])=>`<div class="stat-card"><div class="stat-value">${val}</div><div class="stat-label">${lbl}</div></div>`).join('')}
</div>

<div class="section-title">My Teams</div>
${myTeams.length===0?`<div class="empty-state card"><h3>No teams assigned yet</h3><p>Contact the administrator to assign teams.</p></div>`:
`<div class="cards-grid">${myTeams.map(t=>_teamCard(t)).join('')}</div>`}

<div class="section-title mt-6">Recent Announcements</div>
${myAnns.length===0?`<p style="color:var(--text-muted);font-size:.875rem">No announcements yet.</p>`:
myAnns.slice(0,3).map(a=>`<div class="ann-card ${a.createdByRole}-ann"><div class="ann-meta"><span class="badge ${a.createdByRole==='admin'?'badge-blue':'badge-green'}">${a.createdByRole.toUpperCase()}</span><span style="font-size:.72rem;color:var(--text-muted)">${a.createdByName}</span></div><div class="ann-title">${a.title}</div><div class="ann-body">${a.content}</div><div class="ann-date">${new Date(a.createdAt).toLocaleString('en-IN')}</div></div>`).join('')}`;
    } catch(err) {
      ITE.App.pc().innerHTML = `<div style="color:red; padding:20px; background:white;">Error: ${err.message}</div>`;
    }
  }

  function _teamCard(team) {
    return `<div class="team-card" onclick="ITE.Pages.Mentor.showTeamDetail('${team.id}')">
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
    <div style="display:flex;align-items:center;gap:10px">
      <div style="width:42px;height:42px;border-radius:var(--radius-sm);background:var(--accent-light);display:flex;align-items:center;justify-content:center;font-size:1.25rem;color:var(--accent);font-weight:800;font-family:var(--font-display)">${team.startupName[0]}</div>
      <div><div style="font-family:var(--font-display);font-weight:700;font-size:.9375rem">${team.startupName}</div><div style="font-size:.72rem;color:var(--text-muted)">${team.industry}</div></div>
    </div>
    <span class="badge ${(team.stage||0)>=4?'badge-green':'badge-blue'}">S${(team.stage||0)+1}</span>
  </div>
  <p style="font-size:.8rem;color:var(--text-secondary);margin-bottom:10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${team.problemStatement}</p>
  <div style="font-size:.8rem;color:var(--text-muted);margin-bottom:10px">CEO: ${team.ceoName||'Unassigned'} · Members: ${team.members.length}</div>
  <div style="margin-top:auto"><div style="font-size:.72rem;color:var(--text-muted);margin-bottom:5px">Stage ${(team.stage||0)+1}: ${ITE.App.STAGES[team.stage||0]?.label}</div><div class="mini-progress">${ITE.App.STAGES.map((_,i)=>`<div class="mini-step ${i<(team.stage||0)?'done':i===(team.stage||0)?'active':''}"></div>`).join('')}</div></div>
</div>`;
  }

  async function renderTeams() {
    ITE.App.pc().innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading live teams...</div>`;
    try {
      const user = ITE.Auth.getCurrentUser();
      const [teams, students] = await Promise.all([
        ITE.API.get('/teams'),
        ITE.API.get('/users/students')
      ]);
      const myTeams = teams.filter(t => t.mentorId === user.id);
      
      ITE.App.pc().innerHTML = `
<div class="page-header" style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:14px">
  <div><div class="page-title">My Teams</div><div class="page-subtitle">${myTeams.length} venture${myTeams.length!==1?'s':''} under your mentorship</div></div>
  ${myTeams.length>0?`<button class="btn btn-primary" onclick="ITE.Pages.Mentor.showAssignTaskModal(null, 'all-my-teams')">Assign Task to All</button>`:''}
</div>
${myTeams.length===0?`<div class="empty-state card"><h3>No teams assigned</h3></div>`:
myTeams.map(t=>_fullTeamView(t, user, students)).join('')}`;
    } catch(err) {
      ITE.App.pc().innerHTML = `<div style="color:red; padding:20px; background:white;">Error: ${err.message}</div>`;
    }
  }

  function _fullTeamView(team, user, students) {
    const members = team.members || [];
    // Populate member details from students list if available locally, otherwise use fallback from live DB if we fetch it there
    const populatedMembers = members.map(m => {
      const s = students.find(st => st.id === m.userId);
      return { ...m, name: s?.name || 'Unknown', avatar: s?.avatar || '?', rollNo: s?.rollNo || '', branch: s?.branch || '' };
    });

    return `<div class="card mb-4" style="margin-bottom:20px">
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:12px">
    <div>
      <h2 style="font-family:var(--font-display);font-size:1.375rem;font-weight:800;margin-bottom:5px">${team.startupName}</h2>
      <div style="display:flex;gap:7px;flex-wrap:wrap"><span class="badge badge-blue">${team.industry}</span><span class="badge ${(team.stage||0)>=4?'badge-green':'badge-blue'}">Stage ${(team.stage||0) + 1}: ${ITE.App.STAGES[team.stage||0]?.label}</span></div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-ghost btn-sm" onclick="ITE.Pages.Mentor.showAssignCEO('${team.id}')">Assign CEO</button>
      <button class="btn btn-ghost btn-sm" onclick="ITE.Pages.Mentor.showAssignTaskModal('${team.id}', 'single-team')">Assign Task</button>
      <button class="btn btn-primary btn-sm" onclick="ITE.Pages.Mentor._advanceStage('${team.id}', ${team.stage||0})">Advance Stage</button>
    </div>
  </div>
  <div class="two-col" style="margin-bottom:18px">
    <div style="padding:12px;background:var(--bg-secondary);border-radius:var(--radius-sm)"><div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);margin-bottom:5px">Problem Statement</div><p style="font-size:.875rem;color:var(--text-secondary);line-height:1.6">${team.problemStatement}</p></div>
    <div style="padding:12px;background:var(--bg-secondary);border-radius:var(--radius-sm)"><div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);margin-bottom:5px">Description</div><p style="font-size:.875rem;color:var(--text-secondary);line-height:1.6">${team.solution||'Not provided.'}</p></div>
  </div>
  <div style="margin-bottom:18px"><div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);margin-bottom:8px">Venture Progress</div>${ITE.App.renderProgressTracker(team.stage||0)}</div>
  <div>
    <div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);margin-bottom:8px">Team Members (${populatedMembers.length})</div>
    ${populatedMembers.length===0?`<p style="color:var(--text-muted);font-size:.875rem">No members assigned. Appoint a CEO to initiate recruitment.</p>`:
    `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px">${populatedMembers.map(m=>`<div class="member-card"><div class="member-avatar" style="background:${ITE.App.roleColor(m.teamRole)}">${m.avatar}</div><div class="member-info"><div class="member-name">${m.name}</div><div class="member-sub">${m.rollNo} · ${m.branch}</div></div><span class="badge" style="background:${ITE.App.roleColor(m.teamRole)}22;color:${ITE.App.roleColor(m.teamRole)}">${m.teamRole}</span></div>`).join('')}</div>`}
  </div>
</div>`;
  }

  async function showTeamDetail(teamId) {
    try {
      const team = await ITE.API.get('/teams/' + teamId);
      const students = await ITE.API.get('/users/students');
      
      const members = (team.members || []).map(m => {
        const s = students.find(st => st.id === m.userId);
        return { ...m, name: s?.name || 'Unknown', avatar: s?.avatar || '?', rollNo: s?.rollNo || '', branch: s?.branch || '' };
      });

      ITE.App.showModal(`<div class="modal modal-lg">
<div class="modal-header"><div class="modal-title">${team.startupName}</div><button class="modal-close btn">✕</button></div>
<div class="modal-body">
  <div style="display:grid;gap:14px">
    <div><span class="badge badge-blue">${team.industry}</span></div>
    <div><div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);margin-bottom:4px">Problem</div><p style="font-size:.9rem;line-height:1.6">${team.problemStatement}</p></div>
    ${ITE.App.renderProgressTracker(team.stage||0)}
    <div><div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);margin-bottom:8px">Members</div><div style="display:grid;gap:7px">${members.map(m=>`<div class="member-card"><div class="member-avatar" style="background:${ITE.App.roleColor(m.teamRole)}">${m.avatar}</div><div class="member-info"><div class="member-name">${m.name}</div><div class="member-sub">${m.rollNo} · ${m.branch}</div></div><span class="badge" style="background:${ITE.App.roleColor(m.teamRole)}22;color:${ITE.App.roleColor(m.teamRole)}">${m.teamRole}</span></div>`).join('')}</div></div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-ghost btn-sm" onclick="ITE.App.closeModal();ITE.Pages.Mentor.showAssignCEO('${team.id}')">Assign CEO</button>
      <button class="btn btn-ghost btn-sm" onclick="ITE.App.closeModal();ITE.Pages.Mentor.showAssignTaskModal('${team.id}', 'single-team')">Assign Task</button>
      ${(team.stage||0)<4?`<button class="btn btn-primary btn-sm" onclick="ITE.App.closeModal();ITE.Pages.Mentor._advanceStage('${team.id}', ${team.stage||0})">Advance Stage</button>`:`<span class="badge badge-green">Complete</span>`}
    </div>
  </div>
</div>
<div class="modal-footer"><button class="btn btn-ghost" onclick="ITE.App.closeModal()">Close</button></div>
</div>`);
    } catch(err) {
      ITE.App.toast('Failed to load team details', 'error');
    }
  }

  async function showAssignCEO(teamId) {
    try {
      const user = ITE.Auth.getCurrentUser();
      const team = await ITE.API.get('/teams/' + teamId);
      const students = await ITE.API.get('/users/students');
      const eligible = students.filter(s => !s.teamId || s.teamId === 'null' || s.teamId === teamId);
      
      ITE.App.showModal(`<div class="modal">
<div class="modal-header"><div class="modal-title">Assign CEO – ${team?.startupName}</div><button class="modal-close btn">✕</button></div>
<div class="modal-body">
  <p style="font-size:.875rem;color:var(--text-secondary);margin-bottom:14px">The selected student will be granted executive privileges to configure the startup profile and invite team members.</p>
  ${eligible.length===0?`<div class="empty-state"><p>No eligible students found. All registered students are already assigned to a team.</p></div>`:
  `<div class="form-group"><label class="form-label">Select Student</label><select id="ceo-sel" class="form-control"><option value="">Choose student…</option>${eligible.map(s=>`<option value="${s.id}">${s.name} (${s.rollNo}) · ${s.branch}</option>`).join('')}</select></div>`}
</div>
<div class="modal-footer"><button class="btn btn-ghost" onclick="ITE.App.closeModal()">Cancel</button><button class="btn btn-primary" onclick="ITE.Pages.Mentor._submitCEO('${teamId}')">Assign CEO</button></div>
</div>`);
    } catch(err) {
      ITE.App.toast('Failed to load eligible students', 'error');
    }
  }

  async function _submitCEO(teamId) {
    const sId = document.getElementById('ceo-sel')?.value;
    if(!sId){ITE.App.toast('Select a student.','error');return;}
    try {
      const user = ITE.Auth.getCurrentUser();
      const team = await ITE.API.get('/teams/' + teamId);
      
      // Remove previous CEO if exists
      if(team.ceoId && team.ceoId!==sId){
        await ITE.API.patch(`/users/${team.ceoId}`, { teamId: 'null', teamRole: 'null', mentorId: 'null' });
      }
      
      // Update team members array + ceoId
      const members = [...(team.members||[]).filter(m=>m.userId!==sId), {userId:sId, teamRole:'CEO'}];
      await ITE.API.patch(`/teams/${teamId}`, { ceoId: sId, members });
      
      // Update new CEO user
      await ITE.API.patch(`/users/${sId}`, { teamId, teamRole: 'CEO', mentorId: user.id });
      
      ITE.App.toast(`CEO successfully assigned.`, 'success');
      ITE.App.closeModal(); 
      renderTeams();
    } catch (err) {
      ITE.App.toast(err.message, 'error');
    }
  }

  async function _advanceStage(teamId, currentStage) {
    if(currentStage>=4){ITE.App.toast('Already at final stage.','warning');return;}
    try {
      await ITE.API.patch(`/teams/${teamId}/stage`, { stage: currentStage + 1 });
      ITE.App.toast(`Team successfully advanced to Stage ${currentStage + 2}.`, 'success');
      renderTeams();
    } catch(err) {
      ITE.App.toast(err.message, 'error');
    }
  }

  async function renderAnnouncements() {
    ITE.App.pc().innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading live announcements...</div>`;
    try {
      const user = ITE.Auth.getCurrentUser();
      const [teams, anns] = await Promise.all([
        ITE.API.get('/teams'),
        ITE.API.get('/announcements')
      ]);
      const myTeams = teams.filter(t => t.mentorId === user.id);
      
      const feedAnns = anns.filter(a => a.recipients === 'all' || a.recipients === 'mentors' || a.createdById === user.id || myTeams.some(t => a.recipients === 'team-' + t.id));

      ITE.App.pc().innerHTML = `
<div class="page-header" style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:14px">
  <div><div class="page-title">Announcements</div><div class="page-subtitle">View and distribute announcements to assigned teams</div></div>
  <button class="btn btn-primary" onclick="ITE.Pages.Mentor.showMentorAnnModal()">New Announcement</button>
</div>
<div class="two-col">
  <div>
    <div class="section-title">Feed (${feedAnns.length})</div>
    ${feedAnns.length===0?`<div class="empty-state card"><h3>No announcements</h3></div>`:
    feedAnns.map(a=>`<div class="ann-card ${a.createdByRole}-ann"><div class="ann-meta"><span class="badge ${a.createdByRole==='admin'?'badge-blue':'badge-green'}">${a.createdByRole.toUpperCase()}</span><span style="font-size:.72rem;color:var(--text-muted)">${a.createdByName}</span></div><div class="ann-title">${a.title}</div><div class="ann-body">${a.body||a.content||''}</div><div class="ann-date">${new Date(a.createdAt).toLocaleString('en-IN')}</div></div>`).join('')}
  </div>
  <div>
    <div class="section-title">My Teams</div>
    ${myTeams.map(t=>`<div class="card" style="margin-bottom:10px"><div style="font-weight:600;margin-bottom:4px">${t.startupName}</div><div style="font-size:.8rem;color:var(--text-muted)">Stage ${(t.stage||0)+1}: ${ITE.App.STAGES[t.stage||0]?.label} · ${t.members.length} members</div><div class="mini-progress" style="margin-top:8px">${ITE.App.STAGES.map((_,i)=>`<div class="mini-step ${i<(t.stage||0)?'done':i===(t.stage||0)?'active':''}"></div>`).join('')}</div></div>`).join('')}
  </div>
</div>`;
    } catch(err) {
      ITE.App.pc().innerHTML = `<div style="color:red; padding:20px; background:white;">Error: ${err.message}</div>`;
    }
  }

  async function showMentorAnnModal() {
    try {
      const user = ITE.Auth.getCurrentUser();
      const teams = await ITE.API.get('/teams');
      const myTeams = teams.filter(t => t.mentorId === user.id);
      
      ITE.App.showModal(`<div class="modal">
<div class="modal-header"><div class="modal-title">New Announcement</div><button class="modal-close btn">✕</button></div>
<div class="modal-body">
  <div class="form-group"><label class="form-label">Title</label><input id="ma-title" class="form-control" placeholder="Announcement title…"></div>
  <div class="form-group"><label class="form-label">Message</label><textarea id="ma-body" class="form-control" rows="4" placeholder="Write announcement content…"></textarea></div>
  <div class="form-group"><label class="form-label">Send To</label><select id="ma-to" class="form-control">${myTeams.map(t=>`<option value="team-${t.id}">Team: ${t.startupName}</option>`).join('')}</select></div>
</div>
<div class="modal-footer"><button class="btn btn-ghost" onclick="ITE.App.closeModal()">Cancel</button><button class="btn btn-primary" onclick="ITE.Pages.Mentor._submitMentorAnn()">Send</button></div>
</div>`);
    } catch(err) {
      ITE.App.toast('Failed to load teams for announcement', 'error');
    }
  }

  async function _submitMentorAnn() {
    const title = document.getElementById('ma-title')?.value?.trim();
    const content = document.getElementById('ma-body')?.value?.trim();
    const recipients = document.getElementById('ma-to')?.value;
    if(!title||!content){ITE.App.toast('Title & message required.','error');return;}
    
    try {
      const user = ITE.Auth.getCurrentUser();
      await ITE.API.post('/announcements', {
        title, body: content, recipients, teamId: recipients.replace('team-', ''),
        createdByRole: 'mentor',
        createdByName: user.name,
      });
      ITE.App.toast('Announcement sent!','success'); 
      ITE.App.closeModal(); 
      renderAnnouncements();
    } catch (err) {
      ITE.App.toast(err.message, 'error');
    }
  }

  function showAssignTaskModal(teamId, scope) {
    const title = scope === 'all-my-teams' ? 'Assign Task to All My Teams' : 'Assign Task to Team';
    const submitCall = `ITE.Pages.Mentor._submitMentorTask('${teamId || ''}', '${scope}')`;
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const defaultDate = nextWeek.toISOString().split('T')[0];

    ITE.App.showModal(`<div class="modal">
<div class="modal-header"><div class="modal-title">${title}</div><button class="modal-close btn">✕</button></div>
<div class="modal-body">
  <div class="form-group"><label class="form-label">Task Title *</label><input id="mt-title" class="form-control" placeholder="e.g. Design Wireframes"></div>
  <div class="form-group"><label class="form-label">Description</label><textarea id="mt-desc" class="form-control" rows="3" placeholder="Describe the expectations, deliverables, and guidelines…"></textarea></div>
  <div class="form-group"><label class="form-label">Due Date *</label><input type="date" id="mt-due" class="form-control" value="${defaultDate}"></div>
  <div class="form-group"><label class="form-label">Venture Stage Connection</label><select id="mt-stage" class="form-control"><option value="">None</option>${ITE.App.STAGES.map((s,i)=>`<option value="${i}">Stage ${i+1}: ${s.label}</option>`).join('')}</select></div>
</div>
<div class="modal-footer"><button class="btn btn-ghost" onclick="ITE.App.closeModal()">Cancel</button><button class="btn btn-primary" onclick="${submitCall}">Assign Task</button></div>
</div>`);
  }

  async function _submitMentorTask(teamId, scope) {
    const title = document.getElementById('mt-title')?.value?.trim();
    const description = document.getElementById('mt-desc')?.value?.trim();
    const dueDate = document.getElementById('mt-due')?.value;
    const stageVal = document.getElementById('mt-stage')?.value;
    const stage = stageVal !== "" ? parseInt(stageVal) : null;

    if (!title || !dueDate) {
      ITE.App.toast('Title and due date are required.', 'error');
      return;
    }

    try {
      await ITE.API.post('/mentor/tasks', {
        title,
        description,
        dueDate,
        stage,
        teamId: scope === 'all-my-teams' ? null : teamId,
        scope
      });
      ITE.App.toast('Task(s) assigned successfully!', 'success');
      ITE.App.closeModal();
      renderTeams();
    } catch (err) {
      ITE.App.toast(err.message, 'error');
    }
  }

  async function renderTasks() {
    ITE.App.pc().innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading tasks overview...</div>`;
    try {
      const user = ITE.Auth.getCurrentUser();
      const [tasks, submissions, teams, students] = await Promise.all([
        ITE.API.get('/tasks'),
        ITE.API.get('/submissions'),
        ITE.API.get('/teams'),
        ITE.API.get('/users/students')
      ]);

      // Filter tasks assigned by this mentor
      const myTasks = tasks.filter(t => t.createdById === user.id);
      
      // Determine completion status for each task
      const tasksWithStatus = myTasks.map(t => {
        const sub = submissions.find(s => s.taskId === t.id);
        const team = teams.find(tm => tm.id === t.teamId);
        const student = sub ? students.find(s => s.id === sub.studentId) : null;
        return {
          ...t,
          submission: sub,
          teamName: team ? team.startupName : 'General / Unknown Team',
          studentName: student ? student.name : 'Unknown Student'
        };
      });

      const totalAssigned = tasksWithStatus.length;
      const completedCount = tasksWithStatus.filter(t => !!t.submission).length;
      const completionRate = totalAssigned ? Math.round((completedCount / totalAssigned) * 100) : 0;

      ITE.App.pc().innerHTML = `
<div class="page-header" style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:14px">
  <div><div class="page-title">Tasks Management</div><div class="page-subtitle">Track tasks assigned to your startups</div></div>
  <button class="btn btn-primary" onclick="ITE.Pages.Mentor.showAssignTaskModal(null, 'all-my-teams')">Assign New Task</button>
</div>

<div class="stats-grid" style="margin-bottom:24px">
  <div class="stat-card" style="--c:#2563EB"><div class="stat-value">${totalAssigned}</div><div class="stat-label">Tasks Assigned</div></div>
  <div class="stat-card" style="--c:#10B981"><div class="stat-value">${completedCount}</div><div class="stat-label">Completed Tasks</div></div>
  <div class="stat-card" style="--c:#8B5CF6"><div class="stat-value">${completionRate}%</div><div class="stat-label">Completion Rate</div></div>
</div>

<div class="card" style="margin-bottom:24px">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
    <span style="font-size:.875rem;color:var(--text-secondary)">Task Completion Progress</span>
    <span style="font-weight:700">${completionRate}%</span>
  </div>
  <div class="analytics-bar-track" style="height:10px"><div class="analytics-bar-fill" style="width:${completionRate}%"></div></div>
</div>

<div class="section-title">Assigned Tasks</div>
${tasksWithStatus.length === 0 ? `
<div class="empty-state card">
  <h3>No tasks assigned yet</h3>
  <p>Assign tasks to your startups to track their validation and development progress.</p>
</div>` : `
<div style="display:grid;gap:16px">
  ${tasksWithStatus.map(t => {
    const done = !!t.submission;
    const stageLabel = t.stage !== null && t.stage !== undefined ? `Stage ${t.stage + 1}: ${ITE.App.STAGES[t.stage]?.label}` : null;
    return `
<div class="task-card" style="display:flex;gap:16px;padding:20px;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md)">
  <div class="task-check ${done ? 'done' : ''}" style="margin-top:2px"></div>
  <div style="flex:1">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">
      <div>
        <h3 class="task-title" style="font-size:1.05rem;font-weight:700;margin-bottom:4px">${t.title}</h3>
        <div style="font-size:.8rem;color:var(--text-muted);margin-bottom:8px">Assigned to: <strong style="color:var(--text-primary)">${t.teamName}</strong></div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        ${stageLabel ? `<span class="badge badge-blue">${stageLabel}</span>` : ''}
        ${done ? `<span class="badge badge-green">Completed</span>` : `<span class="badge badge-yellow">Pending</span>`}
      </div>
    </div>
    <p class="task-desc" style="font-size:.875rem;color:var(--text-secondary);line-height:1.5;margin-bottom:12px">${t.description || 'No description provided.'}</p>
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div style="font-size:.8rem;color:var(--text-muted)">Due Date: ${new Date(t.dueDate).toLocaleDateString('en-IN')}</div>
      ${done ? `
        <button class="btn btn-primary btn-sm" onclick="ITE.Pages.Mentor.showViewSubmissionModal('${t.submission.id}', '${t.title.replace(/'/g, "\\'")}')">View Submission</button>
      ` : ''}
    </div>
  </div>
</div>`;
  }).join('')}
</div>`}
`;
    } catch (err) {
      ITE.App.pc().innerHTML = `<div style="color:red; padding:20px; background:white;">Error: ${err.message}</div>`;
    }
  }

  async function showViewSubmissionModal(subId, taskTitle) {
    try {
      const submissions = await ITE.API.get('/submissions');
      const sub = submissions.find(s => s.id === subId);
      if (!sub) {
        ITE.App.toast('Submission not found', 'error');
        return;
      }
      const students = await ITE.API.get('/users/students');
      const student = students.find(s => s.id === sub.studentId);
      const studentName = student ? student.name : 'Unknown Student';
      const studentRoll = student ? student.rollNo : '';

      const isViewed = sub.status === 'graded' || sub.status === 'viewed' || sub.grade === 'Viewed';

      ITE.App.showModal(`<div class="modal modal-lg">
<div class="modal-header"><div class="modal-title">Submission: ${taskTitle}</div><button class="modal-close btn">✕</button></div>
<div class="modal-body">
  <div style="display:grid;gap:14px">
    <div style="padding:12px;background:var(--bg-secondary);border-radius:var(--radius-sm)">
      <div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);margin-bottom:4px">Submitted By</div>
      <div style="font-weight:600;font-size:.9rem">${studentName} ${studentRoll ? `(${studentRoll})` : ''}</div>
      <div style="font-size:.75rem;color:var(--text-muted);margin-top:2px">Submitted: ${new Date(sub.submittedAt).toLocaleString('en-IN')}</div>
    </div>
    <div>
      <div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);margin-bottom:6px">Submission Content</div>
      <p style="font-size:.9rem;line-height:1.6;color:var(--text-secondary);white-space:pre-wrap;padding:12px;border:1px solid var(--border-subtle);border-radius:var(--radius-sm);background:var(--bg-card)">${sub.content}</p>
    </div>
    ${isViewed ? `
      <div style="padding:10px;background:var(--success-light);border-radius:var(--radius-sm);font-size:.85rem;color:var(--success);font-weight:600">✓ Marked as Viewed</div>
    ` : ''}
  </div>
</div>
<div class="modal-footer">
  <button class="btn btn-ghost" onclick="ITE.App.closeModal()">Close</button>
  ${!isViewed ? `
    <button class="btn btn-primary" onclick="ITE.Pages.Mentor._submitGrade('${sub.id}')">Mark as Viewed</button>
  ` : ''}
</div>
</div>`);
    } catch (err) {
      ITE.App.toast('Failed to load submission details', 'error');
    }
  }

  async function _submitGrade(subId) {
    try {
      await ITE.API.patch(`/submissions/${subId}/grade`, {
        grade: 'Viewed',
        feedback: ''
      });
      ITE.App.toast('Submission marked as viewed.', 'success');
      ITE.App.closeModal();
      renderTasks();
    } catch (err) {
      ITE.App.toast(err.message, 'error');
    }
  }

  return {
    renderDashboard, renderTeams, renderAnnouncements, renderTasks,
    showTeamDetail, showAssignCEO, _submitCEO, _advanceStage,
    showMentorAnnModal, _submitMentorAnn,
    showAssignTaskModal, _submitMentorTask,
    showViewSubmissionModal, _submitGrade,
  };
})();
