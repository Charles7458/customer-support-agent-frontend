import { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { TicketDetailPanel } from '../components/TicketDetailPanel';
import { Dialog } from '../components/Dialog';
import { Badge, Avatar, PriorityIcon, Button } from '../components/ui';
import type { Ticket, CreateTicketRequest, CreateTicketRequestSupport, MessageRole, TicketPriority, TicketStatus } from '../types';
import { cn } from '../utils/cn';
import { useAuth } from '../hooks/useAuth22';
import { NavLink } from 'react-router-dom';
import { CreateTicketDialog } from '../components/CreateTicketDialog';
import Pagination from '../components/Pagination';
import { TicketUpdateDialog } from '../components/TicketUpdateDialog';
import AIResponseDialog from '../components/AIResponseDialog';

// ─── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="6.5" cy="6.5" r="5.5" /><path d="M13 13l-3-3" />
  </svg>
);
const ChevronIcon = () => (
  <svg width="7" height="4" viewBox="0 0 7 4" fill="none">
    <path d="M1 1l2.5 2L6 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const PlusIcon = () => (
  <svg width="10.5" height="10.5" viewBox="0 0 11 11" fill="none">
    <path d="M5.5 1v9M1 5.5h9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 3h16M4 9h10M7 15h4" />
  </svg>
);
const FabPlusIcon = () => (
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
    <path d="M11.5 2v19M2 11.5h19" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
const TimerIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.2">
    <circle cx="7.5" cy="8" r="5.5" /><path d="M7.5 5v3.5l2 1M5.5 1h4" />
  </svg>
);
function get_relative_time(date:Date){
  const now = new Date().getTime()/1000
  const past = date.getTime()/1000

  if(now - past >= 31536000){
    return `${Math.floor((now-past)/31536000)} years ago`
  }
  else if (now - past >= 2592000){
    return `${Math.floor((now-past)/2592000)} months ago`
  }
  else if (now - past >= 604800){
    return `${Math.floor((now-past)/604800)} weeks `.concat(((now - past)%604800 > 0) ? `${((now-past)%604800)/86400} days ago`:'')
  }
  else if (now - past >= 86400){
    return `${Math.floor((now-past)/86400)} days ago`
  }
  else if (now - past >= 3600){
    return `${Math.floor((now - past)/3600)} hours ago`
  }
  else if (now - past >= 60){
    return `${Math.floor((now- past)/60)} mins ago`
  }
  else {
    return `${Math.floor(now - past)}s ago`
  }
}
// ─── Desktop Row ──────────────────────────────────────────────────────────────
function TicketRow({ ticket, isSelected, onSelect, role }: { ticket: Ticket; isSelected: boolean; onSelect: () => void , role:string}) {
  const timeString = get_relative_time(new Date(ticket.updated_at)) || "-"
  const name = role == "CUSTOMER"? ticket.agent_name: ticket.customer_name
  return (
    <tr
      onClick={onSelect}
      className={cn(
        'cursor-pointer border-t border-[rgba(198,198,205,0.5)] dark:border-[#1e2535] transition-colors relative',
        isSelected ? 'bg-[rgba(0,88,190,0.05)] dark:bg-[rgba(0,88,190,0.1)]' : 'hover:bg-[#f7f9fb] dark:hover:bg-[#1a2236]',
      )}
    >
      {/* {isSelected && (
        <td className="w-0 p-0">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0058be] rounded-r-full" />
        </td>
      )} */}
      <td className="px-6 py-4 font-mono text-xs text-[#45464d] dark:text-[#9aa3bf] whitespace-nowrap w-[115px]">
        <div className="leading-tight">{ticket.ticket_ref.replace('#TKT-', '#TKT-\n')}</div>
      </td>
      <td className="px-4 py-4 w-[135px]">
        <div className="flex items-center gap-2">
          <Avatar name={name || 'U'}  size="sm" />
          <span className="text-sm text-[#0d1117] dark:text-white font-medium truncate">{name}</span>
        </div>
      </td>
      <td className="px-4 py-4 max-w-[220px]">
        <p className="text-sm text-[#191c1e] dark:text-[#e2e4ef] truncate">{ticket.issue}</p>
      </td>
      <td className="px-4 py-4 w-[93px]">
        <Badge variant={ticket.status}>{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</Badge>
      </td>
      <td className="px-4 py-4 w-[111px]">
        <div className="flex items-center gap-2">
          <PriorityIcon priority={ticket.priority} />
          <span className={cn('text-sm', ticket.priority === 'high' ? 'text-[#ba1a1a]' : ticket.priority === 'medium' ? 'text-[#98805d]' : 'text-[#45464d] dark:text-[#9aa3bf]')}>
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-right text-sm text-[#45464d] dark:text-[#9aa3bf] w-[140px]">{timeString}{" "}{new Date(ticket.updated_at).toLocaleDateString()}</td>
    </tr>
  );
}

// ─── Mobile Ticket Card ─────────────────────────────────────────────────────────
function MobileTicketCard({ ticket, onSelect }: {
  ticket: Ticket;
  onSelect: () => void;
}) {
  const timeString = get_relative_time(new Date(ticket.updated_at)) || "-"
  return (
    <button
      onClick={onSelect}
      className="w-full text-left bg-white dark:bg-[#111827] border border-[#c6c6cd] dark:border-[#1e2535] rounded-xl overflow-hidden hover:border-[#2170e4] transition-colors"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 mr-2">
            <p className="text-xs font-mono text-[#45464d] dark:text-[#9aa3bf] mb-1">{ticket.ticket_ref}</p>
            <p className="text-base font-semibold text-[#0d1117] dark:text-white leading-snug line-clamp-2">{ticket.issue}</p>
          </div>
          <Badge variant={ticket.priority}>
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#eceef0] dark:border-[#1e2535]">
          <Avatar name={ticket.agent_name || 'U'} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#45464d] dark:text-[#9aa3bf]">Agent</p>
            <p className="text-sm font-medium text-[#0d1117] dark:text-white truncate">{ticket.agent_name}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-2 h-2 rounded-full" style={{
              backgroundColor: ticket.status === 'open' ? '#ba1a1a' : ticket.status === 'pending' ? '#98805d' : '#6b7280'
            }} />
            <span className="text-xs text-[#45464d] dark:text-[#9aa3bf]">{timeString}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Mobile Ticket Sheet ──────────────────────────────────────────────────────
function MobileTicketSheet({ ticket,role, onClose , onUpdateTicket, onGenerateResponse}: { ticket: Ticket | null; role:MessageRole ;onClose: () => void ;onUpdateTicket: () => void, onGenerateResponse: () => void}) {
  if (!ticket) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-[#f7f9fb] dark:bg-[#0d1117] rounded-t-2xl max-h-[92vh] flex flex-col">
        <div className="w-12 h-1 bg-[#c6c6cd] dark:bg-[#2e3347] rounded-full mx-auto mt-3 mb-1 shrink-0" />
        <div className="flex-1 min-h-0">
          <TicketDetailPanel ticket={ticket} onClose={onClose} isMobileSheet onUpdateTicket={onUpdateTicket} role={role} onGenerateResponse={onGenerateResponse}/>
        </div>
      </div>
    </div>
  );
}



const TICKET_URL = `${import.meta.env.VITE_API_URL}/tickets`
// ─── Page ──────────────────────────────────────────────────────────────────────
export default function TicketsPage() {

  const statuses = ['all', 'open', 'pending', 'closed', 'resolved']
  const priorities = ['all', 'High', 'Medium', 'Low']

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalTicketCount, setTotalTicketCount] = useState(0)
  const [pendingTicketCount, setPendingTicketCount] = useState(0)
  const [currentTicketcount, setCurrentTicketCount] = useState(0)
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(0);
  const [priority, setPriority] = useState(0);
  const [page, setPage] = useState(1);
  const [mobileSelectedId, setMobileSelectedId] = useState<number | null>(null);
  const [showTicketDialog,setShowTicketDialog] = useState(false)
  const [showUpdateDialog,setShowUpdateDialog] = useState(false)
  const [showResponseDialog,setShowResponseDialog] = useState(false)
  const [perPage, setPerPage] = useState(7);
  const authContext = useAuth();
  const user = authContext.user;
  const agentOrUser = user?.role == "CUSTOMER" ? "Agent" : "CUSTOMER"
  const tableColumns = ['Ticket ID', agentOrUser, 'Subject', 'Status', 'Priority', 'Last Updated']

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) ?? null;
  const mobileSelectedTicket = tickets.find(t => t.id === mobileSelectedId) ?? null;

  const filtered = tickets.filter(t =>
    t.ticket_ref.toLowerCase().includes(search.toLowerCase()) ||
    t.issue.toLowerCase().includes(search.toLowerCase()) ||
    t.customer_name.toLowerCase().includes(search.toLowerCase())
  );


// fetch tickets

async function fetchTickets() {
      try {
        let url = TICKET_URL
        if(user?.role=='SUPPORT_AGENT'){
          url = TICKET_URL+'/support'
        }

        let reqUrl: URL = new URL(url)

        if(search.trim().length > 0){
          reqUrl.searchParams.set("search", search.trim())
        }
        if(statusFilter > 0){
          reqUrl.searchParams.set("status", statuses[statusFilter])
        }
        if(priority > 0){
          reqUrl.searchParams.set("priority", priorities[priority].toLowerCase())
        }
        reqUrl.searchParams.set("page", `${page}`)
        reqUrl.searchParams.set("per_page", `${perPage}`)

        const res = await fetch(reqUrl, {
            method: 'GET',
            credentials: 'include',
        })

        const data = await res.json();
        console.log(data)
        setTotalTicketCount(data.total)
        setPendingTicketCount(data.pending)
        setCurrentTicketCount(data.current)
        setTickets(data.ticket_list)
      } catch(err){
        console.error(err)
      }
    }

  //fetch tickets at page load 
  useEffect(() => {
    fetchTickets()
  },[user, page])

// create ticket
  async function handleCreateTicket(data: { issue: string; priority: 'high' | 'medium' | 'low' }){
    console.log("create ticket entered")
    const requestBody: CreateTicketRequest = {
      issue:data.issue,
      priority:data.priority
    }
    const res = await fetch(TICKET_URL+'/create-ticket',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      }
    )

    if(!res.ok){
      const errorData = await res.json().catch(() => ({}));
      throw {
        code: 'Ticket_Creation_Failed',
        message: errorData.message || 'Ticket Creation Failed'
      }
    }
    else {
      alert("Ticket Created Successfully")
      fetchTickets()
    }
  }

  // create ticket for support agent
    async function handleCreateTicketSupport(data: { issue: string; priority: 'high' | 'medium' | 'low' ; customer_email: string; set_me_as_agent:boolean}){
    console.log("create ticket entered")
    const requestBody: CreateTicketRequestSupport = {
      issue:data.issue,
      priority:data.priority,
      customer_email: data.customer_email,
      set_me_as_agent: data.set_me_as_agent
    }
    const res = await fetch(TICKET_URL+'/support/create-ticket',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      }
    )

    if(!res.ok){
      const errorData = await res.json().catch(() => ({}));
    }
    else {
      alert("Ticket Created Successfully")
      // fetchTickets()
    }
  }

// handle ticket status update
async function handleTicketUpdate(data : {id:number, issue:string, priority: TicketPriority, status:TicketStatus}){
  const res = await fetch(TICKET_URL+'/update',
    {
      method: 'PUT',
      headers: {"Content-Type": "application/json"},
      credentials: 'include',
      body: JSON.stringify({
        "ticket_id": data.id,
        "status": data.status,
        "issue": data.issue,
        "priority": data.priority
      })
    }
  )
  if(!res.ok){
    const errorData = await res.json().catch(() => ({}));
    throw {
        code: 'Ticket_Creation_Failed',
        message: errorData.message || 'Ticket Updation Failed'
      }
  }
  else{
    const result = await res.json()
    console.log(result)
    const newTicketDetails = {issue:result.issue, status:result.status, priority: result.priority, updated_at:result.updated_at}
    setTickets((prevTickets) => 
      prevTickets.map((ticket) => 
        ticket.id === data.id 
          ? { ...ticket, ...newTicketDetails } // Merge the updated fields
          : ticket // Keep old ticket completely as-is
      )
    );
  }
}

  return (
    <div className="flex h-screen bg-[#f7f9fb] dark:bg-[#0d1117] transition-colors duration-300">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 md:pl-[280px] flex flex-col min-h-0">

        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden md:flex flex-col flex-1 min-h-0 pt-16">
          {/* Top Header Bar */}
          <div className="fixed top-0 left-[280px] right-0 z-30 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-[#c6c6cd] dark:border-[#1e2535] h-16 flex items-center justify-end px-6 shadow-sm">
            <div className="flex items-center gap-3 text-[#45464d] dark:text-[#9aa3bf]">
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f7f9fb] dark:hover:bg-[#1e2535]">
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 1a6 6 0 0 1 6 6v3l2 2H0l2-2V7a6 6 0 0 1 6-6ZM6 17a2 2 0 0 0 4 0" />
                </svg>
              </button>
              <NavLink to="/profile">
                <Avatar name={user?.fullName || "U"} />
              </NavLink>
            </div>
          </div>

          {/* Filters & Search Row */}
          <div className="shrink-0 bg-white dark:bg-[#111827] border-b border-[#c6c6cd] dark:border-[#1e2535] px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium text-[#0d1117] dark:text-white">Tickets</h2>
              <Button size="sm" className="gap-1.5" onClick={()=>setShowTicketDialog(true)}>
                <PlusIcon />
                New Ticket
              </Button>
              {/* Dialogs */}

              <CreateTicketDialog 
                  isOpen={showTicketDialog}
                  onClose={()=>setShowTicketDialog(false)}
                  onSubmit={handleCreateTicket}
                  isSupport={user?.role && (user.role == 'SUPPORT_AGENT' || user.role == 'ADMIN') || false}
                  onSubmitSupport = {handleCreateTicketSupport}
              />

              <TicketUpdateDialog
              isOpen={showUpdateDialog}
              currentDetails={{"id":selectedTicketId || -1,"issue":selectedTicket?.issue || "","priority": selectedTicket?.priority ||"low", "status": selectedTicket?.status ||"open"}}
              onClose={()=>setShowUpdateDialog(false)}
              onUpdate={handleTicketUpdate}
              key={selectedTicketId+"TUD"}
              />
              <AIResponseDialog
              taggedMessage={selectedTicket?.last_message?.content.text || ""}
              role={user?.role || "CUSTOMER"}
              isOpen={showResponseDialog}
              onClose={()=>setShowResponseDialog(false)}
              key={selectedTicketId+"AID"}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search bar */}
              <div className="relative flex-1 max-w-[448px]">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] dark:text-[#9aa3bf]"><SearchIcon /></div>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search tickets by issue..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f7f9fb] dark:bg-[#1a2236] border border-[#c6c6cd] dark:border-[#2e3347] rounded-lg text-sm text-[#191c1e] dark:text-[#e2e4ef] placeholder:text-[#6b7280] outline-none focus:border-[#2170e4] focus:ring-2 focus:ring-[#2170e4]/20 transition-all"
                />
              </div>
              {/* Status filter */}
              <Button className='bg-sky-600'>
                Status: 
                <select defaultValue={0} value={statusFilter} className='text-black text-center rounded-sm' onChange={e=>setStatusFilter(parseInt(e.target.value))}>
                  {statuses.map( (s,i) => 
                    <option value={i}>{s}</option>
                  )}
                </select>
              </Button>
              

              {/* Priority filter */}
              <Button className='bg-sky-600'>
                Priority:

                <select defaultValue={0} value={priority} className='text-black text-center rounded-sm' onChange={e=>setPriority(parseInt(e.target.value))}>
                  {priorities.map( (p,i) => 
                    <option  value={i}>{p}</option>
                  )}
                </select>
              </Button>

              <Button className='bg-sky-600'>
                nos.
                <input type='number' value={perPage} className='text-black w-16 text-center rounded-sm' onChange={e=>setPerPage(isNaN(parseInt(e.target.value)) ? 0: parseInt(e.target.value))}/>
              </Button>

              <Button onClick={fetchTickets} className='bg-sky-600'>
                Filter
              </Button>
            </div>
          </div>

          {/* Table + Detail Split */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full min-w-[620px]">
                <thead className="sticky top-0 z-10 bg-white dark:bg-[#111827] border-b border-[#c6c6cd] dark:border-[#1e2535] shadow-sm">
                  <tr>
                    {tableColumns.map((h, i) => (
                      <th key={h} className={cn('py-4 text-sm font-medium text-[#45464d] dark:text-[#9aa3bf]', i === 0 ? 'px-6 text-left' : i === 5 ? 'px-6 text-right' : 'px-4 text-left')}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(ticket => (
                    <TicketRow
                      key={ticket.id}
                      ticket={ticket}
                      isSelected={selectedTicketId === ticket.id}
                      onSelect={() => setSelectedTicketId(ticket.id)}
                      role={user?.role || "CUSTOMER"}
                    />
                  ))}
                </tbody>
              </table>

              {/* Pagination */}

              { currentTicketcount > perPage &&
              <div className='w-full mx-[35%]'>
                <Pagination total={currentTicketcount} per_page={perPage} onPageChange={setPage}/>
              </div>
              }
            </div>

            {/* Detail Panel */}
            <div className="w-[380px] border-l border-[#c6c6cd] dark:border-[#1e2535] shrink-0 shadow-[-4px_0_12px_rgba(0,0,0,0.02)]">
              <TicketDetailPanel ticket={selectedTicket} role={user?.role || 'CUSTOMER'} onUpdateTicket={()=>setShowUpdateDialog(true)} onClose={()=>setSelectedTicketId(null)} onGenerateResponse={()=>setShowResponseDialog(true)}/>
            </div>
            
            
          </div>
        </div>

        {/* ── MOBILE LAYOUT ── */}
        <div className="flex flex-col flex-1 min-h-0 md:hidden pt-16 pb-[69px]">
          {/* Dialogs */}
          <CreateTicketDialog 
                  isOpen={showTicketDialog}
                  onClose={()=>setShowTicketDialog(false)}
                  onSubmit={handleCreateTicket}
                  isSupport={user?.role && (user.role == 'SUPPORT_AGENT' || user.role == 'ADMIN') || false}
                  onSubmitSupport = {handleCreateTicketSupport}
              />

              <TicketUpdateDialog
              isOpen={showUpdateDialog}
              currentDetails={{"id":selectedTicketId || -1,"issue":selectedTicket?.issue || "","priority": selectedTicket?.priority ||"low", "status": selectedTicket?.status ||"open"}}
              onClose={()=>setShowUpdateDialog(false)}
              onUpdate={handleTicketUpdate}
              key={selectedTicketId+"TUDMobile"}
              />
              <AIResponseDialog
              taggedMessage={selectedTicket?.last_message?.content.text || ""}
              role={user?.role || "CUSTOMER"}
              isOpen={showResponseDialog}
              onClose={()=>setShowResponseDialog(false)}
              key={selectedTicketId+"AIDMobile"}
              />
          {/* Mobile Top Bar */}
          <div className="fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-[#c6c6cd] dark:border-[#1e2535] h-16 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <button className="p-2">
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1h16M1 6h16M1 11h16" /></svg>
              </button>
              <p className="font-black text-[#0d1117] dark:text-white text-base">Nexus AI</p>
            </div>
            <div className="flex items-center gap-2 text-[#45464d] dark:text-[#9aa3bf]">
              <button className="p-2"><FilterIcon /></button>
              <button className="p-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="8" cy="8" r="6" /><path d="M13 13l4 4" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            {/* Header */}
            <div className="pt-4 pb-2 flex items-center justify-between">
              <h1 className="text-2xl font-black text-[#0d1117] dark:text-white">Tickets</h1>
              <Button size="sm" className="gap-1.5 text-xs" onClick={()=>setShowTicketDialog(true)}>
                <PlusIcon />
                New Ticket
              </Button>
            </div>

            {/* Stats bento */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'TOTAL', value: totalTicketCount, color: '#0058be' },
                { label: 'PENDING', value: pendingTicketCount, color: '#ba1a1a' },
              ].map(stat => (
                <div key={stat.label} className="bg-white dark:bg-[#111827] border border-[#c6c6cd] dark:border-[#1e2535] rounded-xl p-4">
                  <p className="text-[11px] font-medium tracking-widest text-[#45464d] dark:text-[#9aa3bf]">{stat.label}</p>
                  <p className="text-4xl font-black mt-1" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] dark:text-[#9aa3bf]"><SearchIcon /></div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search ticket ID, subject..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#111827] border border-[#c6c6cd] dark:border-[#2e3347] rounded-xl text-sm text-[#191c1e] dark:text-[#e2e4ef] placeholder:text-[#6b7280] outline-none focus:border-[#2170e4] transition-all"
              />
            </div>
            
                          {/* Status filter */}
              <Button className='bg-sky-600'>
                Status: 
                <select defaultValue={0} value={statusFilter} className='text-black text-center rounded-sm' onChange={e=>setStatusFilter(parseInt(e.target.value))}>
                  {statuses.map( (s,i) => 
                    <option value={i}>{s}</option>
                  )}
                </select>
              </Button>
              

              {/* Priority filter */}
              <Button className='bg-sky-600 mb-3'>
                Priority:

                <select defaultValue={0} value={priority} className='text-black text-center rounded-sm' onChange={e=>setPriority(parseInt(e.target.value))}>
                  {priorities.map( (p,i) => 
                    <option  value={i}>{p}</option>
                  )}
                </select>
              </Button>

              <Button onClick={fetchTickets} className='bg-sky-600 mb-3'>
                Filter
              </Button>

            {/* List header */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-[#45464d] dark:text-[#9aa3bf]">OPEN TICKETS</p>
              <button className="text-xs text-[#0058be] dark:text-[#4a9eff]">Sort by date</button>
            </div>
            

            {/* Ticket cards */}
            <div className="space-y-3 pb-6">
              { tickets
                .filter(t =>
                  t.ticket_ref.toLowerCase().includes(search.toLowerCase()) ||
                  t.issue.toLowerCase().includes(search.toLowerCase())
                )
                .map(t => (
                  <MobileTicketCard
                    key={t.ticket_ref}
                    ticket={t}
                    onSelect={() => {
                      setMobileSelectedId(t.id ?? null);
                    }}
                  />
                ))}
            </div>

            {/* AI Insight */}
{/*             
            <div className="bg-gradient-to-br from-[#0058be]/10 to-[#2170e4]/5 dark:from-[#0058be]/20 dark:to-[#2170e4]/10 border border-[#2170e4]/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0058be" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
                </svg>
                <p className="text-[11px] font-medium tracking-widest text-[#0058be] dark:text-[#4a9eff] uppercase">AI Insight</p>
              </div>
              <p className="text-sm text-[#191c1e] dark:text-[#e2e4ef] leading-relaxed">
                3 tickets related to "API Authentication" are trending. AI suggests consolidating these into a single master incident for the backend team.
              </p>
            </div>*/}
          </div> 

          {/* FAB */}
          <button className="fixed right-5 bottom-[calc(69px+16px)] z-30 w-14 h-14 bg-[#0058be] hover:bg-[#004ca1] rounded-full flex items-center justify-center shadow-lg shadow-[#0058be]/30 transition-colors"
          onClick={()=>setShowTicketDialog(true)}
          >
            <FabPlusIcon />
          </button>
        </div>

        {/* Mobile ticket detail sheet */}
        <MobileTicketSheet ticket={mobileSelectedTicket} onClose={() => setMobileSelectedId(null)} onUpdateTicket={()=>setShowUpdateDialog} role={user?.role || 'CUSTOMER'} onGenerateResponse={()=>setShowResponseDialog(true)} />
      </div>
      

      <MobileBottomNav />
    </div>
  );
}
