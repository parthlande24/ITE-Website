/* =====================================================
   ITE STARTUP LAUNCH PAD – DATA LAYER (data.js)
   localStorage-backed data store with full seed data
   ===================================================== */
window.ITE = window.ITE || {};

ITE.Data = (function () {
  const K = {
    users: 'ite_users', approved: 'ite_approved', teams: 'ite_teams',
    announcements: 'ite_announcements', tasks: 'ite_tasks',
    submissions: 'ite_submissions', invitations: 'ite_invitations',
    prevStartups: 'ite_prev_startups', init: 'ite_initialized',
  };

  const get = (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } };
  const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

  /* ---- Seed ---- */
  function seed() {
    // One-time data upgrade for real campus startups
    if (!localStorage.getItem('ite_prev_startups_v4')) {
      const prevStartups = [
        {
          id: uid(),
          name: 'Lucid Implants',
          tagline: 'Advanced medical implant solutions',
          description: 'Lucid Implants develops advanced medical implant solutions, leveraging engineering expertise to improve patient outcomes and push the boundaries of biomedical innovation.',
          founder: 'Dr. Pranav Sapkal',
          industry: 'Healthcare',
          emoji: '🩺',
          color: '#2563EB',
          batch: '2021',
          team: 'Dr. Pranav Sapkal',
          achievement: 'Biomedical Innovation Leader',
          members: ['Dr. Pranav Sapkal'],
          stage: 'Operating',
          logoText: 'LUCID',
          logoUrl: 'assets/lucid_logo.png'
        },
        {
          id: uid(),
          name: 'DonateKart',
          tagline: 'India\'s leading crowdfunding and donation platform for social causes',
          description: 'DonateKart is India\'s leading crowdfunding and donation platform for social causes, connecting generous donors with verified NGOs and grassroots initiatives across the country.',
          founder: 'Anil Kumar Reddy & Sandeep Sharma',
          industry: 'Social Commerce',
          emoji: '🧡',
          color: '#FF5A00',
          batch: '2016',
          team: 'Anil Kumar Reddy & Sandeep Sharma',
          achievement: 'Crowdfunding Leader',
          members: ['Anil Kumar Reddy', 'Sandeep Sharma'],
          stage: 'Operating',
          logoText: 'DONATE KART',
          logoUrl: 'assets/donatekart_logo.png'
        },
        {
          id: uid(),
          name: 'Bookstaken',
          tagline: 'Transforming how readers discover, share, and engage with books',
          description: 'Bookstaken is a platform aimed at transforming how readers discover, share, and engage with books, making literary experiences more accessible and community-driven.',
          founder: 'Dhiraj Bodade',
          industry: 'EdTech',
          emoji: '📚',
          color: '#0EA5E9',
          batch: '2023',
          team: 'Dhiraj Bodade',
          achievement: 'Community-Driven Reading Platform',
          members: ['Dhiraj Bodade'],
          stage: 'Operating',
          logoText: 'Bookstaken',
          logoUrl: 'assets/bookstaken_logo.png'
        },
        {
          id: uid(),
          name: 'Kein',
          tagline: 'Video-first social commerce platform',
          description: 'Kein is a video-first social commerce platform that helps customers discover products through influencers and live sellers, moving beyond traditional product listings and reviews.',
          founder: 'Prashant',
          industry: 'E-Commerce',
          emoji: '🛍️',
          color: '#10B981',
          batch: '2024',
          team: 'Prashant',
          achievement: 'Video-First E-Commerce Innovator',
          members: ['Prashant'],
          stage: 'Operating',
          logoText: 'Kein',
          logoUrl: 'assets/kein_logo.png'
        },
        {
          id: uid(),
          name: 'Atyant',
          tagline: 'Student-led campus innovation solutions from VNIT',
          description: 'Atyant is a student-led startup from VNIT focused on innovative solutions, representing the next generation of entrepreneurship emerging directly from the campus ecosystem.',
          founder: 'Nitin Rai',
          industry: 'Smart Cities',
          emoji: '🚀',
          color: '#8B5CF6',
          batch: '2025',
          team: 'Nitin Rai',
          achievement: 'VNIT Incubation Program',
          members: ['Nitin Rai (Current VNIT Student)'],
          stage: 'Operating',
          logoText: 'अत्यanT',
          logoUrl: 'assets/atyant_logo.png'
        }
      ];
      localStorage.setItem('ite_prev_startups', JSON.stringify(prevStartups));
      localStorage.setItem('ite_prev_startups_v4', 'true');
    }

    if (get(K.init)) return;

    const aId1 = uid(), aId2 = uid();
    const m1 = uid(), m2 = uid();
    const s = Array.from({length:10}, () => uid());
    const [s1,s2,s3,s4,s5,s6,s7,s8,s9,s10] = s;
    const t1 = uid(), t2 = uid();

    const users = [
      {id:aId1,email:'admin@vnit.ac.in',password:'admin123',role:'admin',name:'Prof. Anand Chaturvedi',avatar:'AC',profileComplete:true,createdAt:'2024-06-01'},
      {id:aId2,email:'mentor-admin@vnit.ac.in',password:'mentor123',role:'admin',name:'Coordinator Admin',avatar:'CA',profileComplete:true,createdAt:'2024-06-01'},
      {id:m1,email:'dr.sharma@vnit.ac.in',password:'mentor123',role:'mentor',name:'Dr. Ravi Sharma',avatar:'RS',specialization:'Product & Market Strategy',profileComplete:true,assignedTeams:[t1],createdAt:'2024-06-01'},
      {id:m2,email:'dr.patel@vnit.ac.in',password:'mentor123',role:'mentor',name:'Dr. Priya Patel',avatar:'PP',specialization:'Finance & Operations',profileComplete:true,assignedTeams:[t2],createdAt:'2024-06-01'},
      {id:s1,email:'aarav.mehta@students.vnit.ac.in',password:'student123',role:'student',name:'Aarav Mehta',avatar:'AM',rollNo:'24BCE001',branch:'Computer Science',skills:['Python','ML','Business Strategy'],interests:['AgriTech','IoT'],teamId:t1,teamRole:'CEO',isCEO:true,profileComplete:true,mentorId:m1,createdAt:'2024-06-10'},
      {id:s2,email:'diya.singh@students.vnit.ac.in',password:'student123',role:'student',name:'Diya Singh',avatar:'DS',rollNo:'24BCE002',branch:'Electronics',skills:['React','Node.js','System Design'],interests:['SaaS','EdTech'],teamId:t1,teamRole:'CTO',profileComplete:true,mentorId:m1,createdAt:'2024-06-10'},
      {id:s3,email:'rohan.kumar@students.vnit.ac.in',password:'student123',role:'student',name:'Rohan Kumar',avatar:'RK',rollNo:'24BCE003',branch:'Mechanical',skills:['Financial Modeling','Excel'],interests:['Fintech'],teamId:t1,teamRole:'CFO',profileComplete:true,mentorId:m1,createdAt:'2024-06-10'},
      {id:s4,email:'ananya.iyer@students.vnit.ac.in',password:'student123',role:'student',name:'Ananya Iyer',avatar:'AI',rollNo:'24BCE004',branch:'Chemical',skills:['Marketing','Social Media'],interests:['Branding'],teamId:t1,teamRole:'CMO',profileComplete:true,mentorId:m1,createdAt:'2024-06-10'},
      {id:s5,email:'karan.joshi@students.vnit.ac.in',password:'student123',role:'student',name:'Karan Joshi',avatar:'KJ',rollNo:'24BCE005',branch:'Electrical',skills:['Leadership','Data Analysis'],interests:['EdTech'],teamId:t2,teamRole:'CEO',isCEO:true,profileComplete:true,mentorId:m2,createdAt:'2024-06-10'},
      {id:s6,email:'nisha.verma@students.vnit.ac.in',password:'student123',role:'student',name:'Nisha Verma',avatar:'NV',rollNo:'24BCE006',branch:'Computer Science',skills:['Full Stack','AI/ML'],interests:['EdTech'],teamId:t2,teamRole:'CTO',profileComplete:true,mentorId:m2,createdAt:'2024-06-10'},
      {id:s7,email:'arjun.nair@students.vnit.ac.in',password:'student123',role:'student',name:'Arjun Nair',avatar:'AN',rollNo:'24BCE007',branch:'Civil',skills:['Finance','Fundraising'],interests:['Fintech'],teamId:t2,teamRole:'CFO',profileComplete:true,mentorId:m2,createdAt:'2024-06-10'},
      {id:s8,email:'pooja.desai@students.vnit.ac.in',password:'student123',role:'student',name:'Pooja Desai',avatar:'PD',rollNo:'24BCE008',branch:'Chemical',skills:['UI/UX','Figma'],interests:['HealthTech'],teamId:null,teamRole:null,profileComplete:true,mentorId:null,createdAt:'2024-06-10'},
      {id:s9,email:'vikram.rao@students.vnit.ac.in',password:'student123',role:'student',name:'Vikram Rao',avatar:'VR',rollNo:'24BCE009',branch:'Mechanical',skills:['IoT','Embedded'],interests:['AgriTech'],teamId:null,teamRole:null,profileComplete:true,mentorId:null,createdAt:'2024-06-10'},
      {id:s10,email:'priya.gupta@students.vnit.ac.in',password:'student123',role:'student',name:'Priya Gupta',avatar:'PG',rollNo:'24BCE010',branch:'Electronics',skills:['Marketing Analytics'],interests:['Consumer Tech'],teamId:null,teamRole:null,profileComplete:true,mentorId:null,createdAt:'2024-06-10'},
    ];

    const approved = [
      {name:'Aarav Mehta',rollNo:'24BCE001',email:'aarav.mehta@students.vnit.ac.in'},
      {name:'Diya Singh',rollNo:'24BCE002',email:'diya.singh@students.vnit.ac.in'},
      {name:'Rohan Kumar',rollNo:'24BCE003',email:'rohan.kumar@students.vnit.ac.in'},
      {name:'Ananya Iyer',rollNo:'24BCE004',email:'ananya.iyer@students.vnit.ac.in'},
      {name:'Karan Joshi',rollNo:'24BCE005',email:'karan.joshi@students.vnit.ac.in'},
      {name:'Nisha Verma',rollNo:'24BCE006',email:'nisha.verma@students.vnit.ac.in'},
      {name:'Arjun Nair',rollNo:'24BCE007',email:'arjun.nair@students.vnit.ac.in'},
      {name:'Pooja Desai',rollNo:'24BCE008',email:'pooja.desai@students.vnit.ac.in'},
      {name:'Vikram Rao',rollNo:'24BCE009',email:'vikram.rao@students.vnit.ac.in'},
      {name:'Priya Gupta',rollNo:'24BCE010',email:'priya.gupta@students.vnit.ac.in'},
    ];

    const teams = [
      {id:t1,startupName:'AgriTech Connect',problemStatement:'Small farmers lack real-time market data...',solution:'A mobile app providing direct market links and weather alerts.',industry:'Agriculture',stage:2,ceoId:s1,mentorId:m1,members:[{userId:s1,teamRole:'CEO',isCEO:true},{userId:s2,teamRole:'CTO',isCEO:false},{userId:s3,teamRole:'CFO',isCEO:false},{userId:s4,teamRole:'CMO',isCEO:false}],createdAt:'2024-06-10'},
      {id:t2,startupName:'EduBridge',problemStatement:'Students in tier-2 cities lack quality education...',solution:'Personalized adaptive online learning platforms.',industry:'Education',stage:4,ceoId:s5,mentorId:m2,members:[{userId:s5,teamRole:'CEO',isCEO:true},{userId:s6,teamRole:'CTO',isCEO:false},{userId:s7,teamRole:'CFO',isCEO:false}],createdAt:'2024-06-10'},
    ];

    const ann1 = uid(), ann2 = uid(), ann3 = uid(), ann4 = uid(), ann5 = uid();
    const announcements = [
      {id:ann1,title:'🎉 Welcome to ITE 2024-25!',content:'The ITE program officially kicks off! All sessions will be held on Tuesdays and Fridays 4-6 PM in Seminar Hall A. Please complete your profile on the platform.',createdBy:aId1,createdByName:'Prof. Anand Chaturvedi',createdByRole:'admin',recipients:'all-students',createdAt:'2024-07-01'},
      {id:ann2,title:'📋 Mentor Assignments Complete',content:'All student teams have been assigned mentors. Check your dashboard for your mentor\'s details. First mentor meeting is scheduled for next week.',createdBy:aId1,createdByName:'Prof. Anand Chaturvedi',createdByRole:'admin',recipients:'all-students',createdAt:'2024-07-05'},
      {id:ann3,title:'📊 Market Research Deadline',content:'Team AgriTech Connect – Please submit your Market Research Report by Friday. Include at least 50 survey responses and a competitive analysis. Reach out if you need help.',createdBy:m1,createdByName:'Dr. Ravi Sharma',createdByRole:'mentor',recipients:'team-'+t1,createdAt:'2024-07-10'},
      {id:ann4,title:'🚀 MVP Showcase – August 15th',content:'All teams must have a working prototype ready for the MVP Showcase on August 15th. Faculty and industry judges will be present. Business casual dress code.',createdBy:aId1,createdByName:'Prof. Anand Chaturvedi',createdByRole:'admin',recipients:'all-students',createdAt:'2024-07-15'},
      {id:ann5,title:'💡 Customer Interview Template',content:'EduBridge team – I have shared a customer interview template. Please conduct at least 20 interviews before our next session. Focus on pain points, not solutions.',createdBy:m2,createdByName:'Dr. Priya Patel',createdByRole:'mentor',recipients:'team-'+t2,createdAt:'2024-07-12'},
    ];

    const tk = Array.from({length:5}, () => uid());
    const tasks = [
      {id:tk[0],title:'Problem Statement Submission',description:'Write a clear problem statement (max 200 words) identifying the real-world problem your startup solves. Include who is affected and the scale of the problem.',dueDate:'2024-07-30',category:'Foundation',createdBy:aId1,createdAt:'2024-07-01'},
      {id:tk[1],title:'Market Research Report',description:'Conduct comprehensive market research covering TAM, target segments, competitive landscape, and primary research (min. 30 responses).',dueDate:'2024-08-15',category:'Research',createdBy:aId1,createdAt:'2024-07-05'},
      {id:tk[2],title:'Customer Interview Summary',description:'Conduct at least 20 customer interviews. Submit a structured summary covering key pain points, validated/invalidated assumptions, and pivots made.',dueDate:'2024-08-30',category:'Validation',createdBy:aId1,createdAt:'2024-07-10'},
      {id:tk[3],title:'MVP Prototype Submission',description:'Submit a working prototype or clickable mockup. Include a 3-minute demo video and README explaining how to run it.',dueDate:'2024-09-15',category:'Development',createdBy:aId1,createdAt:'2024-07-15'},
      {id:tk[4],title:'Pitch Deck Submission',description:'Create a 10-12 slide pitch deck covering Problem, Solution, Market Size, Business Model, Traction, Team, Financial Projections, and Funding Ask.',dueDate:'2024-09-30',category:'Pitching',createdBy:aId1,createdAt:'2024-07-20'},
    ];

    const submissions = [
      {id:uid(),taskId:tk[0],studentId:s1,content:'Small farmers lack real-time market data...',submittedAt:'2024-07-28',grade:'A'},
      {id:uid(),taskId:tk[0],studentId:s5,content:'Students in tier-2 cities lack quality education...',submittedAt:'2024-07-27',grade:'A+'},
      {id:uid(),taskId:tk[1],studentId:s1,content:'AgriTech market research – TAM ₹12,000 Cr...',submittedAt:'2024-08-14',grade:'B+'},
      {id:uid(),taskId:tk[1],studentId:s5,content:'EdTech 250M K-12 students in India...',submittedAt:'2024-08-12',grade:'A'},
      {id:uid(),taskId:tk[2],studentId:s5,content:'20 customer interviews – key pain: high cost...',submittedAt:'2024-08-29',grade:'A-'},
      {id:uid(),taskId:tk[3],studentId:s5,content:'EduBridge MVP – adaptive quiz engine live...',submittedAt:'2024-09-14',grade:'A'},
    ];

    const prevStartups = [
      {
        id: uid(),
        name: 'Lucid Implants',
        tagline: 'Advanced medical implant solutions',
        description: 'Lucid Implants develops advanced medical implant solutions, leveraging engineering expertise to improve patient outcomes and push the boundaries of biomedical innovation.',
        founder: 'Dr. Pranav Sapkal',
        industry: 'Healthcare',
        emoji: '🩺',
        color: '#2563EB',
        batch: '2021',
        team: 'Dr. Pranav Sapkal',
        achievement: 'Biomedical Innovation Leader',
        members: ['Dr. Pranav Sapkal'],
        stage: 'Operating',
        logoText: 'LUCID',
        logoUrl: 'assets/lucid_logo.png'
      },
      {
        id: uid(),
        name: 'DonateKart',
        tagline: 'India\'s leading crowdfunding and donation platform for social causes',
        description: 'DonateKart is India\'s leading crowdfunding and donation platform for social causes, connecting generous donors with verified NGOs and grassroots initiatives across the country.',
        founder: 'Anil Kumar Reddy & Sandeep Sharma',
        industry: 'Social Commerce',
        emoji: '🧡',
        color: '#FF5A00',
        batch: '2016',
        team: 'Anil Kumar Reddy & Sandeep Sharma',
        achievement: 'Crowdfunding Leader',
        members: ['Anil Kumar Reddy', 'Sandeep Sharma'],
        stage: 'Operating',
        logoText: 'DONATE KART',
        logoUrl: 'assets/donatekart_logo.png'
      },
      {
        id: uid(),
        name: 'Bookstaken',
        tagline: 'Transforming how readers discover, share, and engage with books',
        description: 'Bookstaken is a platform aimed at transforming how readers discover, share, and engage with books, making literary experiences more accessible and community-driven.',
        founder: 'Dhiraj Bodade',
        industry: 'EdTech',
        emoji: '📚',
        color: '#0EA5E9',
        batch: '2023',
        team: 'Dhiraj Bodade',
        achievement: 'Community-Driven Reading Platform',
        members: ['Dhiraj Bodade'],
        stage: 'Operating',
        logoText: 'Bookstaken',
        logoUrl: 'assets/bookstaken_logo.png'
      },
      {
        id: uid(),
        name: 'Kein',
        tagline: 'Video-first social commerce platform',
        description: 'Kein is a video-first social commerce platform that helps customers discover products through influencers and live sellers, moving beyond traditional product listings and reviews.',
        founder: 'Prashant',
        industry: 'E-Commerce',
        emoji: '🛍️',
        color: '#10B981',
        batch: '2024',
        team: 'Prashant',
        achievement: 'Video-First E-Commerce Innovator',
        members: ['Prashant'],
        stage: 'Operating',
        logoText: 'Kein',
        logoUrl: 'assets/kein_logo.png'
      },
      {
        id: uid(),
        name: 'Atyant',
        tagline: 'Student-led campus innovation solutions from VNIT',
        description: 'Atyant is a student-led startup from VNIT focused on innovative solutions, representing the next generation of entrepreneurship emerging directly from the campus ecosystem.',
        founder: 'Nitin Rai',
        industry: 'Smart Cities',
        emoji: '🚀',
        color: '#8B5CF6',
        batch: '2025',
        team: 'Nitin Rai',
        achievement: 'VNIT Incubation Program',
        members: ['Nitin Rai (Current VNIT Student)'],
        stage: 'Operating',
        logoText: 'अत्यanT',
        logoUrl: 'assets/atyant_logo.png'
      }
    ];

    set(K.users, users); set(K.approved, approved); set(K.teams, teams);
    set(K.announcements, announcements); set(K.tasks, tasks);
    set(K.submissions, submissions); set(K.invitations, []);
    set(K.prevStartups, prevStartups); set(K.init, true);
  }

  /* ---- Users ---- */
  const getUsers  = () => {
    const users = get(K.users) || [];
    const teams = get(K.teams) || [];
    return users.map(u => {
      if (u && u.role === 'mentor') u.assignedTeams = teams.filter(t => t.mentorId === u.id).map(t => t.id);
      return u;
    });
  };
  const saveUsers = (u) => set(K.users, u);
  const getUserById    = (id) => getUsers().find(u => u.id === id) || null;
  const getUserByEmail = (e)  => getUsers().find(u => u.email.toLowerCase() === e.toLowerCase()) || null;
  function createUser(data) { const us = getUsers(); const u = {id:uid(), createdAt: new Date().toISOString(), ...data}; us.push(u); saveUsers(us); return u; }
  function updateUser(id, upd) { const us = getUsers(); const i = us.findIndex(u => u.id === id); if (i<0) return null; us[i]={...us[i],...upd}; saveUsers(us); return us[i]; }
  function deleteUser(id) { saveUsers(getUsers().filter(u => u.id !== id)); }
  const getMentors  = () => getUsers().filter(u => u.role === 'mentor');
  const getStudents = () => getUsers().filter(u => u.role === 'student');

  /* ---- Approved Students ---- */
  const getApproved    = () => get(K.approved) || [];
  const saveApproved   = (a) => set(K.approved, a);
  const isApproved     = (email) => getApproved().some(s => s.email.toLowerCase() === email.toLowerCase());

  /* ---- Teams ---- */
  const getTeams  = () => get(K.teams) || [];
  const saveTeams = (t) => set(K.teams, t);
  const getTeamById = (id) => getTeams().find(t => t.id === id) || null;
  function createTeam(data) { const ts = getTeams(); const t = {id:uid(), stage:0, createdAt: new Date().toISOString(), ...data}; ts.push(t); saveTeams(ts); return t; }
  function updateTeam(id, upd) { const ts = getTeams(); const i = ts.findIndex(t => t.id === id); if (i<0) return null; ts[i]={...ts[i],...upd}; saveTeams(ts); return ts[i]; }

  /* ---- Announcements ---- */
  const getAnnouncements  = () => get(K.announcements) || [];
  const saveAnnouncements = (a) => set(K.announcements, a);
  function createAnnouncement(data) { const list = getAnnouncements(); const item = {id:uid(), createdAt: new Date().toISOString(), ...data}; list.unshift(item); saveAnnouncements(list); return item; }
  function deleteAnnouncement(id) { saveAnnouncements(getAnnouncements().filter(a => a.id !== id)); }
  function getAnnouncementsForUser(user) {
    const all = getAnnouncements();
    if (user.role === 'admin') return all;
    if (user.role === 'mentor') return all.filter(a => a.recipients === 'all-mentors' || a.createdBy === user.id || (user.assignedTeams||[]).some(tid => a.recipients === 'team-'+tid));
    if (user.role === 'student') return all.filter(a => a.recipients === 'all-students' || (user.teamId && a.recipients === 'team-'+user.teamId));
    return [];
  }

  /* ---- Tasks ---- */
  const getTasks  = () => get(K.tasks) || [];
  const saveTasks = (t) => set(K.tasks, t);
  function createTask(data) { const ts = getTasks(); const t = {id:uid(), createdAt: new Date().toISOString(), ...data}; ts.unshift(t); saveTasks(ts); return t; }
  function deleteTask(id) { saveTasks(getTasks().filter(t => t.id !== id)); }

  /* ---- Submissions ---- */
  const getSubmissions = () => get(K.submissions) || [];
  const saveSubmissions = (s) => set(K.submissions, s);
  const getSubByStudentTask = (sId, tId) => getSubmissions().find(s => s.studentId === sId && s.taskId === tId) || null;
  function createSubmission(data) { const ss = getSubmissions(); const s = {id:uid(), submittedAt: new Date().toISOString(), ...data}; ss.push(s); saveSubmissions(ss); return s; }

  /* ---- Invitations ---- */
  const getInvitations  = () => get(K.invitations) || [];
  const saveInvitations = (i) => set(K.invitations, i);
  function createInvitation(data) { const inv = getInvitations(); const item = {id:uid(), status:'pending', createdAt: new Date().toISOString(), ...data}; inv.push(item); saveInvitations(inv); return item; }
  function updateInvitation(id, upd) { const inv = getInvitations(); const i = inv.findIndex(x => x.id === id); if (i<0) return null; inv[i]={...inv[i],...upd}; saveInvitations(inv); return inv[i]; }
  const getPendingInvites = (userId) => getInvitations().filter(i => i.toUserId === userId && i.status === 'pending');

  /* ---- Previous Startups ---- */
  const getPrevStartups = () => get(K.prevStartups) || [];

  return {
    init: seed, uid,
    getUsers, getUserById, getUserByEmail, createUser, updateUser, deleteUser, getMentors, getStudents,
    getApproved, saveApproved, isApproved,
    getTeams, getTeamById, createTeam, updateTeam,
    getAnnouncements, createAnnouncement, deleteAnnouncement, getAnnouncementsForUser,
    getTasks, createTask, deleteTask,
    getSubmissions, getSubByStudentTask, createSubmission,
    getInvitations, createInvitation, updateInvitation, getPendingInvites,
    getPrevStartups,
  };
})();
