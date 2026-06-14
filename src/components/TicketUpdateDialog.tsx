import { Dialog } from "./Dialog"
import { TicketPriority, TicketStatus } from "../types"
import { useState } from "react"
import { PriorityOption } from "./CreateTicketDialog"
import { cn } from "../utils/cn"
import { TicketStatusSelect } from "./TicketStatusSelect"


export function TicketUpdateDialog(props:{
  isOpen:boolean, 
  currentDetails: {id: number, issue:string, priority: TicketPriority, status:TicketStatus},
  onClose:()=>void, 
  onUpdate:(data:{id:number, issue:string, priority:TicketPriority, status:TicketStatus})=>Promise<void>}
)
  {
  const [issue, setIssue] = useState(props.currentDetails.issue)
  const [priority, setPriority] = useState<TicketPriority>(props.currentDetails.priority)
  const [isUpdating, setIsUpdating] = useState(false)
  const [status, setStatus] = useState<TicketStatus>(props.currentDetails.status)
  const [errors, setErrors] = useState<Record<string, string>>({});



  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    setIssue(issue.trim());
    // Validation
    if (!issue) {
      setErrors({ issue: 'Please describe the issue' });
      return;
    }

    if (issue.length < 10) {
      setErrors({ issue: 'Issue description must be at least 10 characters' });
      return;
    }
    
    setIsUpdating(true)
    try {
      console.log(issue+"\n"+priority)
      await props.onUpdate({id:props.currentDetails.id, issue, priority , status});
      // Reset form
      props.onClose();
      alert("Ticket Updated Succesfully")
    } catch (err: any) {
      setErrors({ issue: 'Failed to update ticket' });
    } finally {
      setIsUpdating(false);
    }
  };

  function handleClose(){
    if(!isUpdating){
    // Reset form
      setIssue(props.currentDetails.issue);
      setStatus(props.currentDetails.status)
      setPriority(props.currentDetails.priority);
      props.onClose()
    }
  }


  return(
    <Dialog 
    isOpen={props.isOpen} 
    onClose={handleClose} 
    title='Update Ticket Status'
      primaryAction={{
        label: 'Update Status',
        onClick: handleUpdate,
        loading: isUpdating,
      }}
      secondaryAction={{
        label: 'Cancel',
        onClick: handleClose,
      }}
    >
        <form onSubmit={e=> handleUpdate(e)} className="space-y-5" id="CreateTicketForm">
                {/* Issue Textarea */}
                <div>
                  <label className="block text-sm font-semibold text-[#191c1e] dark:text-white mb-2.5">
                    Issue Description
                  </label>
                  <textarea
                    placeholder=""
                    value={issue}
                    rows={4}
                    className={cn(
                      'w-full px-4 py-3 bg-white dark:bg-[#0d1117] border rounded-lg',
                      'text-[#191c1e] dark:text-[#e2e4ef] placeholder:text-[#9aa3bf] dark:placeholder:text-[#6b7c9e]',
                      'outline-none transition-all duration-200 resize-none',
                      'focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/20 dark:focus:ring-[#0058be]/30',
                      errors.issue
                        ? 'border-[#ba1a1a] dark:border-[#f9dedc] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/20'
                        : 'border-[#c6c6cd] dark:border-[#2e3347]'
                    )}
                    onChange={e=>setIssue(e.target.value)}
                    disabled={isUpdating}
                  />
                  {errors.issue && (
                    <p className="mt-1.5 text-xs text-[#ba1a1a] dark:text-[#f9dedc] font-medium">
                      {errors.issue}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-[#45464d] dark:text-[#9aa3bf]">
                    Minimum 10 characters
                  </p>
                </div>
        
                {/* Priority Selection */}
                <div className="mb-3">
                  <label className="block text-sm font-semibold text-[#191c1e] dark:text-white mb-3">
                    Priority Level
                  </label>
                  <div className="flex gap-2">
                    <PriorityOption
                      value="low"
                      label="Low"
                      selected={priority === 'low'}
                      onChange={() => setPriority('low')}
                    />
                    <PriorityOption
                      value="medium"
                      label="Medium"
                      selected={priority === 'medium'}
                      onChange={() => setPriority('medium')}
                    />
                    <PriorityOption
                      value="high"
                      label="High"
                      selected={priority === 'high'}
                      onChange={() => setPriority('high')}
                    />
                  </div>
                </div>
                <TicketStatusSelect 
                
                value={status}
                onChange={setStatus}
                disabled={isUpdating}
                />
              </form>
    </Dialog>
  )
}