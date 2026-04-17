import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Users, FileText, Send, LayoutDashboard, Plus, Trash2, Edit3, X, Save,
  LogIn, LogOut, UserPlus, ChevronLeft, Search, Phone, Mail, MapPin,
  DollarSign, AlertCircle, Loader2, Eye, ChevronDown, ChevronRight,
  Kanban, GripVertical, ArrowRight, Target, Menu, PanelLeftClose,
  ClipboardList, PhoneCall, Video, StickyNote,
  Paperclip, Bell, BellRing, Clock, Star, Gauge,
  CheckCircle2, XCircle, AlertTriangle, ArrowUpRight, Download,
  ListTodo, CalendarDays, ContactIcon, Building2, BarChart3,
  TrendingUp, Upload, DownloadCloud, CheckSquare, Square,
  Flag, CircleDot, Filter, Hash, Activity, Printer, Zap, Shield
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import LeadPipeline from '@/components/sections/LeadPipeline'
import SmartLeadImporter from '@/components/sections/SmartLeadImporter'
import DealTracker from '@/components/sections/DealTracker'
import ActivityFeed from '@/components/sections/ActivityFeed'
import DealMaker from '@/components/sections/OfferBot'
import { toast } from '@/lib/toast'
import GlobalSearch from '@/components/GlobalSearch'

export const Route = createFileRoute('/crm')({
  component: CrmPage,
  validateSearch: (search: Record<string, unknown>) => ({
    demo: search.demo === 'true' || search.demo === true,
    from: (search.from as string) || '/',
  }),
})

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CrmItem {
  id: string
  type: 'lead' | 'offer' | 'sent'
  name: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  status: string
  amount?: string
  price?: number
  createdAt: string
  updatedAt: string
}

type CrmTab = 'dashboard' | 'leads' | 'offers' | 'sent' | 'pipeline' | 'leadpipeline' | 'leadimporter' | 'activities' | 'dealscore' | 'tasks' | 'contacts' | 'reports' | 'dealtracker' | 'activityfeed' | 'dealmaker'

interface Activity {
  id: string
  type: 'email' | 'call' | 'meeting' | 'note'
  subject: string
  description?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  dealId?: string
  dealName?: string
  attachments?: ActivityAttachment[]
  reminder?: ActivityReminder | null
  createdAt: string
  updatedAt: string
}

interface ActivityAttachment {
  id: string
  name: string
  type: string
  size: number
  dataUrl: string
}

interface ActivityReminder {
  date: string
  note: string
  completed: boolean
}

interface DealScoreResult {
  overall: number
  breakdown: {
    profitPotential: number
    marketStrength: number
    investmentGrade: number
    riskLevel: number
  }
  analysis: string
  recommendation: string
  metrics: {
    estimatedProfit: number
    roi: number
    arvSpread: number
    repairToArvRatio: number
  }
}

interface PipelineDeal {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  amount?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'done'
  dueDate?: string
  relatedDealId?: string
  relatedDealName?: string
  contactName?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  completedAt?: string
}

interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  address?: string
  role: 'seller' | 'buyer' | 'agent' | 'lender' | 'title_company' | 'contractor' | 'other'
  tags: string[]
  notes?: string
  source?: string
  lastContactedAt?: string
  createdAt: string
  updatedAt: string
}

interface PipelineData {
  [stage: string]: PipelineDeal[]
}

const PIPELINE_STAGES = [
  'Lead Found',
  'Contacted',
  'Negotiating',
  'Under Contract',
  'Buyer Found',
  'Closed',
]

const STAGE_COLORS: Record<string, string> = {
  'Lead Found': '#5ba3d9',
  'Contacted': '#a855f7',
  'Negotiating': '#e8a44a',
  'Under Contract': '#ff7e5f',
  'Buyer Found': '#5cb885',
  'Closed': '#22c55e',
}

const STAGE_ICONS: Record<string, string> = {
  'Lead Found': '🔍',
  'Contacted': '📞',
  'Negotiating': '🤝',
  'Under Contract': '📝',
  'Buyer Found': '🏠',
  'Closed': '💰',
}

interface IdentityUser {
  id: string
  email: string
  name?: string
  emailVerified?: boolean
}

const STATUS_OPTIONS: Record<CrmItem['type'], string[]> = {
  lead: ['New Lead', 'New', 'Contacted', 'Qualified', 'Follow Up', 'Not Interested', 'Converted'],
  offer: ['Draft', 'Submitted', 'Negotiating', 'Accepted', 'Rejected', 'Expired'],
  sent: ['Pending', 'Delivered', 'Opened', 'Responded', 'Closed', 'No Response'],
}

const STATUS_COLORS: Record<string, string> = {
  'New Lead': '#5ba3d9',
  New: '#5ba3d9',
  Contacted: '#a855f7',
  Qualified: '#5cb885',
  'Follow Up': '#e8a44a',
  'Not Interested': '#6b6560',
  Converted: '#5cb885',
  Draft: '#6b6560',
  Submitted: '#5ba3d9',
  Negotiating: '#e8a44a',
  Accepted: '#5cb885',
  Rejected: '#ef4444',
  Expired: '#6b6560',
  Pending: '#e8a44a',
  Delivered: '#5ba3d9',
  Opened: '#a855f7',
  Responded: '#5cb885',
  Closed: '#5cb885',
  'No Response': '#6b6560',
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#ef4444',
  high: '#ff7e5f',
  medium: '#e8a44a',
  low: '#5ba3d9',
}

const PRIORITY_LABELS: Record<string, string> = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

const TASK_STATUS_LABELS: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

const TASK_STATUS_COLORS: Record<string, string> = {
  todo: '#5ba3d9',
  in_progress: '#e8a44a',
  done: '#5cb885',
}

const ROLE_LABELS: Record<string, string> = {
  seller: 'Seller',
  buyer: 'Buyer',
  agent: 'Agent',
  lender: 'Lender',
  title_company: 'Title Co.',
  contractor: 'Contractor',
  other: 'Other',
}

const ROLE_COLORS: Record<string, string> = {
  seller: '#ff7e5f',
  buyer: '#5cb885',
  agent: '#5ba3d9',
  lender: '#a855f7',
  title_company: '#e8a44a',
  contractor: '#ffb347',
  other: '#6b6560',
}

const TAG_COLORS = ['#ff7e5f', '#5ba3d9', '#5cb885', '#a855f7', '#e8a44a', '#ffb347', '#ef4444', '#22c55e']

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

function CrmPage() {
  const router = useRouter()
  const { from } = Route.useSearch()
  const [user, setUser] = useState<IdentityUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authView, setAuthView] = useState<'login' | 'signup'>('login')
  const [authError, setAuthError] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authSubmitting, setAuthSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  const [tab, setTab] = useState<CrmTab>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false)
  const [items, setItems] = useState<CrmItem[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<CrmItem | null>(null)
  const [viewingItem, setViewingItem] = useState<CrmItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [error, setError] = useState('')

  // Form state
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formAddress, setFormAddress] = useState('')
  const [formNotes, setFormNotes] = useState('')
  const [formStatus, setFormStatus] = useState('')
  const [formAmount, setFormAmount] = useState('')

  // Pipeline state
  const [pipelineData, setPipelineData] = useState<PipelineData>({})
  const [pipelineLoading, setPipelineLoading] = useState(false)
  const [pipelineShowForm, setPipelineShowForm] = useState(false)
  const [pipelineFormStage, setPipelineFormStage] = useState('')
  const [pipelineEditDeal, setPipelineEditDeal] = useState<PipelineDeal | null>(null)
  const [pipelineFormName, setPipelineFormName] = useState('')
  const [pipelineFormAddress, setPipelineFormAddress] = useState('')
  const [pipelineFormPhone, setPipelineFormPhone] = useState('')
  const [pipelineFormEmail, setPipelineFormEmail] = useState('')
  const [pipelineFormAmount, setPipelineFormAmount] = useState('')
  const [pipelineFormNotes, setPipelineFormNotes] = useState('')
  const [dragData, setDragData] = useState<{ stage: string; index: number } | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const boardScrollRef = useRef<HTMLDivElement>(null)

  // Activities state
  const [activities, setActivities] = useState<Activity[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState(false)
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [activityType, setActivityType] = useState<Activity['type']>('call')
  const [activitySubject, setActivitySubject] = useState('')
  const [activityDescription, setActivityDescription] = useState('')
  const [activityContactName, setActivityContactName] = useState('')
  const [activityContactEmail, setActivityContactEmail] = useState('')
  const [activityContactPhone, setActivityContactPhone] = useState('')
  const [activityDealName, setActivityDealName] = useState('')
  const [activityAttachments, setActivityAttachments] = useState<ActivityAttachment[]>([])
  const [activityReminderDate, setActivityReminderDate] = useState('')
  const [activityReminderNote, setActivityReminderNote] = useState('')
  const [activityHasReminder, setActivityHasReminder] = useState(false)
  const [activityFilter, setActivityFilter] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Deal score state
  const [scoreAddress, setScoreAddress] = useState('')
  const [scoreContractPrice, setScoreContractPrice] = useState('')
  const [scoreArv, setScoreArv] = useState('')
  const [scoreRepairs, setScoreRepairs] = useState('')
  const [scorePropertyType, setScorePropertyType] = useState('Single Family')
  const [scoreBedrooms, setScoreBedrooms] = useState('')
  const [scoreBathrooms, setScoreBathrooms] = useState('')
  const [scoreSqft, setScoreSqft] = useState('')
  const [scoreYearBuilt, setScoreYearBuilt] = useState('')
  const [scoreResult, setScoreResult] = useState<DealScoreResult | null>(null)
  const [scoreLoading, setScoreLoading] = useState(false)
  const [scoreHistory, setScoreHistory] = useState<Array<{ address: string; score: DealScoreResult; timestamp: string }>>([])

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskPriority, setTaskPriority] = useState<Task['priority']>('medium')
  const [taskStatus, setTaskStatus] = useState<Task['status']>('todo')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [taskDealName, setTaskDealName] = useState('')
  const [taskContactName, setTaskContactName] = useState('')
  const [taskTags, setTaskTags] = useState<string[]>([])
  const [taskTagInput, setTaskTagInput] = useState('')
  const [taskFilter, setTaskFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all')

  // Contacts state
  const [contacts, setContacts] = useState<Contact[]>([])
  const [contactsLoading, setContactsLoading] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactCompany, setContactCompany] = useState('')
  const [contactAddress, setContactAddress] = useState('')
  const [contactRole, setContactRole] = useState<Contact['role']>('other')
  const [contactTags, setContactTags] = useState<string[]>([])
  const [contactTagInput, setContactTagInput] = useState('')
  const [contactNotes, setContactNotes] = useState('')
  const [contactSource, setContactSource] = useState('')
  const [contactSearch, setContactSearch] = useState('')
  const [contactRoleFilter, setContactRoleFilter] = useState('')
  const [viewingContact, setViewingContact] = useState<Contact | null>(null)

  // Bulk actions state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [bulkMode, setBulkMode] = useState(false)

  // Reports state
  const [reportPeriod, setReportPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  /* ---- Auth ---- */

  useEffect(() => {
    let cancelled = false
    async function checkAuth() {
      let loggedIn = false
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!cancelled && session?.user) {
          const u = session.user
          loggedIn = true
          setUser({
            id: u.id,
            email: u.email ?? '',
            name: u.user_metadata?.full_name ?? undefined,
            emailVerified: !!u.email_confirmed_at
          })
        }
      } catch {
        // not logged in
      } finally {
        if (!cancelled) {
          // If no real user found, bypass directly — avoids any flash of the login screen
          if (!loggedIn) {
            enterDemoMode()
          }
          setAuthLoading(false)
        }
      }
    }
    checkAuth()
    return () => { cancelled = true }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    setAuthSubmitting(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      })
      if (error) throw error
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? '',
          name: data.user.user_metadata?.full_name ?? undefined,
          emailVerified: !!data.user.email_confirmed_at
        })
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Login failed.')
    } finally {
      setAuthSubmitting(false)
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    setAuthSubmitting(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
        options: {
          data: { full_name: authName }
        }
      })
      if (error) throw error
      if (data.user?.email_confirmed_at) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? '',
          name: data.user.user_metadata?.full_name ?? undefined,
          emailVerified: true
        })
      } else {
        setConfirmationSent(true)
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Signup failed.')
    } finally {
      setAuthSubmitting(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setItems([])
    setTab('dashboard')
  }

  /* ---- Demo mode ---- */

  const DEMO_DATA: CrmItem[] = [
    { id: 'demo-1', type: 'lead', name: 'Marcus Johnson', email: 'marcus.j@email.com', phone: '(404) 555-0192', address: '1842 Peachtree Rd NE, Atlanta, GA 30309', notes: 'Motivated seller – behind on payments. Property needs minor cosmetic work. ARV $285k.', status: 'Qualified', amount: '185000', createdAt: '2026-03-20T10:30:00Z', updatedAt: '2026-03-28T14:15:00Z' },
    { id: 'demo-2', type: 'lead', name: 'Patricia Williams', email: 'pwilliams@gmail.com', phone: '(713) 555-0284', address: '5620 Westheimer Rd, Houston, TX 77056', notes: 'Inherited property, wants quick sale. Vacant 6+ months.', status: 'New Lead', amount: '142000', price: 142000, createdAt: '2026-03-27T09:00:00Z', updatedAt: '2026-03-27T09:00:00Z' },
    { id: 'demo-3', type: 'lead', name: 'David Chen', email: 'dchen88@yahoo.com', phone: '(602) 555-0371', address: '2910 N 7th St, Phoenix, AZ 85014', notes: 'Pre-foreclosure. Owes $120k, property worth ~$210k. Very motivated.', status: 'Contacted', amount: '155000', createdAt: '2026-03-25T16:45:00Z', updatedAt: '2026-03-29T08:20:00Z' },
    { id: 'demo-4', type: 'lead', name: 'Sandra Martinez', phone: '(214) 555-0455', address: '811 Elm St, Dallas, TX 75202', notes: 'Divorce situation. Needs to sell within 30 days.', status: 'Follow Up', amount: '198000', createdAt: '2026-03-22T11:15:00Z', updatedAt: '2026-03-28T10:30:00Z' },
    { id: 'demo-5', type: 'lead', name: 'Robert Taylor', email: 'rtaylor@outlook.com', phone: '(305) 555-0563', address: '450 NW 37th Ave, Miami, FL 33125', notes: 'Absentee owner in California. Tenant just moved out. Needs roof work.', status: 'New Lead', amount: '220000', price: 220000, createdAt: '2026-03-29T07:00:00Z', updatedAt: '2026-03-29T07:00:00Z' },
    { id: 'demo-6', type: 'offer', name: 'Marcus Johnson – Peachtree Property', email: 'marcus.j@email.com', phone: '(404) 555-0192', address: '1842 Peachtree Rd NE, Atlanta, GA 30309', notes: 'Offered $165k cash, 14-day close. Seller countered at $175k.', status: 'Negotiating', amount: '175000', createdAt: '2026-03-26T13:00:00Z', updatedAt: '2026-03-28T16:45:00Z' },
    { id: 'demo-7', type: 'offer', name: 'Elm Street Flip – Sandra Martinez', phone: '(214) 555-0455', address: '811 Elm St, Dallas, TX 75202', notes: 'Cash offer at $170k. Waiting on seller response. Comps support $245k ARV.', status: 'Submitted', amount: '170000', createdAt: '2026-03-28T09:30:00Z', updatedAt: '2026-03-28T09:30:00Z' },
    { id: 'demo-8', type: 'offer', name: 'Westheimer Wholesale – Patricia Williams', email: 'pwilliams@gmail.com', address: '5620 Westheimer Rd, Houston, TX 77056', notes: 'Offer accepted at $125k! Assigning to buyer for $8k fee.', status: 'Accepted', amount: '125000', createdAt: '2026-03-24T14:00:00Z', updatedAt: '2026-03-27T11:15:00Z' },
    { id: 'demo-9', type: 'offer', name: 'Oak Park Duplex', address: '334 Oak Park Blvd, Memphis, TN 38104', notes: 'Initial offer rejected. Seller wants retail price. Moving on.', status: 'Rejected', amount: '95000', createdAt: '2026-03-15T10:00:00Z', updatedAt: '2026-03-20T15:30:00Z' },
    { id: 'demo-10', type: 'sent', name: 'Driving for Dollars – Zone 4 Batch', notes: 'Sent 250 yellow letters to distressed properties in Atlanta Zone 4. Targeting pre-foreclosures and tax liens.', status: 'Delivered', amount: '625', createdAt: '2026-03-18T08:00:00Z', updatedAt: '2026-03-22T14:00:00Z' },
    { id: 'demo-11', type: 'sent', name: 'Houston Absentee Owner Mailer', email: 'batch-houston@directmail.com', notes: 'Postcards to 500 absentee owners in Houston. Got 12 callbacks so far.', status: 'Responded', amount: '1250', createdAt: '2026-03-10T09:00:00Z', updatedAt: '2026-03-26T16:30:00Z' },
    { id: 'demo-12', type: 'sent', name: 'Cold Call Campaign – Dallas', phone: '(214) 555-0455', notes: 'VA team cold-called 150 leads in Dallas. 8 warm leads generated. Follow up scheduled.', status: 'Opened', amount: '450', createdAt: '2026-03-25T10:00:00Z', updatedAt: '2026-03-28T12:00:00Z' },
    { id: 'demo-13', type: 'sent', name: 'Facebook Ad Campaign – March', notes: 'Motivated seller Facebook ads running in Phoenix metro. Budget $500/mo. 3 leads so far.', status: 'Pending', amount: '500', createdAt: '2026-03-29T06:00:00Z', updatedAt: '2026-03-29T06:00:00Z' },
  ]

  function enterDemoMode() {
    setDemoMode(true)
    setUser({ id: 'demo-user', email: 'demo@flipthecontract.com', name: 'Demo User' })
    setItems(DEMO_DATA)
    setAuthLoading(false)
  }

  function exitDemo() {
    setDemoMode(false)
    setUser(null)
    setItems([])
    setPipelineData({})
    setTasks([])
    setContacts([])
    setTab('dashboard')
  }

  /* ---- Pipeline data ---- */

  const DEMO_PIPELINE: PipelineData = {
    'Lead Found': [
      { id: 'pd-1', name: 'Patricia Williams – 5620 Westheimer', address: '5620 Westheimer Rd, Houston, TX 77056', phone: '(713) 555-0284', amount: '142000', notes: 'Inherited property, vacant 6+ months. Motivated seller.', createdAt: '2026-03-27T09:00:00Z', updatedAt: '2026-03-27T09:00:00Z' },
      { id: 'pd-2', name: 'Robert Taylor – 450 NW 37th Ave', address: '450 NW 37th Ave, Miami, FL 33125', phone: '(305) 555-0563', email: 'rtaylor@outlook.com', amount: '220000', notes: 'Absentee owner in CA. Tenant moved out. Needs roof work.', createdAt: '2026-03-29T07:00:00Z', updatedAt: '2026-03-29T07:00:00Z' },
    ],
    'Contacted': [
      { id: 'pd-3', name: 'David Chen – 2910 N 7th St', address: '2910 N 7th St, Phoenix, AZ 85014', phone: '(602) 555-0371', email: 'dchen88@yahoo.com', amount: '155000', notes: 'Pre-foreclosure. Owes $120k, worth ~$210k. Very motivated.', createdAt: '2026-03-25T16:45:00Z', updatedAt: '2026-03-29T08:20:00Z' },
    ],
    'Negotiating': [
      { id: 'pd-4', name: 'Marcus Johnson – Peachtree', address: '1842 Peachtree Rd NE, Atlanta, GA 30309', phone: '(404) 555-0192', email: 'marcus.j@email.com', amount: '175000', notes: 'Offered $165k cash, 14-day close. Seller countered $175k.', createdAt: '2026-03-26T13:00:00Z', updatedAt: '2026-03-28T16:45:00Z' },
      { id: 'pd-5', name: 'Sandra Martinez – Elm St', address: '811 Elm St, Dallas, TX 75202', phone: '(214) 555-0455', amount: '170000', notes: 'Divorce situation. Needs sale in 30 days. Cash offer at $170k.', createdAt: '2026-03-28T09:30:00Z', updatedAt: '2026-03-28T09:30:00Z' },
    ],
    'Under Contract': [
      { id: 'pd-6', name: 'Westheimer Wholesale – Williams', address: '5620 Westheimer Rd, Houston, TX 77056', email: 'pwilliams@gmail.com', amount: '125000', notes: 'Offer accepted at $125k! Assignment contract signed. EMD deposited.', createdAt: '2026-03-24T14:00:00Z', updatedAt: '2026-03-27T11:15:00Z' },
    ],
    'Buyer Found': [
      { id: 'pd-7', name: 'Westheimer Assignment – BrightPath Capital', address: '5620 Westheimer Rd, Houston, TX 77056', amount: '133000', notes: 'Assigning to BrightPath Capital for $8k fee. Closing in 10 days.', createdAt: '2026-03-27T14:00:00Z', updatedAt: '2026-03-28T10:00:00Z' },
    ],
    'Closed': [
      { id: 'pd-8', name: 'Oak Park Duplex – Memphis', address: '334 Oak Park Blvd, Memphis, TN 38104', amount: '95000', notes: 'Double closed. $12k profit. Funded by transactional lender.', createdAt: '2026-03-15T10:00:00Z', updatedAt: '2026-03-20T15:30:00Z' },
    ],
  }

  const fetchPipeline = useCallback(async () => {
    if (demoMode) {
      setPipelineData(DEMO_PIPELINE)
      return
    }
    setPipelineLoading(true)
    try {
      const { data, error } = await supabase
        .from('crm_items')
        .select('*')
        .eq('type', 'pipeline')
      
      if (error) throw error
      
      const grouped: PipelineData = {}
      PIPELINE_STAGES.forEach(s => grouped[s] = [])
      data?.forEach(item => {
        if (item.pipeline_stage && grouped[item.pipeline_stage]) {
          grouped[item.pipeline_stage].push({
            id: item.id,
            name: item.name,
            address: item.address || '',
            phone: item.phone || '',
            email: item.email || '',
            amount: item.amount?.toString() || '',
            notes: item.notes || '',
            createdAt: item.created_at,
            updatedAt: item.updated_at
          })
        }
      })
      setPipelineData(grouped)
    } catch (err: any) {
      setError(err.message || 'Failed to load pipeline')
    } finally {
      setPipelineLoading(false)
    }
  }, [demoMode])

  useEffect(() => {
    if (user && tab === 'pipeline') {
      fetchPipeline()
    }
  }, [user, tab, fetchPipeline])

  async function savePipeline(newData: PipelineData) {
    setPipelineData(newData)
    if (demoMode) return
    // Note: In real app, we'd trigger stage updates here if drag-drop happened.
    // The handleDrop and moveDeal functions call this.
  }

  function handleDragStart(stage: string, index: number) {
    setDragData({ stage, index })
  }

  function handleDragOver(e: React.DragEvent, stage: string) {
    e.preventDefault()
    setDragOverStage(stage)
  }

  function handleDragLeave() {
    setDragOverStage(null)
  }

  function handleDrop(e: React.DragEvent, newStage: string) {
    e.preventDefault()
    setDragOverStage(null)
    if (!dragData) return
    const { stage: oldStage, index } = dragData
    const newData = { ...pipelineData }
    // Deep copy arrays
    for (const s of PIPELINE_STAGES) {
      newData[s] = [...(newData[s] || [])]
    }
    const [card] = newData[oldStage].splice(index, 1)
    if (card) {
      const now = new Date().toISOString()
      card.updatedAt = now
      newData[newStage].push(card)
      setPipelineData(newData)
      if (!demoMode) {
        supabase.from('crm_items')
          .update({ pipeline_stage: newStage, updated_at: now })
          .eq('id', card.id)
          .then(({ error }) => { if (error) setError('Failed to update stage') })
      }
    }
    setDragData(null)
  }

  function openPipelineForm(stage: string, deal?: PipelineDeal) {
    setPipelineFormStage(stage)
    if (deal) {
      setPipelineEditDeal(deal)
      setPipelineFormName(deal.name)
      setPipelineFormAddress(deal.address || '')
      setPipelineFormPhone(deal.phone || '')
      setPipelineFormEmail(deal.email || '')
      setPipelineFormAmount(deal.amount || '')
      setPipelineFormNotes(deal.notes || '')
    } else {
      setPipelineEditDeal(null)
      setPipelineFormName('')
      setPipelineFormAddress('')
      setPipelineFormPhone('')
      setPipelineFormEmail('')
      setPipelineFormAmount('')
      setPipelineFormNotes('')
    }
    setPipelineShowForm(true)
  }

  async function handlePipelineSave(e: React.FormEvent) {
    e.preventDefault()
    if (!pipelineFormName.trim()) return

    if (pipelineEditDeal) {
      // Update existing deal
      const newData = { ...pipelineData }
      for (const s of PIPELINE_STAGES) {
        newData[s] = (newData[s] || []).map(d =>
          d.id === pipelineEditDeal.id
            ? {
                ...d,
                name: pipelineFormName.trim(),
                address: pipelineFormAddress.trim() || undefined,
                phone: pipelineFormPhone.trim() || undefined,
                email: pipelineFormEmail.trim() || undefined,
                amount: pipelineFormAmount.trim() || undefined,
                notes: pipelineFormNotes.trim() || undefined,
                updatedAt: new Date().toISOString(),
              }
            : d,
        )
      }
      savePipeline(newData)
    } else {
      // New deal
      const now = new Date().toISOString()
      const deal: PipelineDeal = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: pipelineFormName.trim(),
        address: pipelineFormAddress.trim() || undefined,
        phone: pipelineFormPhone.trim() || undefined,
        email: pipelineFormEmail.trim() || undefined,
        amount: pipelineFormAmount.trim() || undefined,
        notes: pipelineFormNotes.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      }
      if (demoMode) {
        const newData = { ...pipelineData }
        newData[pipelineFormStage] = [...(newData[pipelineFormStage] || []), deal]
        setPipelineData(newData)
      } else {
        try {
          const { error } = await supabase.from('crm_items').insert({
            type: 'pipeline',
            name: deal.name,
            address: deal.address,
            phone: deal.phone,
            email: deal.email,
            amount: deal.amount ? Number(deal.amount) : undefined,
            notes: deal.notes,
            pipeline_stage: pipelineFormStage,
            user_id: user?.id
          })
          if (error) throw error
          fetchPipeline()
        } catch (err: any) {
          setError(err.message || 'Failed to add deal')
        }
      }
    }
    setPipelineShowForm(false)
  }

  function handlePipelineDelete(dealId: string) {
    if (!confirm('Delete this deal?')) return
    const newData = { ...pipelineData }
    for (const s of PIPELINE_STAGES) {
      newData[s] = (newData[s] || []).filter(d => d.id !== dealId)
    }
    savePipeline(newData)
    setPipelineShowForm(false)
  }

  // Move deal between stages (for mobile)
  function moveDeal(dealId: string, fromStage: string, direction: 'next' | 'prev') {
    const stageIdx = PIPELINE_STAGES.indexOf(fromStage)
    const targetIdx = direction === 'next' ? stageIdx + 1 : stageIdx - 1
    if (targetIdx < 0 || targetIdx >= PIPELINE_STAGES.length) return
    const targetStage = PIPELINE_STAGES[targetIdx]
    const newData = { ...pipelineData }
    for (const s of PIPELINE_STAGES) newData[s] = [...(newData[s] || [])]
    const idx = newData[fromStage].findIndex(d => d.id === dealId)
    if (idx === -1) return
    const [deal] = newData[fromStage].splice(idx, 1)
    deal.updatedAt = new Date().toISOString()
    newData[targetStage].push(deal)
    savePipeline(newData)
  }

  /* ---- CRM data ---- */

  /* ---- Activities ---- */

  const DEMO_ACTIVITIES: Activity[] = [
    { id: 'act-1', type: 'call', subject: 'Initial call with Marcus Johnson', description: 'Called Marcus about the Peachtree property. He\'s behind on payments and very motivated to sell. Discussed timeline — wants to close within 30 days. Mentioned minor cosmetic issues only.', contactName: 'Marcus Johnson', contactPhone: '(404) 555-0192', dealName: 'Peachtree Property', attachments: [], reminder: { date: '2026-04-05T10:00:00Z', note: 'Follow up on counter-offer', completed: false }, createdAt: '2026-03-28T14:15:00Z', updatedAt: '2026-03-28T14:15:00Z' },
    { id: 'act-2', type: 'email', subject: 'Sent purchase agreement to Patricia Williams', description: 'Emailed the draft purchase agreement for the Westheimer property at $125k. Included proof of funds letter and estimated closing timeline.', contactName: 'Patricia Williams', contactEmail: 'pwilliams@gmail.com', dealName: 'Westheimer Wholesale', attachments: [{ id: 'att-1', name: 'Purchase_Agreement_Westheimer.pdf', type: 'application/pdf', size: 245000, dataUrl: '' }], reminder: null, createdAt: '2026-03-27T11:00:00Z', updatedAt: '2026-03-27T11:00:00Z' },
    { id: 'act-3', type: 'meeting', subject: 'Property walkthrough – 2910 N 7th St', description: 'Met David Chen at the Phoenix property. Pre-foreclosure condition confirmed. Foundation solid, needs new roof ($8k estimate), kitchen update ($12k), and paint throughout ($3k). Total repairs ~$23k. Neighborhood trending up — new development 2 blocks away.', contactName: 'David Chen', contactPhone: '(602) 555-0371', dealName: 'N 7th St Phoenix', attachments: [{ id: 'att-2', name: 'property_front.jpg', type: 'image/jpeg', size: 1800000, dataUrl: '' }, { id: 'att-3', name: 'kitchen_damage.jpg', type: 'image/jpeg', size: 2100000, dataUrl: '' }], reminder: { date: '2026-04-02T09:00:00Z', note: 'Submit offer based on walkthrough findings', completed: false }, createdAt: '2026-03-26T15:30:00Z', updatedAt: '2026-03-26T15:30:00Z' },
    { id: 'act-4', type: 'call', subject: 'Buyer interest — BrightPath Capital', description: 'BrightPath Capital expressed strong interest in the Westheimer assignment. They\'re offering $133k (our asking). Requested inspection period of 7 days. Ready to wire EMD tomorrow.', contactName: 'James Rivera (BrightPath)', contactPhone: '(832) 555-0741', dealName: 'Westheimer Wholesale', attachments: [], reminder: { date: '2026-04-01T14:00:00Z', note: 'Confirm EMD received from BrightPath', completed: false }, createdAt: '2026-03-28T10:00:00Z', updatedAt: '2026-03-28T10:00:00Z' },
    { id: 'act-5', type: 'note', subject: 'Market research — Dallas Elm St area', description: 'Pulled comps for 811 Elm St area. 3 recent sales within 0.5 miles:\n- 805 Elm: $238k (1,450 sqft, 3/2)\n- 820 Elm: $252k (1,600 sqft, 3/2)\n- 798 Oak: $245k (1,500 sqft, 3/2)\nAverage ARV: ~$245k. At $170k contract + $25k repairs, assignment fee potential is $20k+.', dealName: 'Elm Street Flip', attachments: [{ id: 'att-4', name: 'Dallas_Comps_March2026.pdf', type: 'application/pdf', size: 520000, dataUrl: '' }], reminder: null, createdAt: '2026-03-25T08:45:00Z', updatedAt: '2026-03-25T08:45:00Z' },
    { id: 'act-6', type: 'email', subject: 'Title search request — Oak Park Duplex', description: 'Sent title search request to Memphis Title Co for 334 Oak Park Blvd. Need to verify clean title and check for any liens before proceeding with double close.', contactName: 'Memphis Title Co', contactEmail: 'orders@memphisTitleCo.com', dealName: 'Oak Park Duplex', attachments: [], reminder: { date: '2026-04-03T11:00:00Z', note: 'Follow up on title search results', completed: false }, createdAt: '2026-03-24T16:20:00Z', updatedAt: '2026-03-24T16:20:00Z' },
  ]

  const fetchActivities = useCallback(async () => {
    if (demoMode) {
      setActivities(DEMO_ACTIVITIES)
      return
    }
    setActivitiesLoading(true)
    try {
      let query = supabase.from('activities').select('*').order('created_at', { ascending: false })
      if (activityFilter) query = query.eq('type', activityFilter)
      
      const { data, error } = await query
      if (error) throw error
      
      setActivities((data || []).map(a => ({
        id: a.id,
        type: a.type,
        subject: a.subject,
        description: a.description,
        contactName: a.contact_name,
        contactEmail: a.contact_email,
        contactPhone: a.contact_phone,
        dealId: a.deal_id,
        attachments: a.attachments,
        reminder: a.reminder,
        createdAt: a.created_at,
        updatedAt: a.updated_at
      } as Activity)))
    } catch (err: any) {
      setError(err.message || 'Failed to load activities')
    } finally {
      setActivitiesLoading(false)
    }
  }, [demoMode, activityFilter])

  useEffect(() => {
    if (user && tab === 'activities') {
      fetchActivities()
    }
  }, [user, tab, fetchActivities])

  function resetActivityForm() {
    setActivityType('call')
    setActivitySubject('')
    setActivityDescription('')
    setActivityContactName('')
    setActivityContactEmail('')
    setActivityContactPhone('')
    setActivityDealName('')
    setActivityAttachments([])
    setActivityReminderDate('')
    setActivityReminderNote('')
    setActivityHasReminder(false)
    setEditingActivity(null)
  }

  function openActivityForm(activity?: Activity) {
    if (activity) {
      setEditingActivity(activity)
      setActivityType(activity.type)
      setActivitySubject(activity.subject)
      setActivityDescription(activity.description || '')
      setActivityContactName(activity.contactName || '')
      setActivityContactEmail(activity.contactEmail || '')
      setActivityContactPhone(activity.contactPhone || '')
      setActivityDealName(activity.dealName || '')
      setActivityAttachments(activity.attachments || [])
      setActivityHasReminder(!!activity.reminder)
      setActivityReminderDate(activity.reminder?.date ? activity.reminder.date.slice(0, 16) : '')
      setActivityReminderNote(activity.reminder?.note || '')
    } else {
      resetActivityForm()
    }
    setShowActivityForm(true)
  }

  function handleFileAttach(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError('File too large. Max 5MB per file.')
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        const att: ActivityAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result as string,
        }
        setActivityAttachments(prev => [...prev, att])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  async function handleActivitySave(e: React.FormEvent) {
    e.preventDefault()
    if (!activitySubject.trim()) return

    const payload = {
      type: activityType,
      subject: activitySubject,
      description: activityDescription || undefined,
      contact_name: activityContactName || undefined,
      contact_email: activityContactEmail || undefined,
      contact_phone: activityContactPhone || undefined,
      deal_id: editingActivity?.dealId || undefined, // Mapping to deal_id in DB
      attachments: activityAttachments,
      reminder: activityHasReminder && activityReminderDate ? {
        date: new Date(activityReminderDate).toISOString(),
        note: activityReminderNote || 'Follow up',
        completed: false,
      } : null,
      user_id: user?.id
    }

    if (demoMode) {
      const now = new Date().toISOString()
      if (editingActivity) {
        setActivities(prev => prev.map(a => a.id === editingActivity.id ? { ...a, ...payload, updatedAt: now } as any : a))
      } else {
        const newAct: Activity = { ...payload, id: `act-${Date.now()}`, createdAt: now, updatedAt: now } as any
        setActivities(prev => [newAct, ...prev])
      }
      setShowActivityForm(false)
      resetActivityForm()
      return
    }

    try {
      if (editingActivity) {
        const { error } = await supabase.from('activities').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editingActivity.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('activities').insert(payload)
        if (error) throw error
      }
      setShowActivityForm(false)
      resetActivityForm()
      fetchActivities()
    } catch (err: any) {
      setError(err.message || 'Failed to save activity')
    }
  }

  async function handleActivityDelete(id: string) {
    if (!confirm('Delete this activity?')) return
    if (demoMode) {
      setActivities(prev => prev.filter(a => a.id !== id))
      return
    }
    try {
      await fetch(`/api/activities?id=${id}`, { method: 'DELETE' })
      setActivities(prev => prev.filter(a => a.id !== id))
    } catch {
      setError('Failed to delete activity')
    }
  }

  function toggleReminderComplete(activity: Activity) {
    if (!activity.reminder) return
    const updated = { ...activity, reminder: { ...activity.reminder, completed: !activity.reminder.completed }, updatedAt: new Date().toISOString() }
    setActivities(prev => prev.map(a => a.id === activity.id ? updated : a))
    if (!demoMode) {
      fetch(`/api/activities?id=${activity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminder: updated.reminder }),
      }).catch(() => {})
    }
  }

  const upcomingReminders = activities.filter(a => a.reminder && !a.reminder.completed).sort((a, b) => new Date(a.reminder!.date).getTime() - new Date(b.reminder!.date).getTime())
  const overdueReminders = upcomingReminders.filter(a => new Date(a.reminder!.date) < new Date())

  /* ---- Deal Score ---- */

  const DEMO_SCORE_HISTORY: Array<{ address: string; score: DealScoreResult; timestamp: string }> = [
    {
      address: '1842 Peachtree Rd NE, Atlanta, GA',
      score: {
        overall: 78,
        breakdown: { profitPotential: 85, marketStrength: 72, investmentGrade: 80, riskLevel: 70 },
        analysis: 'Strong ARV spread of 35.1% — excellent wholesale margin. Passes the 70% rule — attractive to fix-and-flip investors. Projected ROI of 52.3% is outstanding. 3+ bed SFH is the most desirable for end buyers.',
        recommendation: 'Good Deal — Solid numbers with reasonable risk. Proceed with due diligence and prepare your assignment contract.',
        metrics: { estimatedProfit: 75000, roi: 52.3, arvSpread: 35.1, repairToArvRatio: 8.8 },
      },
      timestamp: '2026-03-28T14:00:00Z',
    },
    {
      address: '811 Elm St, Dallas, TX',
      score: {
        overall: 82,
        breakdown: { profitPotential: 90, marketStrength: 75, investmentGrade: 85, riskLevel: 72 },
        analysis: 'Strong ARV spread of 30.6% — excellent wholesale margin. Passes the 70% rule — attractive to fix-and-flip investors. Projected ROI of 38.5% is solid for wholesale. 3+ bed SFH is the most desirable for end buyers.',
        recommendation: 'Strong Buy — This deal shows excellent fundamentals. Move quickly to lock it up and start marketing to your buyers list immediately.',
        metrics: { estimatedProfit: 50000, roi: 38.5, arvSpread: 30.6, repairToArvRatio: 10.2 },
      },
      timestamp: '2026-03-25T09:30:00Z',
    },
    {
      address: '450 NW 37th Ave, Miami, FL',
      score: {
        overall: 58,
        breakdown: { profitPotential: 60, marketStrength: 65, investmentGrade: 50, riskLevel: 55 },
        analysis: 'Decent ARV spread of 22.0% — room for assignment fee. Above the 70% rule by $12,000 — may need price negotiation. Projected ROI of 25.1% is solid for wholesale.',
        recommendation: 'Proceed with Caution — The numbers are workable but tight. Try to negotiate a lower contract price or confirm ARV with more comps.',
        metrics: { estimatedProfit: 42000, roi: 25.1, arvSpread: 22.0, repairToArvRatio: 14.3 },
      },
      timestamp: '2026-03-22T16:15:00Z',
    },
  ]

  async function handleScoreDeal(e: React.FormEvent) {
    e.preventDefault()
    if (!scoreAddress.trim() || !scoreContractPrice) return
    setScoreLoading(true)
    setScoreResult(null)

    const payload = {
      address: scoreAddress,
      contractPrice: parseFloat(scoreContractPrice),
      arv: scoreArv ? parseFloat(scoreArv) : undefined,
      repairEstimate: scoreRepairs ? parseFloat(scoreRepairs) : undefined,
      propertyType: scorePropertyType,
      bedrooms: scoreBedrooms ? parseInt(scoreBedrooms) : undefined,
      bathrooms: scoreBathrooms ? parseInt(scoreBathrooms) : undefined,
      sqft: scoreSqft ? parseInt(scoreSqft) : undefined,
      yearBuilt: scoreYearBuilt ? parseInt(scoreYearBuilt) : undefined,
    }

    if (demoMode) {
      // Simulate scoring locally for demo
      await new Promise(r => setTimeout(r, 1200))
      const cp = payload.contractPrice
      const arv = payload.arv || cp * 1.4
      const repairs = payload.repairEstimate || cp * 0.1
      const spread = ((arv - cp) / arv) * 100
      const profit = arv - cp - repairs
      const roi = ((profit) / (cp + repairs)) * 100
      const result: DealScoreResult = {
        overall: Math.min(100, Math.max(10, Math.round(spread * 2.2 + 15))),
        breakdown: {
          profitPotential: Math.min(100, Math.round(spread * 2.5)),
          marketStrength: payload.propertyType === 'Single Family' ? 72 : 60,
          investmentGrade: Math.min(100, Math.round(spread * 2.8)),
          riskLevel: Math.min(100, Math.round(60 + spread * 0.8)),
        },
        analysis: `ARV spread of ${spread.toFixed(1)}% ${spread >= 30 ? '— excellent wholesale margin.' : spread >= 20 ? '— decent room for assignment fee.' : '— tight margins.'} Projected ROI of ${roi.toFixed(1)}% ${roi > 50 ? 'is outstanding.' : roi > 25 ? 'is solid for wholesale.' : 'is modest — negotiate harder.'}`,
        recommendation: spread >= 30 ? 'Strong Buy — Move quickly to lock this deal up.' : spread >= 20 ? 'Good Deal — Proceed with due diligence.' : 'Proceed with Caution — Try to negotiate a lower price.',
        metrics: { estimatedProfit: Math.round(profit), roi: Math.round(roi * 10) / 10, arvSpread: Math.round(spread * 10) / 10, repairToArvRatio: Math.round((repairs / arv) * 1000) / 10 },
      }
      setScoreResult(result)
      setScoreHistory(prev => [{ address: scoreAddress, score: result, timestamp: new Date().toISOString() }, ...prev])
      setScoreLoading(false)
      return
    }

    try {
      // Logic for scoring here...
      const cp = payload.contractPrice
      const arv = payload.arv || cp * 1.4
      const repairs = payload.repairEstimate || cp * 0.1
      const spread = ((arv - cp) / arv) * 100
      const profit = arv - cp - repairs
      const roi = ((profit) / (cp + repairs)) * 100
      const result: DealScoreResult = {
        overall: Math.min(100, Math.max(10, Math.round(spread * 2.2 + 15))),
        breakdown: {
          profitPotential: Math.min(100, Math.round(spread * 2.5)),
          marketStrength: payload.propertyType === 'Single Family' ? 72 : 60,
          investmentGrade: Math.min(100, Math.round(spread * 2.8)),
          riskLevel: Math.min(100, Math.round(60 + spread * 0.8)),
        },
        analysis: `ARV spread of ${spread.toFixed(1)}% ${spread >= 30 ? '— excellent wholesale margin.' : spread >= 20 ? '— decent room for assignment fee.' : '— tight margins.'} Projected ROI of ${roi.toFixed(1)}% ${roi > 50 ? 'is outstanding.' : roi > 25 ? 'is solid for wholesale.' : 'is modest — negotiate harder.'}`,
        recommendation: spread >= 30 ? 'Strong Buy — Move quickly to lock this deal up.' : spread >= 20 ? 'Good Deal — Proceed with due diligence.' : 'Proceed with Caution — Try to negotiate a lower price.',
        metrics: { estimatedProfit: Math.round(profit), roi: Math.round(roi * 10) / 10, arvSpread: Math.round(spread * 10) / 10, repairToArvRatio: Math.round((repairs / arv) * 1000) / 10 },
      }
      
      setScoreResult(result)
      setScoreHistory(prev => [{ address: scoreAddress, score: result, timestamp: new Date().toISOString() }, ...prev])
      
      if (!demoMode) {
        await supabase.from('deal_scores').insert({
          address: scoreAddress,
          result: result,
          user_id: user?.id
        })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to score deal')
    } finally {
      setScoreLoading(false)
    }
  }

  const fetchScoreHistory = useCallback(async () => {
    if (demoMode) {
      setScoreHistory(DEMO_SCORE_HISTORY)
      return
    }
    try {
      const { data, error } = await supabase
        .from('deal_scores')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setScoreHistory((data || []).map(h => ({
        address: h.address,
        score: h.result,
        timestamp: h.created_at
      })))
    } catch (err: any) {
      setError(err.message || 'Failed to load history')
    }
  }, [demoMode])

  useEffect(() => {
    if (user && tab === 'dealscore') {
      fetchScoreHistory()
    }
  }, [user, tab, fetchScoreHistory])

  const fetchItems = useCallback(async (type?: CrmItem['type']) => {
    if (demoMode) {
      setItems(type ? DEMO_DATA.filter(i => i.type === type) : DEMO_DATA)
      return
    }
    setLoading(true)
    setError('')
    try {
      let query = supabase.from('crm_items').select('*').in('type', ['lead', 'offer', 'sent']).order('created_at', { ascending: false })
      if (type) query = query.eq('type', type)
      
      const { data, error } = await query
      if (error) throw error
      
      setItems((data || []).map(i => ({
        id: i.id,
        type: i.type,
        name: i.name,
        email: i.email,
        phone: i.phone,
        address: i.address,
        notes: i.notes,
        status: i.status,
        amount: i.amount?.toString(),
        price: i.price,
        createdAt: i.created_at,
        updatedAt: i.updated_at
      } as CrmItem)))
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [demoMode])

  useEffect(() => {
    if (!user) return
    const typeMap: Record<CrmTab, CrmItem['type'] | undefined> = {
      dashboard: undefined,
      leads: 'lead',
      offers: 'offer',
      sent: 'sent',
      pipeline: undefined,
      leadpipeline: undefined,
      leadimporter: undefined,
      activities: undefined,
      dealscore: undefined,
      tasks: undefined,
      contacts: undefined,
      reports: undefined,
      dealtracker: undefined,
      activityfeed: undefined,
      dealmaker: undefined,
    }
    fetchItems(typeMap[tab])
  }, [user, tab, fetchItems])

  function resetForm() {
    setFormName('')
    setFormEmail('')
    setFormPhone('')
    setFormAddress('')
    setFormNotes('')
    setFormStatus('')
    setFormAmount('')
    setEditingItem(null)
  }

  function openAddForm() {
    resetForm()
    const typeMap: Partial<Record<CrmTab, CrmItem['type']>> = { dashboard: 'lead', leads: 'lead', offers: 'offer', sent: 'sent' }
    setFormStatus(STATUS_OPTIONS[typeMap[tab] || 'lead'][0])
    setShowForm(true)
  }

  function openEditForm(item: CrmItem) {
    setFormName(item.name)
    setFormEmail(item.email || '')
    setFormPhone(item.phone || '')
    setFormAddress(item.address || '')
    setFormNotes(item.notes || '')
    setFormStatus(item.status)
    setFormAmount(item.amount || '')
    setEditingItem(item)
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const typeMap: Partial<Record<CrmTab, CrmItem['type']>> = { dashboard: 'lead', leads: 'lead', offers: 'offer', sent: 'sent' }
    const itemType = editingItem?.type || typeMap[tab] || 'lead'

    const payload = {
      type: itemType,
      name: formName,
      email: formEmail || undefined,
      phone: formPhone || undefined,
      address: formAddress || undefined,
      notes: formNotes || undefined,
      status: formStatus,
      amount: formAmount ? Number(formAmount) : undefined,
      price: formAmount ? Number(formAmount) : undefined,
      user_id: user?.id
    }

    if (demoMode) {
      const now = new Date().toISOString()
      if (editingItem) {
        setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...payload, updatedAt: now } as any : i))
      } else {
        const newItem: CrmItem = { ...payload, id: `demo-${Date.now()}`, createdAt: now, updatedAt: now } as any
        setItems(prev => [newItem, ...prev])
      }
      setShowForm(false)
      resetForm()
      return
    }

    try {
      if (editingItem) {
        const { error } = await supabase.from('crm_items').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('crm_items').insert(payload)
        if (error) throw error
      }
      setShowForm(false)
      resetForm()
      fetchItems(tab === 'dashboard' ? undefined : itemType)
      toast.success('Item saved successfully')
    } catch (err: any) {
      setError(err.message || 'Save failed')
    }
  }

  async function handleDelete(item: CrmItem) {
    if (!confirm(`Delete "${item.name}"?`)) return
    if (demoMode) {
      setItems(prev => prev.filter(i => i.id !== item.id))
      if (viewingItem?.id === item.id) setViewingItem(null)
      return
    }
    try {
      const { error } = await supabase.from('crm_items').delete().eq('id', item.id)
      if (error) throw error
      setItems(prev => prev.filter(i => i.id !== item.id))
      if (viewingItem?.id === item.id) setViewingItem(null)
    } catch (err: any) {
      setError(err.message || 'Delete failed')
    }
  }

  /* ---- Computed ---- */

  // Tasks logic
  const DEMO_TASKS: Task[] = [
    { id: 'task-1', title: 'Follow up with Marcus Johnson on counter-offer', priority: 'urgent', status: 'todo', dueDate: '2026-04-04T10:00:00Z', relatedDealName: 'Peachtree Property', contactName: 'Marcus Johnson', tags: ['follow-up', 'negotiation'], createdAt: '2026-03-28T14:00:00Z', updatedAt: '2026-03-28T14:00:00Z' },
    { id: 'task-2', title: 'Send proof of funds to title company', priority: 'high', status: 'in_progress', dueDate: '2026-04-05T17:00:00Z', relatedDealName: 'Westheimer Wholesale', contactName: 'Memphis Title Co', tags: ['closing', 'documents'], createdAt: '2026-03-27T09:00:00Z', updatedAt: '2026-03-29T11:00:00Z' },
    { id: 'task-3', title: 'Schedule property inspection for N 7th St', priority: 'medium', status: 'todo', dueDate: '2026-04-06T14:00:00Z', relatedDealName: 'N 7th St Phoenix', contactName: 'David Chen', tags: ['inspection'], createdAt: '2026-03-26T15:00:00Z', updatedAt: '2026-03-26T15:00:00Z' },
    { id: 'task-4', title: 'Pull comps for new Dallas lead', priority: 'medium', status: 'todo', dueDate: '2026-04-07T09:00:00Z', relatedDealName: 'Elm Street Flip', tags: ['research', 'comps'], createdAt: '2026-03-25T08:00:00Z', updatedAt: '2026-03-25T08:00:00Z' },
    { id: 'task-5', title: 'Review and sign assignment contract', priority: 'high', status: 'done', dueDate: '2026-03-28T12:00:00Z', relatedDealName: 'Westheimer Wholesale', tags: ['contracts'], createdAt: '2026-03-24T10:00:00Z', updatedAt: '2026-03-28T11:30:00Z', completedAt: '2026-03-28T11:30:00Z' },
    { id: 'task-6', title: 'Update buyer list with new contacts from networking event', priority: 'low', status: 'todo', tags: ['buyers', 'networking'], createdAt: '2026-03-29T18:00:00Z', updatedAt: '2026-03-29T18:00:00Z' },
  ]

  const DEMO_CONTACTS: Contact[] = [
    { id: 'cont-1', name: 'Marcus Johnson', email: 'marcus.j@email.com', phone: '(404) 555-0192', address: '1842 Peachtree Rd NE, Atlanta, GA 30309', role: 'seller', tags: ['motivated', 'atlanta'], notes: 'Behind on payments, very motivated. Prefers text messages.', source: 'Driving for Dollars', createdAt: '2026-03-20T10:00:00Z', updatedAt: '2026-03-28T14:15:00Z' },
    { id: 'cont-2', name: 'Patricia Williams', email: 'pwilliams@gmail.com', phone: '(713) 555-0284', address: '5620 Westheimer Rd, Houston, TX', role: 'seller', tags: ['inherited', 'houston'], notes: 'Inherited property. Lives out of state.', source: 'Mailer Campaign', createdAt: '2026-03-15T09:00:00Z', updatedAt: '2026-03-27T11:00:00Z' },
    { id: 'cont-3', name: 'James Rivera', email: 'jrivera@brightpath.com', phone: '(832) 555-0741', company: 'BrightPath Capital', role: 'buyer', tags: ['cash-buyer', 'houston', 'repeat'], notes: 'Fix-and-flip investor. Buys 3-5 properties/month. Prefers SFH under $200k.', source: 'Referral', createdAt: '2026-03-10T14:00:00Z', updatedAt: '2026-03-28T10:00:00Z' },
    { id: 'cont-4', name: 'Sarah Kim', email: 'skim@memphisTitleCo.com', phone: '(901) 555-0329', company: 'Memphis Title Co', role: 'title_company', tags: ['memphis', 'reliable'], notes: 'Fast closings, investor-friendly. Handles double closes.', source: 'REIA Meeting', createdAt: '2026-03-05T11:00:00Z', updatedAt: '2026-03-24T16:00:00Z' },
    { id: 'cont-5', name: 'Mike Thompson', email: 'mthompson@fundfast.com', phone: '(469) 555-0518', company: 'FundFast Capital', role: 'lender', tags: ['transactional', 'dallas'], notes: 'Transactional lender. Same-day funding. 2% fee.', source: 'BiggerPockets', createdAt: '2026-02-28T10:00:00Z', updatedAt: '2026-03-20T15:00:00Z' },
    { id: 'cont-6', name: 'David Chen', email: 'dchen88@yahoo.com', phone: '(602) 555-0371', address: '2910 N 7th St, Phoenix, AZ', role: 'seller', tags: ['pre-foreclosure', 'phoenix'], notes: 'Pre-foreclosure situation. Very motivated.', source: 'Skip Trace', createdAt: '2026-03-18T16:00:00Z', updatedAt: '2026-03-29T08:00:00Z' },
    { id: 'cont-7', name: 'Lisa Martinez', phone: '(602) 555-0892', company: 'Desert Contractors LLC', role: 'contractor', tags: ['phoenix', 'reliable'], notes: 'General contractor. Good for rehab estimates. $35/hr.', source: 'Referral', createdAt: '2026-03-01T09:00:00Z', updatedAt: '2026-03-15T14:00:00Z' },
    { id: 'cont-8', name: 'Robert Taylor', email: 'rtaylor@outlook.com', phone: '(305) 555-0563', address: '450 NW 37th Ave, Miami, FL', role: 'seller', tags: ['absentee', 'miami'], notes: 'Absentee owner in California. Property needs roof work.', source: 'Cold Call', createdAt: '2026-03-29T07:00:00Z', updatedAt: '2026-03-29T07:00:00Z' },
  ]

  const fetchTasks = useCallback(async () => {
    if (demoMode) {
      setTasks(DEMO_TASKS)
      return
    }
    setTasksLoading(true)
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setTasks((data || []).map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        dueDate: t.due_date,
        relatedDealId: t.related_deal_id,
        contactName: t.contact_name,
        tags: t.tags,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        completedAt: t.completed_at
      } as Task)))
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks')
    } finally {
      setTasksLoading(false)
    }
  }, [demoMode])

  useEffect(() => {
    if (user && tab === 'tasks') fetchTasks()
  }, [user, tab, fetchTasks])

  useEffect(() => {
    if (user && tab === 'contacts') fetchContacts()
  }, [user, tab])

  // Preload tasks data for dashboard
  useEffect(() => {
    if (user && tab === 'dashboard' && tasks.length === 0) fetchTasks()
  }, [user, tab])

  function resetTaskForm() {
    setTaskTitle(''); setTaskDescription(''); setTaskPriority('medium'); setTaskStatus('todo')
    setTaskDueDate(''); setTaskDealName(''); setTaskContactName(''); setTaskTags([]); setTaskTagInput('')
    setEditingTask(null)
  }

  function openTaskForm(task?: Task) {
    if (task) {
      setEditingTask(task); setTaskTitle(task.title); setTaskDescription(task.description || '')
      setTaskPriority(task.priority); setTaskStatus(task.status)
      setTaskDueDate(task.dueDate ? task.dueDate.slice(0, 16) : '')
      setTaskDealName(task.relatedDealName || ''); setTaskContactName(task.contactName || '')
      setTaskTags(task.tags || [])
    } else { resetTaskForm() }
    setShowTaskForm(true)
  }

  async function handleTaskSave(e: React.FormEvent) {
    e.preventDefault()
    if (!taskTitle.trim()) return
    const payload = {
      title: taskTitle,
      description: taskDescription || undefined,
      priority: taskPriority,
      status: taskStatus,
      due_date: taskDueDate ? new Date(taskDueDate).toISOString() : undefined,
      contact_name: taskContactName || undefined,
      tags: taskTags,
      user_id: user?.id
    }
    if (demoMode) {
      const now = new Date().toISOString()
      if (editingTask) {
        setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...payload, updatedAt: now, completedAt: payload.status === 'done' && t.status !== 'done' ? now : t.completedAt } as any : t))
      } else {
        setTasks(prev => [{ ...payload, id: `task-${Date.now()}`, createdAt: now, updatedAt: now } as any, ...prev])
      }
      setShowTaskForm(false); resetTaskForm(); return
    }
    try {
      if (editingTask) {
        const { error } = await supabase.from('tasks').update({ ...payload, updated_at: new Date().toISOString(), completed_at: payload.status === 'done' && editingTask.status !== 'done' ? new Date().toISOString() : editingTask.completedAt }).eq('id', editingTask.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('tasks').insert(payload)
        if (error) throw error
      }
      setShowTaskForm(false); resetTaskForm(); fetchTasks()
    } catch (err: any) { setError(err.message || 'Failed to save task') }
  }

  async function handleTaskDelete(id: string) {
    if (!confirm('Delete this task?')) return
    if (demoMode) { setTasks(prev => prev.filter(t => t.id !== id)); return }
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
      setTasks(prev => prev.filter(t => t.id !== id))
    }
    catch { setError('Failed to delete task') }
  }

  async function quickToggleTask(task: Task) {
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    const now = new Date().toISOString()
    const updated = { ...task, status: newStatus as Task['status'], updatedAt: now, completedAt: newStatus === 'done' ? now : undefined }
    setTasks(prev => prev.map(t => t.id === task.id ? updated : t))
    if (!demoMode) {
      fetch(`/api/tasks?id=${task.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) }).catch(() => {})
    }
  }

  const filteredTasks = tasks.filter(t => taskFilter === 'all' || t.status === taskFilter)
  const taskStats = { total: tasks.length, todo: tasks.filter(t => t.status === 'todo').length, inProgress: tasks.filter(t => t.status === 'in_progress').length, done: tasks.filter(t => t.status === 'done').length, overdue: tasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < new Date()).length }

  // Contacts logic
  const fetchContacts = useCallback(async () => {
    if (demoMode) { setContacts(DEMO_CONTACTS); return }
    setContactsLoading(true)
    try {
      let query = supabase.from('contacts').select('*').order('name', { ascending: true })
      if (contactRoleFilter) query = query.eq('role', contactRoleFilter)
      
      const { data, error } = await query
      if (error) throw error
      
      setContacts((data || []).map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        company: c.company,
        address: c.address,
        role: c.role,
        tags: c.tags,
        notes: c.notes,
        source: c.source,
        lastContactedAt: c.last_contacted_at,
        createdAt: c.created_at,
        updatedAt: c.updated_at
      } as Contact)))
    } catch (err: any) { setError(err.message || 'Failed to load contacts') }
    finally { setContactsLoading(false) }
  }, [demoMode, contactRoleFilter])

  function resetContactForm() {
    setContactName(''); setContactEmail(''); setContactPhone(''); setContactCompany('')
    setContactAddress(''); setContactRole('other'); setContactTags([]); setContactTagInput('')
    setContactNotes(''); setContactSource(''); setEditingContact(null)
  }

  function openContactForm(contact?: Contact) {
    if (contact) {
      setEditingContact(contact); setContactName(contact.name); setContactEmail(contact.email || '')
      setContactPhone(contact.phone || ''); setContactCompany(contact.company || '')
      setContactAddress(contact.address || ''); setContactRole(contact.role)
      setContactTags(contact.tags || []); setContactNotes(contact.notes || '')
      setContactSource(contact.source || '')
    } else { resetContactForm() }
    setShowContactForm(true)
  }

  async function handleContactSave(e: React.FormEvent) {
    e.preventDefault()
    if (!contactName.trim()) return
    const payload = {
      name: contactName, email: contactEmail || undefined, phone: contactPhone || undefined,
      company: contactCompany || undefined, address: contactAddress || undefined, role: contactRole,
      tags: contactTags, notes: contactNotes || undefined, source: contactSource || undefined,
      user_id: user?.id
    }
    if (demoMode) {
      const now = new Date().toISOString()
      if (editingContact) {
        setContacts(prev => prev.map(c => c.id === editingContact.id ? { ...c, ...payload, updatedAt: now } as any : c))
      } else {
        setContacts(prev => [{ ...payload, id: `cont-${Date.now()}`, createdAt: now, updatedAt: now } as any, ...prev])
      }
      setShowContactForm(false); resetContactForm(); return
    }
    try {
      if (editingContact) {
        const { error } = await supabase.from('contacts').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editingContact.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('contacts').insert(payload)
        if (error) throw error
      }
      setShowContactForm(false); resetContactForm(); fetchContacts()
    } catch (err: any) { setError(err.message || 'Failed to save contact') }
  }

  async function handleContactDelete(id: string) {
    if (!confirm('Delete this contact?')) return
    if (demoMode) { setContacts(prev => prev.filter(c => c.id !== id)); return }
    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id)
      if (error) throw error
      setContacts(prev => prev.filter(c => c.id !== id))
    }
    catch { setError('Failed to delete contact') }
  }

  const filteredContacts = contacts.filter(c => {
    const matchSearch = !contactSearch || c.name.toLowerCase().includes(contactSearch.toLowerCase()) || c.email?.toLowerCase().includes(contactSearch.toLowerCase()) || c.phone?.includes(contactSearch) || c.company?.toLowerCase().includes(contactSearch.toLowerCase())
    const matchRole = !contactRoleFilter || c.role === contactRoleFilter
    return matchSearch && matchRole
  })

  // Bulk actions
  function toggleSelectItem(id: string) {
    setSelectedItems(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  function toggleSelectAll() {
    if (selectedItems.size === filteredItems.length) { setSelectedItems(new Set()) }
    else { setSelectedItems(new Set(filteredItems.map(i => i.id))) }
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selectedItems.size} items?`)) return
    if (demoMode) { setItems(prev => prev.filter(i => !selectedItems.has(i.id))); setSelectedItems(new Set()); setBulkMode(false); return }
    const ids = Array.from(selectedItems)
    if (!demoMode) {
      const { error } = await supabase.from('crm_items').delete().in('id', ids)
      if (error) { setError('Failed to delete some items'); return }
    }
    setItems(prev => prev.filter(i => !selectedItems.has(i.id))); setSelectedItems(new Set()); setBulkMode(false)
  }

  async function handleBulkStatusChange(newStatus: string) {
    if (demoMode) {
      setItems(prev => prev.map(i => selectedItems.has(i.id) ? { ...i, status: newStatus, updatedAt: new Date().toISOString() } : i))
      setSelectedItems(new Set()); return
    }
    const ids = Array.from(selectedItems)
    if (!demoMode) {
      const { error } = await supabase.from('crm_items').update({ status: newStatus, updated_at: new Date().toISOString() }).in('id', ids)
      if (error) { setError('Failed to update status'); return }
    }
    fetchItems(tab === 'dashboard' ? undefined : activeType || undefined); setSelectedItems(new Set())
  }

  // CSV Export
  function exportCSV() {
    const dataToExport = tab === 'contacts' ? contacts : filteredItems
    if (dataToExport.length === 0) return

    let csv = ''
    if (tab === 'contacts') {
      csv = 'Name,Email,Phone,Company,Address,Role,Tags,Notes,Source\n'
      contacts.forEach(c => {
        csv += `"${c.name}","${c.email || ''}","${c.phone || ''}","${c.company || ''}","${c.address || ''}","${c.role}","${(c.tags || []).join(';')}","${(c.notes || '').replace(/"/g, '""')}","${c.source || ''}"\n`
      })
    } else {
      csv = 'Name,Email,Phone,Address,Type,Status,Amount,Notes,Created,Updated\n'
      filteredItems.forEach(i => {
        csv += `"${i.name}","${i.email || ''}","${i.phone || ''}","${i.address || ''}","${i.type}","${i.status}","${i.amount || ''}","${(i.notes || '').replace(/"/g, '""')}","${i.createdAt}","${i.updatedAt}"\n`
      })
    }

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `crm-${tab}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  // CSV Import
  function handleCSVImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter(l => l.trim())
      if (lines.length < 2) { setError('CSV file is empty or has no data rows'); return }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase())
      const nameIdx = headers.findIndex(h => h === 'name')
      if (nameIdx === -1) { setError('CSV must have a "Name" column'); return }

      let imported = 0
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].match(/("([^"]|"")*"|[^,]*)/g)?.map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"')) || []
        const name = values[nameIdx]?.trim()
        if (!name) continue

        const getVal = (key: string) => { const idx = headers.indexOf(key); return idx >= 0 ? values[idx]?.trim() || undefined : undefined }

        if (tab === 'contacts') {
          const payload = { 
            name, 
            email: getVal('email'), 
            phone: getVal('phone'), 
            company: getVal('company'), 
            address: getVal('address'), 
            role: getVal('role') || 'other', 
            tags: getVal('tags')?.split(';').filter(Boolean) || [], 
            notes: getVal('notes'), 
            source: getVal('source'),
            user_id: user?.id
          }
          if (demoMode) {
            const now = new Date().toISOString()
            setContacts(prev => [...prev, { ...payload, id: `cont-${Date.now()}-${i}`, createdAt: now, updatedAt: now } as any])
          } else {
            await supabase.from('contacts').insert(payload)
          }
        } else {
          const itemType = activeType || 'lead'
          const payload = { 
            type: itemType, 
            name, 
            email: getVal('email'), 
            phone: getVal('phone'), 
            address: getVal('address'), 
            status: getVal('status') || 'New', 
            amount: getVal('amount') ? Number(getVal('amount')) : undefined, 
            notes: getVal('notes'),
            user_id: user?.id
          }
          if (demoMode) {
            const now = new Date().toISOString()
            setItems(prev => [...prev, { ...payload, id: `import-${Date.now()}-${i}`, createdAt: now, updatedAt: now } as any])
          } else {
            await supabase.from('crm_items').insert(payload)
          }
        }
        imported++
      }

      if (!demoMode) {
        tab === 'contacts' ? fetchContacts() : fetchItems(activeType || undefined)
      }
      setError('')
      alert(`Successfully imported ${imported} records!`)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // Reports computed data
  function getReportData() {
    const now = new Date()
    const periodMs = reportPeriod === '7d' ? 7 * 86400000 : reportPeriod === '30d' ? 30 * 86400000 : reportPeriod === '90d' ? 90 * 86400000 : Infinity
    const cutoff = periodMs === Infinity ? 0 : now.getTime() - periodMs

    const periodItems = items.filter(i => new Date(i.createdAt).getTime() >= cutoff)
    const periodActivities = activities.filter(a => new Date(a.createdAt).getTime() >= cutoff)

    const leadsByStatus: Record<string, number> = {}
    const offersByStatus: Record<string, number> = {}
    periodItems.forEach(i => {
      if (i.type === 'lead') leadsByStatus[i.status] = (leadsByStatus[i.status] || 0) + 1
      if (i.type === 'offer') offersByStatus[i.status] = (offersByStatus[i.status] || 0) + 1
    })

    const activityByType: Record<string, number> = {}
    periodActivities.forEach(a => { activityByType[a.type] = (activityByType[a.type] || 0) + 1 })

    const totalLeads = periodItems.filter(i => i.type === 'lead').length
    const convertedLeads = periodItems.filter(i => i.type === 'lead' && i.status === 'Converted').length
    const acceptedOffers = periodItems.filter(i => i.type === 'offer' && i.status === 'Accepted').length
    const totalOffers = periodItems.filter(i => i.type === 'offer').length
    const totalRevenue = periodItems.filter(i => i.type === 'offer' && i.status === 'Accepted').reduce((s, i) => s + (parseFloat(i.amount || '0') || 0), 0)
    const avgDealSize = acceptedOffers > 0 ? totalRevenue / acceptedOffers : 0

    const closedPipelineDeals = (pipelineData['Closed'] || []).length
    const pipelineTotalCount = Object.values(pipelineData).flat().length

    return {
      totalLeads, convertedLeads, totalOffers, acceptedOffers, totalRevenue, avgDealSize,
      leadsByStatus, offersByStatus, activityByType,
      conversionRate: totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0,
      offerAcceptRate: totalOffers > 0 ? Math.round((acceptedOffers / totalOffers) * 100) : 0,
      pipelineCloseRate: pipelineTotalCount > 0 ? Math.round((closedPipelineDeals / pipelineTotalCount) * 100) : 0,
      totalActivities: periodActivities.length,
      completedTasks: tasks.filter(t => t.status === 'done').length,
      pendingTasks: tasks.filter(t => t.status !== 'done').length,
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone?.includes(searchQuery) ||
      item.address?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const dashboardStats = {
    leads: items.filter(i => i.type === 'lead').length,
    offers: items.filter(i => i.type === 'offer').length,
    sent: items.filter(i => i.type === 'sent').length,
    totalValue: items.reduce((sum, i) => sum + (parseFloat(i.amount || '0') || 0), 0),
    recentItems: items.slice(0, 5),
  }

  /* ---- Auth screen ---- */

  if (authLoading) {
    return (
      <div style={{ minHeight: '100dvh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} color="#ff7e5f" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!user && !demoMode) {
    return (
      <div style={{ minHeight: '100dvh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6b6560', fontSize: 13, textDecoration: 'none', marginBottom: 28, transition: 'color 0.2s' }}>
            <ChevronLeft size={16} /> Back to Home
          </Link>

          <div className="animate-fade-in-up" style={{
            background: 'rgba(38,48,64,0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(61,78,101,0.6)', borderRadius: 20, padding: '36px 32px',
            boxShadow: '0 16px 64px rgba(0,0,0,0.3)',
          }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14, margin: '0 auto 14px',
                background: 'linear-gradient(135deg, #ff7e5f, #e86830)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#000', fontWeight: 700,
                boxShadow: '0 4px 16px rgba(255,126,95,0.3)',
              }}>CRM</div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0 }}>
                Deal Command Center
              </h1>
              <p style={{ color: '#6b6560', fontSize: 13, marginTop: 6 }}>Manage your leads, offers & wholesale deals</p>
            </div>

            {confirmationSent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(92,184,133,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Mail size={24} color="#5cb885" />
                </div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb', margin: '0 0 8px' }}>Check Your Email</h2>
                <p style={{ color: '#9a918a', fontSize: 14, lineHeight: 1.6 }}>
                  A confirmation link has been sent to <strong style={{ color: '#f5f0eb' }}>{authEmail}</strong>. Click the link to activate your account.
                </p>
                <button
                  onClick={() => { setConfirmationSent(false); setAuthView('login') }}
                  className="btn-ghost"
                  style={{ marginTop: 20 }}
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <>
                {/* Tab toggle */}
                <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: '#2e3a4d', borderRadius: 10, padding: 3 }}>
                  <button
                    onClick={() => { setAuthView('login'); setAuthError('') }}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                      background: authView === 'login' ? '#ff7e5f' : 'transparent',
                      color: authView === 'login' ? '#000' : '#9a918a',
                      transition: 'all 0.2s',
                    }}
                  >
                    <LogIn size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Log In
                  </button>
                  <button
                    onClick={() => { setAuthView('signup'); setAuthError('') }}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                      background: authView === 'signup' ? '#ff7e5f' : 'transparent',
                      color: authView === 'signup' ? '#000' : '#9a918a',
                      transition: 'all 0.2s',
                    }}
                  >
                    <UserPlus size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Sign Up
                  </button>
                </div>

                {authError && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={16} color="#ef4444" />
                    <span style={{ color: '#ef4444', fontSize: 13 }}>{authError}</span>
                  </div>
                )}

                <form onSubmit={authView === 'login' ? handleLogin : handleSignup}>
                  {authView === 'signup' && (
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Full Name</label>
                      <input
                        className="input-dark"
                        type="text"
                        value={authName}
                        onChange={e => setAuthName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  )}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
                    <input
                      className="input-dark"
                      type="email"
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
                    <input
                      className="input-dark"
                      type="password"
                      value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-orange"
                    disabled={authSubmitting}
                    style={{ width: '100%', justifyContent: 'center', opacity: authSubmitting ? 0.7 : 1 }}
                  >
                    {authSubmitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                    {authView === 'login' ? 'Log In' : 'Create Account'}
                  </button>
                </form>

                {/* Demo mode button */}
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #3d4e65', textAlign: 'center' }}>
                  <p style={{ color: '#6b6560', fontSize: 12, marginBottom: 12 }}>Want to see how it works first?</p>
                  <button
                    onClick={enterDemoMode}
                    style={{
                      width: '100%', padding: '12px 0', borderRadius: 10, border: '1px solid #3d4e65',
                      background: 'rgba(255,255,255,0.03)', cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                      color: '#5ba3d9', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    <Eye size={16} />
                    Try Demo — No Sign Up Needed
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ---- CRM App ---- */

  const activeType: CrmItem['type'] | null = tab === 'leads' ? 'lead' : tab === 'offers' ? 'offer' : tab === 'sent' ? 'sent' : null
  const tabLabel = tab === 'leads' ? 'Lead' : tab === 'offers' ? 'Offer' : tab === 'sent' ? 'Sent Item' : ''

  // Computed pipeline stats for dashboard
  const pipelineTotal = Object.values(pipelineData).flat().length
  const pipelineValue = Object.values(pipelineData).flat().reduce((s, d) => s + (parseFloat(d.amount || '0') || 0), 0)
  const closedDeals = (pipelineData['Closed'] || []).length
  const activeDeals = pipelineTotal - closedDeals
  const conversionRate = pipelineTotal > 0 ? Math.round((closedDeals / pipelineTotal) * 100) : 0

  return (
    <div style={{ minHeight: '100dvh', background: 'transparent' }}>
      {/* Top bar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(18,22,28,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(47,58,74,0.5)',
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              type="button"
              onClick={() => {
                // Return to previous page in browser history
                if (window.history.length > 1) {
                  router.history.back()
                } else {
                  // Fallback when history is empty
                  router.navigate({ to: (from !== '/' ? from : '/properties') as any })
                }
              }}
              style={{
                color: '#f5f0eb', background: 'transparent',
                border: '1px solid #3d4e65', borderRadius: 8,
                padding: '6px', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #ff7e5f, #e86830)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: '#000', fontWeight: 700,
              boxShadow: '0 2px 8px rgba(255,126,95,0.25)',
            }}>CRM</div>
            <div>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.06em', color: '#f5f0eb', display: 'block', lineHeight: 1.1 }}>
                Deal Command Center
              </span>
              <span style={{ fontSize: 11, color: '#4a4440', letterSpacing: '0.02em' }}>Wholesale CRM</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <GlobalSearch />
            {demoMode ? (
              <span className="badge badge-green" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Shield size={10} /> PRO ACCESS
              </span>
            ) : (
              <span style={{ color: '#6b6560', fontSize: 12 }} className="crm-user-email">{user?.email}</span>
            )}
            <Link
              to={from as '/'}
              onClick={() => {
                if (demoMode) exitDemo()
                else handleLogout()
              }}
              className="crm-back-to-hub-btn"
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid #3d4e65', borderRadius: 10,
                padding: '8px 14px', cursor: 'pointer', color: '#9a918a', display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, transition: 'all 0.2s', textDecoration: 'none'
              }}
            >
              <LogOut size={14} /> <span className="crm-logout-text">{demoMode ? 'Back to Hub' : 'Logout'}</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile hamburger overlay */}
      {sidebarMobileOpen && (
        <div className="crm-sidebar-overlay" onClick={() => setSidebarMobileOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 89, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
        }} />
      )}

      {/* Sidebar + Main layout */}
      <div className="crm-layout" style={{ display: 'flex', minHeight: 'calc(100dvh - 64px)' }}>
        {/* Sidebar navigation */}
        <aside className={`crm-sidebar ${sidebarCollapsed ? 'crm-sidebar-collapsed' : ''} ${sidebarMobileOpen ? 'crm-sidebar-mobile-open' : ''}`} style={{
          width: sidebarCollapsed ? 68 : 240,
          background: 'rgba(24,30,40,0.98)', borderRight: '1px solid rgba(47,58,74,0.5)',
          position: 'sticky', top: 64, height: 'calc(100dvh - 64px)',
          overflowY: 'auto', overflowX: 'hidden',
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
          flexShrink: 0, zIndex: 90,
          scrollbarWidth: 'thin', scrollbarColor: '#3d4e65 transparent',
        }}>
          {/* Collapse toggle */}
          <div className="crm-sidebar-collapse-row" style={{ padding: sidebarCollapsed && !sidebarMobileOpen ? '12px 8px' : '12px 16px', borderBottom: '1px solid rgba(47,58,74,0.3)', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed && !sidebarMobileOpen ? 'center' : 'flex-end' }}>
            <button
              onClick={() => { setSidebarCollapsed(!sidebarCollapsed); setSidebarMobileOpen(false) }}
              className="crm-sidebar-toggle"
              style={{
                background: 'none', border: '1px solid rgba(47,58,74,0.4)', borderRadius: 8,
                cursor: 'pointer', color: '#6b6560', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>

          {/* Nav groups */}
          <nav style={{ padding: sidebarCollapsed && !sidebarMobileOpen ? '8px 6px' : '8px 12px' }}>
            {([
              { group: 'Overview', items: [
                { id: 'dashboard' as CrmTab, label: 'Dashboard', icon: LayoutDashboard },
              ]},
              { group: 'Records', items: [
                { id: 'leads' as CrmTab, label: 'Leads', icon: Users },
                { id: 'offers' as CrmTab, label: 'Offers', icon: FileText },
                { id: 'sent' as CrmTab, label: 'Outreach', icon: Send },
                { id: 'contacts' as CrmTab, label: 'Contacts', icon: ContactIcon },
              ]},
              { group: 'Pipeline', items: [
                { id: 'pipeline' as CrmTab, label: 'Deal Pipeline', icon: Kanban },
                { id: 'leadpipeline' as CrmTab, label: 'Lead Pipeline', icon: Target },
                { id: 'leadimporter' as CrmTab, label: 'Lead Importer', icon: Upload },
                { id: 'dealtracker' as CrmTab, label: 'Deal Tracker', icon: Flag },
                { id: 'dealmaker' as CrmTab, label: 'Deal Maker', icon: Zap },
              ]},
              { group: 'Workflow', items: [
                { id: 'tasks' as CrmTab, label: 'Tasks', icon: ListTodo },
                { id: 'activities' as CrmTab, label: 'Activities', icon: ClipboardList },
                { id: 'activityfeed' as CrmTab, label: 'Activity Feed', icon: Activity },
              ]},
              { group: 'Analytics', items: [
                { id: 'dealscore' as CrmTab, label: 'Deal Score', icon: Gauge },
                { id: 'reports' as CrmTab, label: 'Reports', icon: BarChart3 },
              ]},
            ]).map((section) => (
              <div key={section.group} style={{ marginBottom: 8 }}>
                {(!sidebarCollapsed || sidebarMobileOpen) && (
                  <div style={{
                    fontSize: 10, color: '#4a4440', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700,
                    padding: '10px 10px 6px', fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {section.group}
                  </div>
                )}
                {sidebarCollapsed && !sidebarMobileOpen && (
                  <div style={{ height: 1, background: 'rgba(47,58,74,0.3)', margin: '6px 4px' }} />
                )}
                {section.items.map((t) => {
                  const isActive = tab === t.id
                  const isIconOnly = sidebarCollapsed && !sidebarMobileOpen
                  const badgeCount = t.id === 'pipeline' ? pipelineTotal
                    : t.id === 'activities' ? activities.length
                    : t.id === 'tasks' ? tasks.filter(tk => tk.status !== 'done').length
                    : t.id === 'contacts' ? contacts.length
                    : t.id === 'leads' ? items.filter(i => i.type === 'lead').length
                    : t.id === 'offers' ? items.filter(i => i.type === 'offer').length
                    : t.id === 'sent' ? items.filter(i => i.type === 'sent').length
                    : 0
                  return (
                    <button
                      key={t.id}
                      onClick={() => { setTab(t.id); setSearchQuery(''); setStatusFilter(''); setViewingItem(null); setSidebarMobileOpen(false) }}
                      className={`crm-sidebar-item ${isActive ? 'crm-sidebar-item-active' : ''}`}
                      title={isIconOnly ? t.label : undefined}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: isIconOnly ? '10px 0' : '9px 10px',
                        justifyContent: isIconOnly ? 'center' : 'flex-start',
                        border: 'none', borderRadius: 8, cursor: 'pointer',
                        background: isActive ? 'rgba(255,126,95,0.1)' : 'transparent',
                        color: isActive ? '#ff7e5f' : '#8a8380',
                        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: isActive ? 600 : 400,
                        transition: 'all 0.15s', position: 'relative',
                        borderLeft: isActive ? '3px solid #ff7e5f' : '3px solid transparent',
                      }}
                    >
                      <t.icon size={isIconOnly ? 20 : 16} style={{ flexShrink: 0 }} />
                      {!isIconOnly && (
                        <>
                          <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.label}</span>
                          {badgeCount > 0 && (
                            <span style={{
                              background: isActive ? 'rgba(255,126,95,0.2)' : 'rgba(255,255,255,0.06)',
                              color: isActive ? '#ff7e5f' : '#6b6560',
                              padding: '1px 7px', borderRadius: 10, fontSize: 10, fontWeight: 700,
                              minWidth: 18, textAlign: 'center',
                            }}>
                              {badgeCount}
                            </span>
                          )}
                        </>
                      )}
                      {isIconOnly && badgeCount > 0 && (
                        <span style={{
                          position: 'absolute', top: 4, right: 8,
                          width: 7, height: 7, borderRadius: '50%',
                          background: isActive ? '#ff7e5f' : '#6b6560',
                        }} />
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content area */}
        <div className="crm-main-area" style={{ flex: 1, minWidth: 0 }}>
          {/* Breadcrumb bar */}
          <div className="crm-breadcrumb-bar" style={{
            background: 'rgba(38,48,64,0.4)', borderBottom: '1px solid rgba(61,78,101,0.3)',
            padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <button
              className="crm-mobile-menu-btn"
              onClick={() => setSidebarMobileOpen(!sidebarMobileOpen)}
              style={{
                background: 'none', border: '1px solid #3d4e65', borderRadius: 8,
                cursor: 'pointer', color: '#6b6560', padding: '6px 8px',
                display: 'none', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Menu size={18} />
            </button>
            <span style={{ fontSize: 12, color: '#4a4440' }}>CRM</span>
            <ChevronRight size={12} color="#3d4e65" />
            <span style={{ fontSize: 12, color: '#9a918a', fontWeight: 500 }}>
              {tab === 'dashboard' ? 'Dashboard' : tab === 'leads' ? 'Leads' : tab === 'offers' ? 'Offers' : tab === 'sent' ? 'Outreach' : tab === 'contacts' ? 'Contacts' : tab === 'pipeline' ? 'Deal Pipeline' : tab === 'leadpipeline' ? 'Lead Pipeline' : tab === 'leadimporter' ? 'Lead Importer' : tab === 'dealtracker' ? 'Deal Tracker' : tab === 'tasks' ? 'Tasks' : tab === 'activities' ? 'Activities' : tab === 'activityfeed' ? 'Activity Feed' : tab === 'dealscore' ? 'Deal Score' : tab === 'reports' ? 'Reports' : ''}
            </span>
          </div>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 24px 60px' }}>
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, backdropFilter: 'blur(8px)' }}>
            <AlertCircle size={16} color="#ef4444" />
            <span style={{ color: '#ef4444', fontSize: 13, flex: 1 }}>{error}</span>
            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}><X size={16} /></button>
          </div>
        )}

        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div className="animate-fade-in">
            {/* Dashboard header with greeting */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#f5f0eb', letterSpacing: '0.04em', marginBottom: 4, lineHeight: 1.1 }}>
                Welcome Back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
              </h2>
              <p style={{ fontSize: 14, color: '#6b6560' }}>
                Here's your wholesale business at a glance
              </p>
            </div>

            {/* Primary KPI row */}
            <div className="crm-stats-grid" style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Active Leads', value: dashboardStats.leads, icon: Users, color: '#5ba3d9', sub: `${items.filter(i => i.type === 'lead' && i.status === 'Qualified').length} qualified`, onClick: () => setTab('leads') },
                { label: 'Open Offers', value: dashboardStats.offers, icon: FileText, color: '#a855f7', sub: `${items.filter(i => i.type === 'offer' && i.status === 'Negotiating').length} negotiating`, onClick: () => setTab('offers') },
                { label: 'Outreach', value: dashboardStats.sent, icon: Send, color: '#5cb885', sub: `${items.filter(i => i.type === 'sent' && i.status === 'Responded').length} responded`, onClick: () => setTab('sent') },
                { label: 'Pipeline Value', value: `$${(dashboardStats.totalValue + pipelineValue).toLocaleString()}`, icon: DollarSign, color: '#ffb347', sub: `${activeDeals} active deal${activeDeals !== 1 ? 's' : ''}` },
              ].map(stat => (
                <button
                  key={stat.label}
                  onClick={stat.onClick}
                  className="stat-counter crm-dashboard-stat"
                  style={{ cursor: stat.onClick ? 'pointer' : 'default', textAlign: 'left', width: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontSize: 11, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{stat.label}</span>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${stat.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <stat.icon size={18} color={stat.color} />
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#f5f0eb', letterSpacing: '0.02em', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 12, color: '#4a4440', marginTop: 6 }}>{stat.sub}</div>
                </button>
              ))}
            </div>

            {/* Secondary stats bar */}
            <div className="crm-secondary-stats" style={{
              display: 'grid', gap: 12, marginBottom: 28,
            }}>
              <div style={{
                background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 11, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Pipeline Deals</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb' }}>{pipelineTotal}</div>
                </div>
                <Kanban size={20} color="#ff7e5f" style={{ opacity: 0.5 }} />
              </div>
              <div style={{
                background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 11, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Closed Deals</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#5cb885' }}>{closedDeals}</div>
                </div>
                <CheckCircle2 size={20} color="#5cb885" style={{ opacity: 0.5 }} />
              </div>
              <div style={{
                background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 11, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Close Rate</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#a855f7' }}>{conversionRate}%</div>
                </div>
                <Target size={20} color="#a855f7" style={{ opacity: 0.5 }} />
              </div>
              <div style={{
                background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 11, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Reminders</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: overdueReminders.length > 0 ? '#ef4444' : '#e8a44a' }}>{upcomingReminders.length}</div>
                </div>
                <Bell size={20} color={overdueReminders.length > 0 ? '#ef4444' : '#e8a44a'} style={{ opacity: 0.5 }} />
              </div>
            </div>

            {/* Two-column layout: Recent + Quick Actions */}
            <div className="crm-dashboard-cols" style={{ display: 'grid', gap: 20 }}>
              {/* Recent activity */}
              <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid #3d4e65', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={16} color="#ff7e5f" />
                    Recent Activity
                  </h3>
                  <button onClick={openAddForm} className="btn-orange" style={{ padding: '8px 16px', fontSize: 13 }}>
                    <Plus size={14} /> Add New
                  </button>
                </div>
                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ width: '40%', height: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 8, animation: 'pulse 1.5s infinite' }} />
                          <div style={{ width: '20%', height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                        </div>
                        <div style={{ width: 60, height: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 10, animation: 'pulse 1.5s infinite' }} />
                      </div>
                    ))}
                    <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
                  </div>
                ) : dashboardStats.recentItems.length === 0 ? (
                  <div style={{ padding: 48, textAlign: 'center', color: '#6b6560' }}>
                    <Users size={36} style={{ margin: '0 auto 14px', opacity: 0.2 }} />
                    <p style={{ fontSize: 14, marginBottom: 4 }}>No items yet</p>
                    <p style={{ fontSize: 12, color: '#4a4440' }}>Add your first lead, offer, or sent item to get started.</p>
                  </div>
                ) : (
                  <div>
                    {dashboardStats.recentItems.map(item => (
                      <div
                        key={item.id}
                        style={{
                          padding: '14px 22px', borderBottom: '1px solid rgba(46,58,77,0.5)',
                          display: 'flex', alignItems: 'center', gap: 12,
                          transition: 'background 0.15s',
                        }}
                        className="crm-list-row"
                      >
                        <div style={{
                          width: 10, height: 10, borderRadius: '50%',
                          background: STATUS_COLORS[item.status] || '#6b6560', flexShrink: 0,
                          boxShadow: `0 0 6px ${STATUS_COLORS[item.status] || '#6b6560'}40`,
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, color: '#f5f0eb', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                          <div style={{ fontSize: 12, color: '#6b6560', display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
                            <span style={{
                              fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 4,
                              background: `${STATUS_COLORS[item.status] || '#6b6560'}15`,
                              color: STATUS_COLORS[item.status] || '#6b6560',
                              textTransform: 'capitalize',
                            }}>{item.type}</span>
                            <span>{item.status}</span>
                            {item.amount && <span style={{ color: '#ffb347' }}>${parseFloat(item.amount).toLocaleString()}</span>}
                          </div>
                        </div>
                        <span style={{ fontSize: 11, color: '#4a4440', whiteSpace: 'nowrap' }}>
                          {timeAgo(item.updatedAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick actions panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 14, padding: '20px 22px' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Gauge size={16} color="#ff7e5f" />
                    Quick Actions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: 'Add New Lead', icon: Users, color: '#5ba3d9', action: () => { setTab('leads'); setTimeout(openAddForm, 100) } },
                      { label: 'Score a Deal', icon: Gauge, color: '#a855f7', action: () => setTab('dealscore') },
                      { label: 'Deal Pipeline', icon: Kanban, color: '#ff7e5f', action: () => setTab('pipeline') },
                      { label: 'Log Activity', icon: ClipboardList, color: '#5cb885', action: () => setTab('activities') },
                      { label: 'Manage Tasks', icon: ListTodo, color: '#e8a44a', action: () => setTab('tasks') },
                      { label: 'View Reports', icon: BarChart3, color: '#a855f7', action: () => setTab('reports') },
                    ].map(action => (
                      <button
                        key={action.label}
                        onClick={action.action}
                        className="crm-quick-action"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                          background: 'rgba(255,255,255,0.02)', border: '1px solid #3d4e65', borderRadius: 10,
                          cursor: 'pointer', color: '#f5f0eb', fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                          fontWeight: 500, width: '100%', textAlign: 'left', transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${action.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <action.icon size={16} color={action.color} />
                        </div>
                        <span>{action.label}</span>
                        <ArrowRight size={14} color="#4a4440" style={{ marginLeft: 'auto' }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upcoming reminders preview */}
                {upcomingReminders.length > 0 && (
                  <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 14, padding: '20px 22px' }}>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <BellRing size={16} color={overdueReminders.length > 0 ? '#ef4444' : '#e8a44a'} />
                      Upcoming Reminders
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {upcomingReminders.slice(0, 3).map(a => {
                        const isOverdue = new Date(a.reminder!.date) < new Date()
                        return (
                          <div key={a.id} style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                            background: isOverdue ? 'rgba(239,68,68,0.06)' : 'rgba(232,164,74,0.04)',
                            borderRadius: 8, border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.15)' : 'rgba(232,164,74,0.1)'}`,
                          }}>
                            <Clock size={14} color={isOverdue ? '#ef4444' : '#e8a44a'} style={{ flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, color: '#f5f0eb', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.reminder!.note}</div>
                              <div style={{ fontSize: 11, color: isOverdue ? '#ef4444' : '#6b6560' }}>
                                {isOverdue ? 'OVERDUE - ' : ''}{new Date(a.reminder!.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {upcomingReminders.length > 3 && (
                        <button
                          onClick={() => setTab('activities')}
                          style={{ background: 'none', border: 'none', color: '#ff7e5f', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", padding: '4px 0', textAlign: 'left' }}
                        >
                          View all {upcomingReminders.length} reminders
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Tasks overview */}
                <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 14, padding: '20px 22px' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ListTodo size={16} color="#ff7e5f" />
                    Pending Tasks
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#6b6560', fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>
                      {tasks.filter(t => t.status !== 'done').length} remaining
                    </span>
                  </h3>
                  {tasks.filter(t => t.status !== 'done').length === 0 ? (
                    <p style={{ color: '#6b6560', fontSize: 12, textAlign: 'center', padding: '10px 0' }}>No pending tasks</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {tasks.filter(t => t.status !== 'done').slice(0, 4).map(task => {
                        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()
                        return (
                          <div key={task.id} style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                            background: isOverdue ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)',
                            borderRadius: 8, border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.15)' : '#3d4e65'}`,
                          }}>
                            <button onClick={() => quickToggleTask(task)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
                              <CircleDot size={16} color={PRIORITY_COLORS[task.priority]} />
                            </button>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, color: '#f5f0eb', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                              <div style={{ fontSize: 11, color: isOverdue ? '#ef4444' : '#6b6560' }}>
                                {task.dueDate ? `${isOverdue ? 'OVERDUE - ' : ''}${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}
                              </div>
                            </div>
                            <span style={{
                              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                              background: `${PRIORITY_COLORS[task.priority]}15`, color: PRIORITY_COLORS[task.priority],
                              textTransform: 'uppercase',
                            }}>{task.priority}</span>
                          </div>
                        )
                      })}
                      {tasks.filter(t => t.status !== 'done').length > 4 && (
                        <button onClick={() => setTab('tasks')} style={{ background: 'none', border: 'none', color: '#ff7e5f', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", padding: '4px 0', textAlign: 'left' }}>
                          View all {tasks.filter(t => t.status !== 'done').length} tasks
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* List views (Leads, Offers, Sent) */}
        {activeType && (
          <div className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0, lineHeight: 1.1 }}>
                  {tab === 'leads' ? 'Lead Management' : tab === 'offers' ? 'Offer Tracker' : 'Outreach & Campaigns'}
                </h2>
                <p style={{ fontSize: 13, color: '#6b6560', marginTop: 4 }}>
                  {tab === 'leads' ? 'Track and manage your motivated seller leads' : tab === 'offers' ? 'Monitor your offers and negotiations' : 'Track your marketing campaigns and outreach'}
                </p>
              </div>
              <button onClick={openAddForm} className="btn-orange" style={{ padding: '10px 20px', fontSize: 14 }}>
                <Plus size={16} /> Add {tabLabel}
              </button>
            </div>

            {/* Import/Export & Bulk Actions toolbar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={() => setBulkMode(!bulkMode)} style={{
                padding: '7px 14px', borderRadius: 8, border: '1px solid', fontSize: 12,
                borderColor: bulkMode ? '#ff7e5f' : '#3d4e65', background: bulkMode ? 'rgba(255,126,95,0.1)' : 'transparent',
                color: bulkMode ? '#ff7e5f' : '#6b6560', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s',
              }}>
                <CheckSquare size={13} /> {bulkMode ? 'Exit Bulk' : 'Bulk Actions'}
              </button>
              {bulkMode && selectedItems.size > 0 && (
                <>
                  <span style={{ fontSize: 12, color: '#ff7e5f', fontWeight: 600 }}>{selectedItems.size} selected</span>
                  <select onChange={e => { if (e.target.value) handleBulkStatusChange(e.target.value); e.target.value = '' }}
                    style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid #3d4e65', background: '#263040', color: '#f5f0eb', fontSize: 12, cursor: 'pointer' }}>
                    <option value="">Change Status...</option>
                    {STATUS_OPTIONS[activeType].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={handleBulkDelete} style={{
                    padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)',
                    color: '#ef4444', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <Trash2 size={13} /> Delete Selected
                  </button>
                </>
              )}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button onClick={exportCSV} style={{
                  padding: '7px 14px', borderRadius: 8, border: '1px solid #3d4e65', background: 'transparent',
                  color: '#6b6560', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s',
                }}>
                  <DownloadCloud size={13} /> Export CSV
                </button>
                <label style={{
                  padding: '7px 14px', borderRadius: 8, border: '1px solid #3d4e65', background: 'transparent',
                  color: '#6b6560', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s',
                }}>
                  <Upload size={13} /> Import CSV
                  <input type="file" accept=".csv" onChange={handleCSVImport} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* Status summary chips */}
            <div className="crm-status-chips" style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
              {STATUS_OPTIONS[activeType].map(s => {
                const count = items.filter(i => i.status === s).length
                if (count === 0) return null
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', borderRadius: 8, border: '1px solid',
                      borderColor: statusFilter === s ? (STATUS_COLORS[s] || '#3d4e65') : '#3d4e65',
                      background: statusFilter === s ? `${STATUS_COLORS[s] || '#6b6560'}15` : 'transparent',
                      color: statusFilter === s ? (STATUS_COLORS[s] || '#f5f0eb') : '#6b6560',
                      cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                      whiteSpace: 'nowrap', transition: 'all 0.2s',
                    }}
                  >
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: STATUS_COLORS[s] || '#6b6560',
                    }} />
                    {s}
                    <span style={{ fontWeight: 700, opacity: 0.7 }}>{count}</span>
                  </button>
                )
              })}
            </div>

            {/* Search & filter */}
            <div className="crm-filter-bar" style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
                <Search size={16} color="#6b6560" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  className="input-dark"
                  type="text"
                  placeholder="Search by name, email, phone, or address..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: 38 }}
                />
              </div>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <select
                  className="input-dark"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  style={{ appearance: 'none', paddingRight: 32, minWidth: 150, cursor: 'pointer' }}
                >
                  <option value="">All Status</option>
                  {STATUS_OPTIONS[activeType].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={14} color="#6b6560" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Result count */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: '#4a4440' }}>
                {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
                {(searchQuery || statusFilter) && ` (filtered from ${items.filter(i => i.type === activeType).length})`}
              </span>
            </div>

            {/* Items list */}
            <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 14, overflow: 'hidden' }}>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 16, background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ width: '60%', height: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                      <div style={{ width: '80%', height: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                      <div style={{ width: 60, height: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 10, animation: 'pulse 1.5s infinite' }} />
                      <div style={{ width: '40%', height: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                      <div style={{ width: 40, height: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                    </div>
                  ))}
                  <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
                </div>
              ) : filteredItems.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#6b6560' }}>
                  <p style={{ fontSize: 14 }}>
                    {searchQuery || statusFilter ? 'No items match your filters.' : `No ${tab} yet. Click "Add ${tabLabel}" to create one.`}
                  </p>
                </div>
              ) : (
                <div>
                  {/* Table header - desktop only */}
                  <div className="crm-table-header" style={{
                    display: 'none', padding: '10px 20px', borderBottom: '1px solid #3d4e65',
                    fontSize: 11, color: '#4a4440', textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>
                    {bulkMode && (
                      <button onClick={toggleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, marginRight: 8 }}>
                        {selectedItems.size === filteredItems.length ? <CheckSquare size={16} color="#ff7e5f" /> : <Square size={16} color="#6b6560" />}
                      </button>
                    )}
                    <span style={{ flex: 2 }}>Name</span>
                    <span style={{ flex: 1.5 }}>Contact</span>
                    <span style={{ flex: 1 }}>Status</span>
                    <span style={{ flex: 1 }}>{tab === 'leads' || tab === 'dashboard' ? 'Price' : 'Amount'}</span>
                    <span style={{ flex: 0.5, textAlign: 'right' }}>Actions</span>
                  </div>

                  {filteredItems.map(item => (
                    <div
                      key={item.id}
                      className="crm-list-row"
                      style={{
                        padding: '14px 20px', borderBottom: '1px solid #2e3a4d',
                        transition: 'background 0.15s', cursor: 'pointer',
                      }}
                      onClick={() => !bulkMode && setViewingItem(viewingItem?.id === item.id ? null : item)}
                    >
                      {/* Mobile / responsive card layout */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        {bulkMode && (
                          <button onClick={(e) => { e.stopPropagation(); toggleSelectItem(item.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, marginTop: 3, flexShrink: 0 }}>
                            {selectedItems.has(item.id) ? <CheckSquare size={18} color="#ff7e5f" /> : <Square size={18} color="#6b6560" />}
                          </button>
                        )}
                        <div style={{
                          width: 10, height: 10, borderRadius: '50%', marginTop: 5,
                          background: STATUS_COLORS[item.status] || '#6b6560', flexShrink: 0,
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 15, color: '#f5f0eb', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: 12, color: '#6b6560', marginTop: 2, display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
                                {item.email && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={10} /> {item.email}</span>}
                                {item.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={10} /> {item.phone}</span>}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                              <span style={{
                                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                                background: `${STATUS_COLORS[item.status] || '#6b6560'}20`,
                                color: STATUS_COLORS[item.status] || '#6b6560',
                              }}>
                                {item.status}
                              </span>
                            </div>
                          </div>

                          {/* Bottom row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#6b6560' }}>
                              {item.amount && (
                                <span style={{ color: '#ffb347', fontWeight: 600 }}>
                                  ${parseFloat(item.amount).toLocaleString()}
                                </span>
                              )}
                              {item.address && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <MapPin size={10} />
                                  <span style={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.address}</span>
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: 2 }} onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => setViewingItem(item)}
                                style={{
                                  background: 'none', border: 'none', cursor: 'pointer', color: '#6b6560',
                                  padding: 6, borderRadius: 6, transition: 'color 0.15s',
                                }}
                                title="View"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => openEditForm(item)}
                                style={{
                                  background: 'none', border: 'none', cursor: 'pointer', color: '#6b6560',
                                  padding: 6, borderRadius: 6, transition: 'color 0.15s',
                                }}
                                title="Edit"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                style={{
                                  background: 'none', border: 'none', cursor: 'pointer', color: '#6b6560',
                                  padding: 6, borderRadius: 6, transition: 'color 0.15s',
                                }}
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Expanded detail view */}
                          {viewingItem?.id === item.id && (
                            <div className="animate-slide-down" style={{
                              marginTop: 12, padding: '14px 16px',
                              background: '#2e3a4d', borderRadius: 10, border: '1px solid #3d4e65',
                            }}>
                              <div className="crm-detail-grid" style={{ display: 'grid', gap: '10px 20px' }}>
                                {item.email && (
                                  <div><span style={{ fontSize: 11, color: '#4a4440', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</span><div style={{ fontSize: 14, color: '#f5f0eb' }}>{item.email}</div></div>
                                )}
                                {item.phone && (
                                  <div><span style={{ fontSize: 11, color: '#4a4440', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Phone</span><div style={{ fontSize: 14, color: '#f5f0eb' }}>{item.phone}</div></div>
                                )}
                                {item.address && (
                                  <div><span style={{ fontSize: 11, color: '#4a4440', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Address</span><div style={{ fontSize: 14, color: '#f5f0eb' }}>{item.address}</div></div>
                                )}
                                {item.amount && (
                                  <div><span style={{ fontSize: 11, color: '#4a4440', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.type === 'lead' ? 'Price' : 'Amount'}</span><div style={{ fontSize: 14, color: '#ffb347', fontWeight: 600 }}>${parseFloat(item.amount).toLocaleString()}</div></div>
                                )}
                                <div><span style={{ fontSize: 11, color: '#4a4440', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Created</span><div style={{ fontSize: 13, color: '#9a918a' }}>{new Date(item.createdAt).toLocaleDateString()}</div></div>
                                <div><span style={{ fontSize: 11, color: '#4a4440', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Updated</span><div style={{ fontSize: 13, color: '#9a918a' }}>{new Date(item.updatedAt).toLocaleDateString()}</div></div>
                              </div>
                              {item.notes && (
                                <div style={{ marginTop: 12 }}>
                                  <span style={{ fontSize: 11, color: '#4a4440', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notes</span>
                                  <div style={{ fontSize: 13, color: '#9a918a', lineHeight: 1.6, marginTop: 4, whiteSpace: 'pre-wrap' }}>{item.notes}</div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pipeline Board */}
        {tab === 'pipeline' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0, lineHeight: 1.1 }}>
                  Deal Pipeline
                </h2>
                <p style={{ fontSize: 13, color: '#6b6560', marginTop: 4 }}>Drag deals between stages to update progress</p>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#6b6560' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff7e5f' }} />
                    {pipelineTotal} deals
                  </span>
                  <span style={{ color: '#ffb347', fontWeight: 600 }}>
                    ${pipelineValue.toLocaleString()} total
                  </span>
                </div>
              </div>
            </div>

            {pipelineLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginTop: 24, overflowX: 'auto' }}>
                {[1, 2, 3, 4, 5].map(col => (
                  <div key={col} style={{ background: '#263040', borderRadius: 12, padding: 16, border: '1px solid #3d4e65', minWidth: 280 }}>
                    <div style={{ width: '60%', height: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 16, animation: 'pulse 1.5s infinite' }} />
                    {[1, 2, 3].map(card => (
                      <div key={card} style={{ background: '#1e2530', padding: 14, borderRadius: 8, marginBottom: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ width: '80%', height: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 12, animation: 'pulse 1.5s infinite' }} />
                        <div style={{ width: '40%', height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 8, animation: 'pulse 1.5s infinite' }} />
                        <div style={{ width: '60%', height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div
                ref={boardScrollRef}
                className="pipeline-board"
                style={{
                  display: 'flex',
                  gap: 12,
                  overflowX: 'auto',
                  paddingBottom: 20,
                  WebkitOverflowScrolling: 'touch',
                  scrollSnapType: 'x mandatory',
                }}
              >
                {PIPELINE_STAGES.map(stage => {
                  const deals = pipelineData[stage] || []
                  const stageTotal = deals.reduce((s, d) => s + (parseFloat(d.amount || '0') || 0), 0)
                  return (
                    <div
                      key={stage}
                      className="pipeline-column"
                      onDragOver={e => handleDragOver(e, stage)}
                      onDragLeave={handleDragLeave}
                      onDrop={e => handleDrop(e, stage)}
                      style={{
                        background: dragOverStage === stage ? 'rgba(255,126,95,0.06)' : 'rgba(38,48,64,0.8)',
                        border: `1px solid ${dragOverStage === stage ? '#ff7e5f' : '#3d4e65'}`,
                        borderRadius: 14,
                        padding: 14,
                        minWidth: 260,
                        maxWidth: 300,
                        flex: '0 0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        scrollSnapAlign: 'start',
                        transition: 'border-color 0.2s, background 0.2s',
                      }}
                    >
                      {/* Column header */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 16 }}>{STAGE_ICONS[stage]}</span>
                            <span style={{
                              fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: '0.04em',
                              color: STAGE_COLORS[stage] || '#f5f0eb',
                            }}>{stage}</span>
                          </div>
                          <span style={{
                            background: `${STAGE_COLORS[stage] || '#6b6560'}20`,
                            color: STAGE_COLORS[stage] || '#6b6560',
                            fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 8,
                          }}>
                            {deals.length}
                          </span>
                        </div>
                        {stageTotal > 0 && (
                          <div style={{ fontSize: 11, color: '#6b6560' }}>
                            ${stageTotal.toLocaleString()}
                          </div>
                        )}
                        <div style={{
                          height: 3, borderRadius: 2, marginTop: 8,
                          background: `${STAGE_COLORS[stage] || '#3d4e65'}30`,
                        }}>
                          <div style={{
                            height: '100%', borderRadius: 2,
                            background: STAGE_COLORS[stage] || '#3d4e65',
                            width: `${Math.min(100, deals.length * 20)}%`,
                            transition: 'width 0.3s',
                          }} />
                        </div>
                      </div>

                      {/* Cards */}
                      <div style={{ flex: 1, minHeight: 60 }}>
                        {deals.map((deal, idx) => (
                          <div
                            key={deal.id}
                            draggable
                            onDragStart={() => handleDragStart(stage, idx)}
                            onDragEnd={() => setDragData(null)}
                            className="pipeline-card"
                            style={{
                              background: '#2e3a4d',
                              border: '1px solid #3d4e65',
                              borderRadius: 10,
                              padding: 12,
                              marginBottom: 8,
                              cursor: 'grab',
                              transition: 'transform 0.15s, box-shadow 0.15s',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                              <div style={{ fontSize: 14, fontWeight: 500, color: '#f5f0eb', lineHeight: 1.3, flex: 1, minWidth: 0 }}>
                                {deal.name}
                              </div>
                              <GripVertical size={14} color="#4a4440" style={{ flexShrink: 0, marginTop: 2 }} className="pipeline-grip" />
                            </div>
                            {deal.address && (
                              <div style={{ fontSize: 11, color: '#6b6560', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <MapPin size={10} style={{ flexShrink: 0 }} />
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{deal.address}</span>
                              </div>
                            )}
                            {deal.amount && (
                              <div style={{ fontSize: 13, color: '#ffb347', fontWeight: 600, marginTop: 6 }}>
                                ${parseFloat(deal.amount).toLocaleString()}
                              </div>
                            )}
                            {deal.notes && (
                              <div style={{ fontSize: 11, color: '#9a918a', marginTop: 6, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {deal.notes}
                              </div>
                            )}

                            {/* Card actions */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid #3d4e65' }}>
                              {/* Mobile move arrows */}
                              <div className="pipeline-move-btns" style={{ display: 'flex', gap: 2 }}>
                                {PIPELINE_STAGES.indexOf(stage) > 0 && (
                                  <button
                                    onClick={e => { e.stopPropagation(); moveDeal(deal.id, stage, 'prev') }}
                                    style={{
                                      background: 'rgba(255,255,255,0.04)', border: '1px solid #3d4e65', borderRadius: 6,
                                      padding: '4px 8px', cursor: 'pointer', color: '#6b6560', fontSize: 10,
                                      display: 'flex', alignItems: 'center', gap: 3,
                                    }}
                                    title={`Move to ${PIPELINE_STAGES[PIPELINE_STAGES.indexOf(stage) - 1]}`}
                                  >
                                    <ChevronLeft size={12} />
                                  </button>
                                )}
                                {PIPELINE_STAGES.indexOf(stage) < PIPELINE_STAGES.length - 1 && (
                                  <button
                                    onClick={e => { e.stopPropagation(); moveDeal(deal.id, stage, 'next') }}
                                    style={{
                                      background: 'rgba(255,255,255,0.04)', border: '1px solid #3d4e65', borderRadius: 6,
                                      padding: '4px 8px', cursor: 'pointer', color: '#6b6560', fontSize: 10,
                                      display: 'flex', alignItems: 'center', gap: 3,
                                    }}
                                    title={`Move to ${PIPELINE_STAGES[PIPELINE_STAGES.indexOf(stage) + 1]}`}
                                  >
                                    <ArrowRight size={12} />
                                  </button>
                                )}
                              </div>
                              <div style={{ display: 'flex', gap: 2 }}>
                                <button
                                  onClick={e => { e.stopPropagation(); openPipelineForm(stage, deal) }}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6560', padding: 4 }}
                                  title="Edit"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={e => { e.stopPropagation(); handlePipelineDelete(deal.id) }}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6560', padding: 4 }}
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add deal button */}
                      <button
                        onClick={() => openPipelineForm(stage)}
                        style={{
                          width: '100%', padding: '10px 0', marginTop: 8,
                          background: 'rgba(255,126,95,0.06)', border: '1px dashed rgba(255,126,95,0.3)',
                          borderRadius: 8, cursor: 'pointer',
                          fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                          color: '#ff7e5f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          transition: 'all 0.2s',
                        }}
                      >
                        <Plus size={14} /> Add Deal
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Lead Pipeline tab */}
        {tab === 'leadpipeline' && (
          <div className="animate-fade-in">
            <LeadPipeline />
          </div>
        )}

        {tab === 'leadimporter' && (
          <div className="animate-fade-in">
            <SmartLeadImporter />
          </div>
        )}

        {/* Activities Tab */}
        {tab === 'activities' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0, lineHeight: 1.1 }}>
                  Activity Log
                </h2>
                <p style={{ fontSize: 13, color: '#6b6560', marginTop: 4 }}>Track calls, emails, meetings, and notes</p>
              </div>
              <button onClick={() => openActivityForm()} className="btn-orange" style={{ padding: '10px 20px', fontSize: 14 }}>
                <Plus size={16} /> Log Activity
              </button>
            </div>

            {/* Upcoming Reminders Banner */}
            {upcomingReminders.length > 0 && (
              <div style={{
                background: overdueReminders.length > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(232,164,74,0.08)',
                border: `1px solid ${overdueReminders.length > 0 ? 'rgba(239,68,68,0.25)' : 'rgba(232,164,74,0.25)'}`,
                borderRadius: 12, padding: '16px 20px', marginBottom: 20,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <BellRing size={18} color={overdueReminders.length > 0 ? '#ef4444' : '#e8a44a'} />
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#f5f0eb', letterSpacing: '0.04em' }}>
                    {overdueReminders.length > 0 ? `${overdueReminders.length} Overdue Reminder${overdueReminders.length > 1 ? 's' : ''}` : `${upcomingReminders.length} Upcoming Reminder${upcomingReminders.length > 1 ? 's' : ''}`}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {upcomingReminders.slice(0, 4).map(a => {
                    const isOverdue = new Date(a.reminder!.date) < new Date()
                    return (
                      <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
                        <button onClick={() => toggleReminderComplete(a)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
                          {a.reminder!.completed ? <CheckCircle2 size={18} color="#5cb885" /> : <Clock size={18} color={isOverdue ? '#ef4444' : '#e8a44a'} />}
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, color: '#f5f0eb', fontWeight: 500 }}>{a.reminder!.note}</div>
                          <div style={{ fontSize: 11, color: isOverdue ? '#ef4444' : '#6b6560' }}>
                            {a.subject} · {isOverdue ? 'OVERDUE' : ''} {new Date(a.reminder!.date).toLocaleDateString()} {new Date(a.reminder!.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Filter bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {[
                { value: '', label: 'All', icon: ClipboardList },
                { value: 'call', label: 'Calls', icon: PhoneCall },
                { value: 'email', label: 'Emails', icon: Mail },
                { value: 'meeting', label: 'Meetings', icon: Video },
                { value: 'note', label: 'Notes', icon: StickyNote },
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setActivityFilter(f.value)}
                  style={{
                    padding: '8px 16px', borderRadius: 8, border: '1px solid',
                    borderColor: activityFilter === f.value ? '#ff7e5f' : '#3d4e65',
                    background: activityFilter === f.value ? 'rgba(255,126,95,0.1)' : 'transparent',
                    color: activityFilter === f.value ? '#ff7e5f' : '#6b6560',
                    cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                    display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                  }}
                >
                  <f.icon size={14} /> {f.label}
                </button>
              ))}
            </div>

            {/* Activity list */}
            {activitiesLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: '1px solid #3d4e65' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ width: '40%', height: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 8, animation: 'pulse 1.5s infinite' }} />
                      <div style={{ width: '80%', height: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (activities.filter(a => !activityFilter || a.type === activityFilter)).length === 0 ? (
              <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                <ClipboardList size={36} color="#3d4e65" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: '#6b6560', fontSize: 14 }}>No activities yet. Click "Log Activity" to track your first email, call, or meeting.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(activities.filter(a => !activityFilter || a.type === activityFilter)).map(activity => {
                  const typeIcons: Record<string, typeof Mail> = { email: Mail, call: PhoneCall, meeting: Video, note: StickyNote }
                  const typeColors: Record<string, string> = { email: '#5ba3d9', call: '#5cb885', meeting: '#a855f7', note: '#e8a44a' }
                  const Icon = typeIcons[activity.type] || StickyNote
                  const color = typeColors[activity.type] || '#6b6560'
                  return (
                    <div key={activity.id} style={{
                      background: '#263040', border: '1px solid #3d4e65', borderRadius: 12,
                      overflow: 'hidden', transition: 'border-color 0.2s',
                    }} className="crm-list-row">
                      <div style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                            background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Icon size={20} color={color} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 15, color: '#f5f0eb', fontWeight: 500, marginBottom: 2 }}>{activity.subject}</div>
                                <div style={{ fontSize: 12, color: '#6b6560', display: 'flex', flexWrap: 'wrap', gap: '2px 10px' }}>
                                  <span style={{ color, fontWeight: 600, textTransform: 'capitalize' }}>{activity.type}</span>
                                  {activity.contactName && <span>· {activity.contactName}</span>}
                                  {activity.dealName && <span>· {activity.dealName}</span>}
                                  <span>· {timeAgo(activity.createdAt)}</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                                <button onClick={() => openActivityForm(activity)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6560', padding: 4 }} title="Edit"><Edit3 size={15} /></button>
                                <button onClick={() => handleActivityDelete(activity.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6560', padding: 4 }} title="Delete"><Trash2 size={15} /></button>
                              </div>
                            </div>

                            {activity.description && (
                              <div style={{ fontSize: 13, color: '#9a918a', lineHeight: 1.6, marginTop: 8, whiteSpace: 'pre-wrap' }}>
                                {activity.description}
                              </div>
                            )}

                            {/* Contact info */}
                            {(activity.contactEmail || activity.contactPhone) && (
                              <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                                {activity.contactEmail && (
                                  <span style={{ fontSize: 12, color: '#6b6560', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Mail size={11} /> {activity.contactEmail}
                                  </span>
                                )}
                                {activity.contactPhone && (
                                  <span style={{ fontSize: 12, color: '#6b6560', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Phone size={11} /> {activity.contactPhone}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Attachments */}
                            {activity.attachments && activity.attachments.length > 0 && (
                              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                                {activity.attachments.map(att => (
                                  <div key={att.id} style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '6px 10px', background: '#2e3a4d', borderRadius: 8,
                                    border: '1px solid #3d4e65', fontSize: 12, color: '#9a918a',
                                  }}>
                                    <Paperclip size={12} />
                                    <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</span>
                                    <span style={{ color: '#4a4440' }}>({(att.size / 1024).toFixed(0)}KB)</span>
                                    {att.dataUrl && (
                                      <a href={att.dataUrl} download={att.name} style={{ color: '#5ba3d9', display: 'flex' }} onClick={e => e.stopPropagation()}><Download size={12} /></a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Reminder */}
                            {activity.reminder && (
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: 8, marginTop: 10,
                                padding: '8px 12px', borderRadius: 8,
                                background: activity.reminder.completed ? 'rgba(92,184,133,0.06)' : new Date(activity.reminder.date) < new Date() ? 'rgba(239,68,68,0.06)' : 'rgba(232,164,74,0.06)',
                                border: `1px solid ${activity.reminder.completed ? 'rgba(92,184,133,0.2)' : new Date(activity.reminder.date) < new Date() ? 'rgba(239,68,68,0.2)' : 'rgba(232,164,74,0.2)'}`,
                              }}>
                                <button onClick={() => toggleReminderComplete(activity)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                  {activity.reminder.completed ? <CheckCircle2 size={16} color="#5cb885" /> : <Bell size={16} color={new Date(activity.reminder.date) < new Date() ? '#ef4444' : '#e8a44a'} />}
                                </button>
                                <span style={{ fontSize: 12, color: activity.reminder.completed ? '#5cb885' : '#f5f0eb', textDecoration: activity.reminder.completed ? 'line-through' : 'none' }}>
                                  {activity.reminder.note}
                                </span>
                                <span style={{ fontSize: 11, color: '#6b6560', marginLeft: 'auto' }}>
                                  {new Date(activity.reminder.date).toLocaleDateString()} {new Date(activity.reminder.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Deal Score Tab */}
        {tab === 'dealscore' && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, color: '#f5f0eb', letterSpacing: '0.04em', marginBottom: 4, lineHeight: 1.1 }}>
                Deal Scorer
              </h2>
              <p style={{ fontSize: 13, color: '#6b6560' }}>Analyze properties and get instant investment ratings</p>
            </div>

            <div className="deal-score-layout" style={{ display: 'grid', gap: 24 }}>
              {/* Score Form */}
              <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: '24px 20px' }}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em', marginBottom: 16 }}>
                  Score a Deal
                </h3>
                <form onSubmit={handleScoreDeal}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Property Address *</label>
                      <input className="input-dark" type="text" value={scoreAddress} onChange={e => setScoreAddress(e.target.value)} placeholder="123 Main St, City, State" required />
                    </div>
                    <div className="crm-form-row" style={{ display: 'grid', gap: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Contract Price ($) *</label>
                        <input className="input-dark" type="number" value={scoreContractPrice} onChange={e => setScoreContractPrice(e.target.value)} placeholder="150000" required min="1" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>ARV ($)</label>
                        <input className="input-dark" type="number" value={scoreArv} onChange={e => setScoreArv(e.target.value)} placeholder="250000" min="0" />
                      </div>
                    </div>
                    <div className="crm-form-row" style={{ display: 'grid', gap: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Repair Estimate ($)</label>
                        <input className="input-dark" type="number" value={scoreRepairs} onChange={e => setScoreRepairs(e.target.value)} placeholder="25000" min="0" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Property Type</label>
                        <div style={{ position: 'relative' }}>
                          <select className="input-dark" value={scorePropertyType} onChange={e => setScorePropertyType(e.target.value)} style={{ appearance: 'none', paddingRight: 32, cursor: 'pointer' }}>
                            {['Single Family', 'Multi-Family', 'Duplex', 'Townhouse', 'Condo', 'Land', 'Commercial'].map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} color="#6b6560" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                      </div>
                    </div>
                    <div className="crm-form-row" style={{ display: 'grid', gap: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bedrooms</label>
                        <input className="input-dark" type="number" value={scoreBedrooms} onChange={e => setScoreBedrooms(e.target.value)} placeholder="3" min="0" max="20" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bathrooms</label>
                        <input className="input-dark" type="number" value={scoreBathrooms} onChange={e => setScoreBathrooms(e.target.value)} placeholder="2" min="0" max="20" />
                      </div>
                    </div>
                    <div className="crm-form-row" style={{ display: 'grid', gap: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sqft</label>
                        <input className="input-dark" type="number" value={scoreSqft} onChange={e => setScoreSqft(e.target.value)} placeholder="1500" min="0" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Year Built</label>
                        <input className="input-dark" type="number" value={scoreYearBuilt} onChange={e => setScoreYearBuilt(e.target.value)} placeholder="1995" min="1800" max="2026" />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn-orange" disabled={scoreLoading} style={{ width: '100%', justifyContent: 'center', marginTop: 20, opacity: scoreLoading ? 0.7 : 1 }}>
                    {scoreLoading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</> : <><Gauge size={16} /> Score This Deal</>}
                  </button>
                </form>
              </div>

              {/* Score Result */}
              {scoreResult && (
                <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: '24px 20px' }} className="animate-fade-in-up">
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Star size={20} color="#ffb347" /> Deal Score Results
                  </h3>

                  {/* Overall score gauge */}
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{
                      width: 120, height: 120, borderRadius: '50%', margin: '0 auto 12px',
                      background: `conic-gradient(${scoreResult.overall >= 70 ? '#5cb885' : scoreResult.overall >= 50 ? '#e8a44a' : '#ef4444'} ${scoreResult.overall * 3.6}deg, #2e3a4d 0deg)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#263040', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: scoreResult.overall >= 70 ? '#5cb885' : scoreResult.overall >= 50 ? '#e8a44a' : '#ef4444' }}>
                          {scoreResult.overall}
                        </span>
                        <span style={{ fontSize: 10, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Score</span>
                      </div>
                    </div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8,
                      background: scoreResult.overall >= 70 ? 'rgba(92,184,133,0.1)' : scoreResult.overall >= 50 ? 'rgba(232,164,74,0.1)' : 'rgba(239,68,68,0.1)',
                      color: scoreResult.overall >= 70 ? '#5cb885' : scoreResult.overall >= 50 ? '#e8a44a' : '#ef4444',
                      fontSize: 13, fontWeight: 600,
                    }}>
                      {scoreResult.overall >= 80 ? <><ArrowUpRight size={14} /> Strong Buy</> : scoreResult.overall >= 65 ? <><CheckCircle2 size={14} /> Good Deal</> : scoreResult.overall >= 50 ? <><AlertTriangle size={14} /> Caution</> : <><XCircle size={14} /> Pass</>}
                    </div>
                  </div>

                  {/* Breakdown bars */}
                  <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
                    {[
                      { label: 'Profit Potential', value: scoreResult.breakdown.profitPotential, color: '#5cb885' },
                      { label: 'Market Strength', value: scoreResult.breakdown.marketStrength, color: '#5ba3d9' },
                      { label: 'Investment Grade', value: scoreResult.breakdown.investmentGrade, color: '#a855f7' },
                      { label: 'Risk Level', value: scoreResult.breakdown.riskLevel, color: '#e8a44a' },
                    ].map(b => (
                      <div key={b.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>
                          <span>{b.label}</span>
                          <span style={{ color: b.color, fontWeight: 600 }}>{b.value}/100</span>
                        </div>
                        <div style={{ height: 8, background: '#2e3a4d', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${b.value}%`, background: b.color, borderRadius: 4, transition: 'width 0.6s ease-out' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Key Metrics */}
                  <div className="crm-stats-grid" style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
                    {[
                      { label: 'Est. Profit', value: `$${scoreResult.metrics.estimatedProfit.toLocaleString()}`, color: '#5cb885' },
                      { label: 'ROI', value: `${scoreResult.metrics.roi}%`, color: '#a855f7' },
                      { label: 'ARV Spread', value: `${scoreResult.metrics.arvSpread}%`, color: '#5ba3d9' },
                      { label: 'Repair/ARV', value: `${scoreResult.metrics.repairToArvRatio}%`, color: '#e8a44a' },
                    ].map(m => (
                      <div key={m.label} style={{
                        background: '#2e3a4d', borderRadius: 10, padding: '12px 14px',
                        border: '1px solid #3d4e65', textAlign: 'center',
                      }}>
                        <div style={{ fontSize: 10, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{m.label}</div>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: m.color }}>{m.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Analysis */}
                  <div style={{ background: '#2e3a4d', borderRadius: 10, padding: '14px 16px', border: '1px solid #3d4e65', marginBottom: 12 }}>
                    <span style={{ fontSize: 11, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Analysis</span>
                    <p style={{ fontSize: 13, color: '#9a918a', lineHeight: 1.6, marginTop: 6 }}>{scoreResult.analysis}</p>
                  </div>
                  <div style={{
                    background: scoreResult.overall >= 70 ? 'rgba(92,184,133,0.06)' : scoreResult.overall >= 50 ? 'rgba(232,164,74,0.06)' : 'rgba(239,68,68,0.06)',
                    borderRadius: 10, padding: '14px 16px',
                    border: `1px solid ${scoreResult.overall >= 70 ? 'rgba(92,184,133,0.2)' : scoreResult.overall >= 50 ? 'rgba(232,164,74,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  }}>
                    <span style={{ fontSize: 11, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recommendation</span>
                    <p style={{ fontSize: 13, color: '#f5f0eb', lineHeight: 1.6, marginTop: 6, fontWeight: 500 }}>{scoreResult.recommendation}</p>
                  </div>
                </div>
              )}

              {/* Score History */}
              {scoreHistory.length > 0 && (
                <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #3d4e65' }}>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0 }}>
                      Score History
                    </h3>
                  </div>
                  {scoreHistory.map((entry, i) => (
                    <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid #2e3a4d', display: 'flex', alignItems: 'center', gap: 12 }} className="crm-list-row">
                      <div style={{
                        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                        background: entry.score.overall >= 70 ? 'rgba(92,184,133,0.1)' : entry.score.overall >= 50 ? 'rgba(232,164,74,0.1)' : 'rgba(239,68,68,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Bebas Neue', sans-serif", fontSize: 20,
                        color: entry.score.overall >= 70 ? '#5cb885' : entry.score.overall >= 50 ? '#e8a44a' : '#ef4444',
                      }}>
                        {entry.score.overall}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, color: '#f5f0eb', fontWeight: 500 }}>{entry.address}</div>
                        <div style={{ fontSize: 12, color: '#6b6560', marginTop: 2 }}>
                          Profit: ${entry.score.metrics.estimatedProfit.toLocaleString()} · ROI: {entry.score.metrics.roi}% · {timeAgo(entry.timestamp)}
                        </div>
                      </div>
                      <button
                        onClick={() => setScoreResult(entry.score)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6560', padding: 4 }}
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {tab === 'tasks' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0, lineHeight: 1.1 }}>
                  Task Manager
                </h2>
                <p style={{ fontSize: 13, color: '#6b6560', marginTop: 4 }}>Organize your to-dos, deadlines, and follow-ups</p>
              </div>
              <button onClick={() => openTaskForm()} className="btn-orange" style={{ padding: '10px 20px', fontSize: 14 }}>
                <Plus size={16} /> New Task
              </button>
            </div>

            {/* Task stats */}
            <div className="crm-stats-grid" style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'To Do', value: taskStats.todo, color: '#5ba3d9', filter: 'todo' as const },
                { label: 'In Progress', value: taskStats.inProgress, color: '#e8a44a', filter: 'in_progress' as const },
                { label: 'Done', value: taskStats.done, color: '#5cb885', filter: 'done' as const },
                { label: 'Overdue', value: taskStats.overdue, color: '#ef4444', filter: 'all' as const },
              ].map(s => (
                <button key={s.label} onClick={() => setTaskFilter(s.filter)} style={{
                  background: '#263040', border: `1px solid ${taskFilter === s.filter && s.label !== 'Overdue' ? s.color : '#3d4e65'}`,
                  borderRadius: 12, padding: '14px 18px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                }}>
                  <div style={{ fontSize: 11, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: s.color }}>{s.value}</div>
                </button>
              ))}
            </div>

            {/* Task filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {(['all', 'todo', 'in_progress', 'done'] as const).map(f => (
                <button key={f} onClick={() => setTaskFilter(f)} style={{
                  padding: '8px 14px', borderRadius: 8, border: '1px solid',
                  borderColor: taskFilter === f ? '#ff7e5f' : '#3d4e65',
                  background: taskFilter === f ? 'rgba(255,126,95,0.1)' : 'transparent',
                  color: taskFilter === f ? '#ff7e5f' : '#6b6560',
                  cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
                }}>
                  {f === 'all' ? 'All' : f === 'todo' ? 'To Do' : f === 'in_progress' ? 'In Progress' : 'Done'}
                </button>
              ))}
            </div>

            {/* Task list */}
            {tasksLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#263040', padding: '16px 20px', borderRadius: 8, border: '1px solid #3d4e65' }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ width: '40%', height: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 8, animation: 'pulse 1.5s infinite' }} />
                      <div style={{ width: '20%', height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTasks.length === 0 ? (
              <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                <ListTodo size={36} color="#3d4e65" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: '#6b6560', fontSize: 14 }}>No tasks found. Create your first task to stay organized.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filteredTasks.map(task => {
                  const isOverdue = task.status !== 'done' && task.dueDate && new Date(task.dueDate) < new Date()
                  return (
                    <div key={task.id} style={{
                      background: '#263040', border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.3)' : '#3d4e65'}`,
                      borderRadius: 12, padding: '14px 18px', transition: 'all 0.2s',
                    }} className="crm-list-row">
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <button onClick={() => quickToggleTask(task)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, marginTop: 2, flexShrink: 0 }}>
                          {task.status === 'done' ? <CheckCircle2 size={22} color="#5cb885" /> : <CircleDot size={22} color={TASK_STATUS_COLORS[task.status] || '#6b6560'} />}
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                            <div style={{ minWidth: 0 }}>
                              <div style={{
                                fontSize: 15, color: task.status === 'done' ? '#6b6560' : '#f5f0eb', fontWeight: 500,
                                textDecoration: task.status === 'done' ? 'line-through' : 'none',
                              }}>{task.title}</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', marginTop: 4 }}>
                                <span style={{
                                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                                  background: `${PRIORITY_COLORS[task.priority]}15`, color: PRIORITY_COLORS[task.priority],
                                  textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 3,
                                }}>
                                  <Flag size={9} /> {PRIORITY_LABELS[task.priority]}
                                </span>
                                <span style={{
                                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                                  background: `${TASK_STATUS_COLORS[task.status]}15`, color: TASK_STATUS_COLORS[task.status],
                                }}>
                                  {TASK_STATUS_LABELS[task.status]}
                                </span>
                                {task.dueDate && (
                                  <span style={{
                                    fontSize: 11, color: isOverdue ? '#ef4444' : '#6b6560',
                                    display: 'flex', alignItems: 'center', gap: 4, fontWeight: isOverdue ? 600 : 400,
                                  }}>
                                    <CalendarDays size={11} />
                                    {isOverdue ? 'OVERDUE - ' : ''}{new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                              <button onClick={() => openTaskForm(task)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6560', padding: 4 }}><Edit3 size={15} /></button>
                              <button onClick={() => handleTaskDelete(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6560', padding: 4 }}><Trash2 size={15} /></button>
                            </div>
                          </div>
                          {task.description && <div style={{ fontSize: 13, color: '#9a918a', marginTop: 6, lineHeight: 1.5 }}>{task.description}</div>}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                            {task.contactName && <span style={{ fontSize: 11, color: '#6b6560', display: 'flex', alignItems: 'center', gap: 4 }}><Users size={10} /> {task.contactName}</span>}
                            {task.relatedDealName && <span style={{ fontSize: 11, color: '#6b6560', display: 'flex', alignItems: 'center', gap: 4 }}><FileText size={10} /> {task.relatedDealName}</span>}
                            {task.tags && task.tags.map((tag, ti) => (
                              <span key={tag} style={{
                                fontSize: 10, padding: '2px 8px', borderRadius: 4,
                                background: `${TAG_COLORS[ti % TAG_COLORS.length]}15`, color: TAG_COLORS[ti % TAG_COLORS.length],
                                display: 'flex', alignItems: 'center', gap: 3,
                              }}>
                                <Hash size={9} /> {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {tab === 'contacts' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0, lineHeight: 1.1 }}>
                  Contact Book
                </h2>
                <p style={{ fontSize: 13, color: '#6b6560', marginTop: 4 }}>Your network of sellers, buyers, agents, and service providers</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={exportCSV} style={{
                  padding: '10px 16px', borderRadius: 10, border: '1px solid #3d4e65', background: 'transparent',
                  color: '#6b6560', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                }}>
                  <DownloadCloud size={14} /> Export
                </button>
                <label style={{
                  padding: '10px 16px', borderRadius: 10, border: '1px solid #3d4e65', background: 'transparent',
                  color: '#6b6560', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                }}>
                  <Upload size={14} /> Import
                  <input type="file" accept=".csv" onChange={handleCSVImport} style={{ display: 'none' }} />
                </label>
                <button onClick={() => openContactForm()} className="btn-orange" style={{ padding: '10px 20px', fontSize: 14 }}>
                  <Plus size={16} /> Add Contact
                </button>
              </div>
            </div>

            {/* Role filter pills */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }} className="crm-status-chips">
              <button onClick={() => setContactRoleFilter('')} style={{
                padding: '6px 14px', borderRadius: 8, border: '1px solid', fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                borderColor: !contactRoleFilter ? '#ff7e5f' : '#3d4e65', background: !contactRoleFilter ? 'rgba(255,126,95,0.1)' : 'transparent',
                color: !contactRoleFilter ? '#ff7e5f' : '#6b6560', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}>All ({contacts.length})</button>
              {Object.entries(ROLE_LABELS).map(([key, label]) => {
                const count = contacts.filter(c => c.role === key).length
                if (count === 0) return null
                return (
                  <button key={key} onClick={() => setContactRoleFilter(contactRoleFilter === key ? '' : key)} style={{
                    padding: '6px 14px', borderRadius: 8, border: '1px solid', fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                    borderColor: contactRoleFilter === key ? (ROLE_COLORS[key] || '#3d4e65') : '#3d4e65',
                    background: contactRoleFilter === key ? `${ROLE_COLORS[key]}15` : 'transparent',
                    color: contactRoleFilter === key ? ROLE_COLORS[key] : '#6b6560',
                    cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: ROLE_COLORS[key] }} />
                    {label} <span style={{ fontWeight: 700, opacity: 0.7 }}>{count}</span>
                  </button>
                )
              })}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <Search size={16} color="#6b6560" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input className="input-dark" type="text" placeholder="Search contacts by name, email, phone, company..." value={contactSearch} onChange={e => setContactSearch(e.target.value)} style={{ paddingLeft: 38 }} />
            </div>

            {/* Contact list */}
            {contactsLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 16, marginTop: 16 }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#263040', padding: 20, borderRadius: 8, border: '1px solid #3d4e65' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ width: '60%', height: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 8, animation: 'pulse 1.5s infinite' }} />
                      <div style={{ width: '80%', height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredContacts.length === 0 ? (
              <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: 40, textAlign: 'center' }}>
                <ContactIcon size={36} color="#3d4e65" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: '#6b6560', fontSize: 14 }}>No contacts found. Add your first contact to build your network.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }} className="crm-contacts-grid">
                {filteredContacts.map(contact => (
                  <div key={contact.id} style={{
                    background: '#263040', border: '1px solid #3d4e65', borderRadius: 14, padding: '18px 20px',
                    transition: 'all 0.2s', cursor: 'pointer',
                  }} className="crm-list-row" onClick={() => setViewingContact(viewingContact?.id === contact.id ? null : contact)}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: `${ROLE_COLORS[contact.role] || '#6b6560'}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Bebas Neue', sans-serif", fontSize: 18,
                        color: ROLE_COLORS[contact.role] || '#6b6560',
                      }}>
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                          <div>
                            <div style={{ fontSize: 15, color: '#f5f0eb', fontWeight: 500 }}>{contact.name}</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 10px', fontSize: 12, color: '#6b6560', marginTop: 2 }}>
                              {contact.company && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={10} /> {contact.company}</span>}
                              <span style={{ color: ROLE_COLORS[contact.role], fontWeight: 600, fontSize: 11 }}>{ROLE_LABELS[contact.role]}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 2, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                            <button onClick={() => openContactForm(contact)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6560', padding: 4 }}><Edit3 size={15} /></button>
                            <button onClick={() => handleContactDelete(contact.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6560', padding: 4 }}><Trash2 size={15} /></button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', fontSize: 12, color: '#6b6560', marginTop: 6 }}>
                          {contact.email && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={10} /> {contact.email}</span>}
                          {contact.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={10} /> {contact.phone}</span>}
                          {contact.address && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} /> <span style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.address}</span></span>}
                        </div>
                        {contact.tags && contact.tags.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                            {contact.tags.map((tag, ti) => (
                              <span key={tag} style={{
                                fontSize: 10, padding: '2px 8px', borderRadius: 4,
                                background: `${TAG_COLORS[ti % TAG_COLORS.length]}15`, color: TAG_COLORS[ti % TAG_COLORS.length],
                                display: 'flex', alignItems: 'center', gap: 3,
                              }}>
                                <Hash size={9} /> {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {viewingContact?.id === contact.id && (
                          <div className="animate-slide-down" style={{ marginTop: 12, padding: '14px 16px', background: '#2e3a4d', borderRadius: 10, border: '1px solid #3d4e65' }}>
                            <div className="crm-detail-grid" style={{ display: 'grid', gap: '10px 20px' }}>
                              {contact.source && <div><span style={{ fontSize: 11, color: '#4a4440', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Source</span><div style={{ fontSize: 14, color: '#f5f0eb' }}>{contact.source}</div></div>}
                              <div><span style={{ fontSize: 11, color: '#4a4440', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Added</span><div style={{ fontSize: 13, color: '#9a918a' }}>{new Date(contact.createdAt).toLocaleDateString()}</div></div>
                            </div>
                            {contact.notes && (
                              <div style={{ marginTop: 12 }}>
                                <span style={{ fontSize: 11, color: '#4a4440', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notes</span>
                                <div style={{ fontSize: 13, color: '#9a918a', lineHeight: 1.6, marginTop: 4, whiteSpace: 'pre-wrap' }}>{contact.notes}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {tab === 'reports' && (
          <div className="animate-fade-in">
            <div className="print-header print-only">
              <h1>Flip the Contract — CRM Report</h1>
              <p>{reportPeriod === '7d' ? 'Last 7 Days' : reportPeriod === '30d' ? 'Last 30 Days' : reportPeriod === '90d' ? 'Last 90 Days' : 'All Time'} — Generated {new Date().toLocaleDateString()}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0, lineHeight: 1.1 }}>
                  Reports & Analytics
                </h2>
                <p style={{ fontSize: 13, color: '#6b6560', marginTop: 4 }}>Track your wholesale business performance</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['7d', '30d', '90d', 'all'] as const).map(p => (
                  <button key={p} onClick={() => setReportPeriod(p)} style={{
                    padding: '8px 14px', borderRadius: 8, border: '1px solid',
                    borderColor: reportPeriod === p ? '#ff7e5f' : '#3d4e65',
                    background: reportPeriod === p ? 'rgba(255,126,95,0.1)' : 'transparent',
                    color: reportPeriod === p ? '#ff7e5f' : '#6b6560',
                    cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
                  }}>
                    {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : 'All Time'}
                  </button>
                ))}
                <button
                  onClick={() => window.print()}
                  className="no-print"
                  style={{
                    padding: '8px 14px', borderRadius: 8, border: '1px solid #3d4e65',
                    background: 'transparent', color: '#6b6560',
                    cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <Printer size={14} /> Print Report
                </button>
              </div>
            </div>

            {(() => {
              const report = getReportData()
              return (
                <>
                  <div className="crm-stats-grid" style={{ display: 'grid', gap: 14, marginBottom: 24 }}>
                    {[
                      { label: 'Total Leads', value: report.totalLeads, color: '#5ba3d9', icon: Users },
                      { label: 'Conversion Rate', value: `${report.conversionRate}%`, color: '#5cb885', icon: TrendingUp },
                      { label: 'Offers Accepted', value: report.acceptedOffers, color: '#a855f7', icon: CheckCircle2 },
                      { label: 'Total Revenue', value: `$${report.totalRevenue.toLocaleString()}`, color: '#ffb347', icon: DollarSign },
                    ].map(kpi => (
                      <div key={kpi.label} className="stat-counter" style={{ textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                          <span style={{ fontSize: 11, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{kpi.label}</span>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${kpi.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <kpi.icon size={18} color={kpi.color} />
                          </div>
                        </div>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#f5f0eb', letterSpacing: '0.02em', lineHeight: 1 }}>{kpi.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="crm-dashboard-cols" style={{ display: 'grid', gap: 20, marginBottom: 24 }}>
                    <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 14, overflow: 'hidden' }}>
                      <div style={{ padding: '18px 22px', borderBottom: '1px solid #3d4e65' }}>
                        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Filter size={16} color="#ff7e5f" /> Lead Conversion Funnel
                        </h3>
                      </div>
                      <div style={{ padding: '20px 22px' }}>
                        {Object.entries(report.leadsByStatus).length === 0 ? (
                          <p style={{ color: '#6b6560', fontSize: 13, textAlign: 'center', padding: 20 }}>No lead data for this period</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {Object.entries(report.leadsByStatus).sort((a, b) => b[1] - a[1]).map(([status, count]) => {
                              const maxCount = Math.max(...Object.values(report.leadsByStatus))
                              const pct = maxCount > 0 ? (count / maxCount) * 100 : 0
                              return (
                                <div key={status}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[status] || '#6b6560' }} />
                                      {status}
                                    </span>
                                    <span style={{ fontWeight: 600, color: STATUS_COLORS[status] || '#6b6560' }}>{count}</span>
                                  </div>
                                  <div style={{ height: 8, background: '#2e3a4d', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${pct}%`, background: STATUS_COLORS[status] || '#6b6560', borderRadius: 4, transition: 'width 0.6s ease-out' }} />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 14, overflow: 'hidden' }}>
                      <div style={{ padding: '18px 22px', borderBottom: '1px solid #3d4e65' }}>
                        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <ClipboardList size={16} color="#ff7e5f" /> Activity Breakdown
                        </h3>
                      </div>
                      <div style={{ padding: '20px 22px' }}>
                        {report.totalActivities === 0 ? (
                          <p style={{ color: '#6b6560', fontSize: 13, textAlign: 'center', padding: 20 }}>No activity data for this period</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {[
                              { type: 'call', label: 'Calls', icon: PhoneCall, color: '#5cb885' },
                              { type: 'email', label: 'Emails', icon: Mail, color: '#5ba3d9' },
                              { type: 'meeting', label: 'Meetings', icon: Video, color: '#a855f7' },
                              { type: 'note', label: 'Notes', icon: StickyNote, color: '#e8a44a' },
                            ].map(at => {
                              const count = report.activityByType[at.type] || 0
                              return (
                                <div key={at.type} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${at.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <at.icon size={18} color={at.color} />
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#f5f0eb', marginBottom: 4 }}>
                                      <span>{at.label}</span>
                                      <span style={{ fontWeight: 600, color: at.color }}>{count}</span>
                                    </div>
                                    <div style={{ height: 6, background: '#2e3a4d', borderRadius: 3, overflow: 'hidden' }}>
                                      <div style={{ height: '100%', width: `${report.totalActivities > 0 ? (count / report.totalActivities) * 100 : 0}%`, background: at.color, borderRadius: 3, transition: 'width 0.6s' }} />
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="crm-secondary-stats" style={{ display: 'grid', gap: 14 }}>
                    {[
                      { label: 'Offer Accept Rate', value: `${report.offerAcceptRate}%`, color: '#a855f7', icon: FileText },
                      { label: 'Avg Deal Size', value: `$${report.avgDealSize.toLocaleString()}`, color: '#ffb347', icon: DollarSign },
                      { label: 'Pipeline Close Rate', value: `${report.pipelineCloseRate}%`, color: '#5cb885', icon: Target },
                      { label: 'Total Activities', value: report.totalActivities, color: '#5ba3d9', icon: ClipboardList },
                    ].map(m => (
                      <div key={m.label} style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: 11, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{m.label}</div>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: m.color }}>{m.value}</div>
                        </div>
                        <m.icon size={20} color={m.color} style={{ opacity: 0.5 }} />
                      </div>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
        )}

        {/* Deal Tracker Tab */}
        {tab === 'dealtracker' && (
          <div className="animate-fade-in">
            <DealTracker />
          </div>
        )}

        {/* Activity Feed Tab */}
        {tab === 'activityfeed' && (
          <div className="animate-fade-in">
            <ActivityFeed />
          </div>
        )}

        {tab === 'dealmaker' && (
          <div className="animate-fade-in">
            <DealMaker />
          </div>
        )}
      </main>
        </div>{/* end crm-main-area */}
      </div>{/* end crm-layout */}
      {showForm && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
          onClick={() => { setShowForm(false); resetForm() }}
        >
          <div
            className="animate-fade-in-up crm-form-modal"
            style={{
              background: 'rgba(38,48,64,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(61,78,101,0.6)', borderRadius: 20,
              padding: '28px 24px', width: '100%', maxWidth: 520,
              maxHeight: 'calc(100dvh - 40px)', overflowY: 'auto',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#ff7e5f', margin: 0 }}>
                {editingItem ? `Edit ${tabLabel || 'Item'}` : `New ${tabLabel || 'Lead'}`}
              </h3>
              <button onClick={() => { setShowForm(false); resetForm() }} style={{ background: 'none', border: 'none', color: '#6b6560', cursor: 'pointer', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Name *
                  </label>
                  <input className="input-dark" type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Contact or deal name" required />
                </div>

                <div className="crm-form-row" style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Email
                    </label>
                    <input className="input-dark" type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="email@example.com" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Phone
                    </label>
                    <input className="input-dark" type="tel" value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Address
                  </label>
                  <input className="input-dark" type="text" value={formAddress} onChange={e => setFormAddress(e.target.value)} placeholder="Property or contact address" />
                </div>

                <div className="crm-form-row" style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Status
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        className="input-dark"
                        value={formStatus}
                        onChange={e => setFormStatus(e.target.value)}
                        style={{ appearance: 'none', paddingRight: 32, cursor: 'pointer' }}
                      >
                        {STATUS_OPTIONS[editingItem?.type || (tab === 'offers' ? 'offer' : tab === 'sent' ? 'sent' : 'lead')].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} color="#6b6560" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {(editingItem?.type || (tab === 'offers' ? 'offer' : tab === 'sent' ? 'sent' : 'lead')) === 'lead' ? 'Price ($)' : 'Amount ($)'}
                    </label>
                    <input className="input-dark" type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="0" min="0" step="any" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Notes
                  </label>
                  <textarea
                    className="input-dark"
                    value={formNotes}
                    onChange={e => setFormNotes(e.target.value)}
                    placeholder="Additional details, follow-up reminders..."
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); resetForm() }} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-orange" style={{ flex: 1, justifyContent: 'center' }}>
                  <Save size={16} /> {editingItem ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pipeline Add/Edit modal */}
      {pipelineShowForm && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
          onClick={() => setPipelineShowForm(false)}
        >
          <div
            className="animate-fade-in-up crm-form-modal"
            style={{
              background: 'rgba(38,48,64,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(61,78,101,0.6)', borderRadius: 20,
              padding: '28px 24px', width: '100%', maxWidth: 520,
              maxHeight: 'calc(100dvh - 40px)', overflowY: 'auto',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#ff7e5f', margin: 0 }}>
                {pipelineEditDeal ? 'Edit Deal' : `New Deal — ${pipelineFormStage}`}
              </h3>
              <button onClick={() => setPipelineShowForm(false)} style={{ background: 'none', border: 'none', color: '#6b6560', cursor: 'pointer', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePipelineSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Deal Name *</label>
                  <input className="input-dark" type="text" value={pipelineFormName} onChange={e => setPipelineFormName(e.target.value)} placeholder="e.g. Johnson Property – Peachtree" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Property Address</label>
                  <input className="input-dark" type="text" value={pipelineFormAddress} onChange={e => setPipelineFormAddress(e.target.value)} placeholder="123 Main St, City, State ZIP" />
                </div>
                <div className="crm-form-row" style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Phone</label>
                    <input className="input-dark" type="tel" value={pipelineFormPhone} onChange={e => setPipelineFormPhone(e.target.value)} placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
                    <input className="input-dark" type="email" value={pipelineFormEmail} onChange={e => setPipelineFormEmail(e.target.value)} placeholder="seller@email.com" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Amount ($)</label>
                  <input className="input-dark" type="number" value={pipelineFormAmount} onChange={e => setPipelineFormAmount(e.target.value)} placeholder="Contract amount" min="0" step="any" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notes</label>
                  <textarea className="input-dark" value={pipelineFormNotes} onChange={e => setPipelineFormNotes(e.target.value)} placeholder="ARV, motivation level, contract details..." rows={3} style={{ resize: 'vertical' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                {pipelineEditDeal && (
                  <button type="button" onClick={() => handlePipelineDelete(pipelineEditDeal.id)} style={{
                    padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)',
                    background: 'rgba(239,68,68,0.08)', cursor: 'pointer', color: '#ef4444',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <Trash2 size={14} />
                  </button>
                )}
                <button type="button" className="btn-ghost" onClick={() => setPipelineShowForm(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-orange" style={{ flex: 1, justifyContent: 'center' }}>
                  <Save size={16} /> {pipelineEditDeal ? 'Update' : 'Add Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Collection Form */}
      <CrmEmailForm />

      {/* Activity Add/Edit modal */}
      {showActivityForm && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
          onClick={() => { setShowActivityForm(false); resetActivityForm() }}
        >
          <div
            className="animate-fade-in-up crm-form-modal"
            style={{
              background: 'rgba(38,48,64,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(61,78,101,0.6)', borderRadius: 20,
              padding: '28px 24px', width: '100%', maxWidth: 560,
              maxHeight: 'calc(100dvh - 40px)', overflowY: 'auto',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#ff7e5f', margin: 0 }}>
                {editingActivity ? 'Edit Activity' : 'Log New Activity'}
              </h3>
              <button onClick={() => { setShowActivityForm(false); resetActivityForm() }} style={{ background: 'none', border: 'none', color: '#6b6560', cursor: 'pointer', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleActivitySave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Activity type selector */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Activity Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {[
                      { value: 'call' as const, label: 'Call', icon: PhoneCall, color: '#5cb885' },
                      { value: 'email' as const, label: 'Email', icon: Mail, color: '#5ba3d9' },
                      { value: 'meeting' as const, label: 'Meeting', icon: Video, color: '#a855f7' },
                      { value: 'note' as const, label: 'Note', icon: StickyNote, color: '#e8a44a' },
                    ].map(t => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setActivityType(t.value)}
                        style={{
                          padding: '10px 0', borderRadius: 8, cursor: 'pointer',
                          border: activityType === t.value ? `2px solid ${t.color}` : '1px solid #3d4e65',
                          background: activityType === t.value ? `${t.color}10` : 'transparent',
                          color: activityType === t.value ? t.color : '#6b6560',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
                          transition: 'all 0.2s',
                        }}
                      >
                        <t.icon size={18} />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subject *</label>
                  <input className="input-dark" type="text" value={activitySubject} onChange={e => setActivitySubject(e.target.value)} placeholder="e.g. Follow-up call with seller" required />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Description</label>
                  <textarea className="input-dark" value={activityDescription} onChange={e => setActivityDescription(e.target.value)} placeholder="Details about this activity..." rows={3} style={{ resize: 'vertical' }} />
                </div>

                <div className="crm-form-row" style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Contact Name</label>
                    <input className="input-dark" type="text" value={activityContactName} onChange={e => setActivityContactName(e.target.value)} placeholder="John Doe" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Related Deal</label>
                    <input className="input-dark" type="text" value={activityDealName} onChange={e => setActivityDealName(e.target.value)} placeholder="Peachtree Property" />
                  </div>
                </div>

                <div className="crm-form-row" style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
                    <input className="input-dark" type="email" value={activityContactEmail} onChange={e => setActivityContactEmail(e.target.value)} placeholder="email@example.com" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Phone</label>
                    <input className="input-dark" type="tel" value={activityContactPhone} onChange={e => setActivityContactPhone(e.target.value)} placeholder="(555) 123-4567" />
                  </div>
                </div>

                {/* File Attachments */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Attachments
                  </label>
                  <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={handleFileAttach} style={{ display: 'none' }} />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '100%', padding: '12px 0', borderRadius: 8,
                      border: '1px dashed #3d4e65', background: 'rgba(255,255,255,0.02)',
                      cursor: 'pointer', color: '#6b6560', fontSize: 13,
                      fontFamily: "'DM Sans', sans-serif",
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <Paperclip size={14} /> Attach Photos, PDFs, or Documents
                  </button>
                  {activityAttachments.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      {activityAttachments.map(att => (
                        <div key={att.id} style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '4px 8px', background: '#2e3a4d', borderRadius: 6,
                          border: '1px solid #3d4e65', fontSize: 12, color: '#9a918a',
                        }}>
                          <Paperclip size={10} />
                          <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</span>
                          <button
                            type="button"
                            onClick={() => setActivityAttachments(prev => prev.filter(a => a.id !== att.id))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0 2px' }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reminder */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <button
                      type="button"
                      onClick={() => setActivityHasReminder(!activityHasReminder)}
                      style={{
                        width: 20, height: 20, borderRadius: 4,
                        border: `2px solid ${activityHasReminder ? '#ff7e5f' : '#3d4e65'}`,
                        background: activityHasReminder ? '#ff7e5f' : 'transparent',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {activityHasReminder && <CheckCircle2 size={12} color="#000" />}
                    </button>
                    <label style={{ fontSize: 12, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }} onClick={() => setActivityHasReminder(!activityHasReminder)}>
                      <Bell size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Set Follow-Up Reminder
                    </label>
                  </div>
                  {activityHasReminder && (
                    <div className="crm-form-row animate-slide-down" style={{ display: 'grid', gap: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, color: '#6b6560', marginBottom: 4 }}>Reminder Date & Time</label>
                        <input className="input-dark" type="datetime-local" value={activityReminderDate} onChange={e => setActivityReminderDate(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, color: '#6b6560', marginBottom: 4 }}>Reminder Note</label>
                        <input className="input-dark" type="text" value={activityReminderNote} onChange={e => setActivityReminderNote(e.target.value)} placeholder="Follow up on offer" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                {editingActivity && (
                  <button type="button" onClick={() => { handleActivityDelete(editingActivity.id); setShowActivityForm(false); resetActivityForm() }} style={{
                    padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)',
                    background: 'rgba(239,68,68,0.08)', cursor: 'pointer', color: '#ef4444',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <Trash2 size={14} />
                  </button>
                )}
                <button type="button" className="btn-ghost" onClick={() => { setShowActivityForm(false); resetActivityForm() }} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-orange" style={{ flex: 1, justifyContent: 'center' }}>
                  <Save size={16} /> {editingActivity ? 'Update' : 'Save Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Add/Edit modal */}
      {showTaskForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => { setShowTaskForm(false); resetTaskForm() }}>
          <div className="animate-fade-in-up crm-form-modal" style={{
            background: 'rgba(38,48,64,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(61,78,101,0.6)',
            borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 520,
            maxHeight: 'calc(100dvh - 40px)', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#ff7e5f', margin: 0 }}>
                {editingTask ? 'Edit Task' : 'New Task'}
              </h3>
              <button onClick={() => { setShowTaskForm(false); resetTaskForm() }} style={{ background: 'none', border: 'none', color: '#6b6560', cursor: 'pointer', padding: 4 }}><X size={20} /></button>
            </div>
            <form onSubmit={handleTaskSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Task Title *</label>
                  <input className="input-dark" type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="e.g. Follow up with seller" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Description</label>
                  <textarea className="input-dark" value={taskDescription} onChange={e => setTaskDescription(e.target.value)} placeholder="Task details..." rows={2} style={{ resize: 'vertical' }} />
                </div>
                <div className="crm-form-row" style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Priority</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                      {(['low', 'medium', 'high', 'urgent'] as const).map(p => (
                        <button key={p} type="button" onClick={() => setTaskPriority(p)} style={{
                          padding: '8px 0', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                          border: taskPriority === p ? `2px solid ${PRIORITY_COLORS[p]}` : '1px solid #3d4e65',
                          background: taskPriority === p ? `${PRIORITY_COLORS[p]}10` : 'transparent',
                          color: taskPriority === p ? PRIORITY_COLORS[p] : '#6b6560',
                          fontFamily: "'DM Sans', sans-serif", textTransform: 'capitalize', transition: 'all 0.2s',
                        }}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</label>
                    <div style={{ position: 'relative' }}>
                      <select className="input-dark" value={taskStatus} onChange={e => setTaskStatus(e.target.value as Task['status'])} style={{ appearance: 'none', paddingRight: 32, cursor: 'pointer' }}>
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <ChevronDown size={14} color="#6b6560" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>
                </div>
                <div className="crm-form-row" style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Due Date</label>
                    <input className="input-dark" type="datetime-local" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Contact</label>
                    <input className="input-dark" type="text" value={taskContactName} onChange={e => setTaskContactName(e.target.value)} placeholder="Contact name" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Related Deal</label>
                  <input className="input-dark" type="text" value={taskDealName} onChange={e => setTaskDealName(e.target.value)} placeholder="Deal name" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tags</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                    {taskTags.map(tag => (
                      <span key={tag} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 6, background: 'rgba(255,126,95,0.1)', color: '#ff7e5f', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {tag} <button type="button" onClick={() => setTaskTags(prev => prev.filter(t => t !== tag))} style={{ background: 'none', border: 'none', color: '#ff7e5f', cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1 }}>&times;</button>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="input-dark" type="text" value={taskTagInput} onChange={e => setTaskTagInput(e.target.value)} placeholder="Add tag..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (taskTagInput.trim() && !taskTags.includes(taskTagInput.trim())) { setTaskTags(prev => [...prev, taskTagInput.trim()]); setTaskTagInput('') } } }} />
                    <button type="button" onClick={() => { if (taskTagInput.trim() && !taskTags.includes(taskTagInput.trim())) { setTaskTags(prev => [...prev, taskTagInput.trim()]); setTaskTagInput('') } }} style={{ padding: '0 14px', borderRadius: 8, border: '1px solid #3d4e65', background: 'transparent', color: '#6b6560', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 12 }}>Add</button>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                {editingTask && (
                  <button type="button" onClick={() => { handleTaskDelete(editingTask.id); setShowTaskForm(false); resetTaskForm() }} style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', cursor: 'pointer', color: '#ef4444', fontFamily: "'DM Sans', sans-serif", fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Trash2 size={14} /></button>
                )}
                <button type="button" className="btn-ghost" onClick={() => { setShowTaskForm(false); resetTaskForm() }} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-orange" style={{ flex: 1, justifyContent: 'center' }}><Save size={16} /> {editingTask ? 'Update' : 'Save Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Add/Edit modal */}
      {showContactForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => { setShowContactForm(false); resetContactForm() }}>
          <div className="animate-fade-in-up crm-form-modal" style={{
            background: 'rgba(38,48,64,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(61,78,101,0.6)',
            borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 520,
            maxHeight: 'calc(100dvh - 40px)', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#ff7e5f', margin: 0 }}>
                {editingContact ? 'Edit Contact' : 'New Contact'}
              </h3>
              <button onClick={() => { setShowContactForm(false); resetContactForm() }} style={{ background: 'none', border: 'none', color: '#6b6560', cursor: 'pointer', padding: 4 }}><X size={20} /></button>
            </div>
            <form onSubmit={handleContactSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Name *</label>
                  <input className="input-dark" type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Full name" required />
                </div>
                <div className="crm-form-row" style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
                    <input className="input-dark" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="email@example.com" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Phone</label>
                    <input className="input-dark" type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="(555) 123-4567" />
                  </div>
                </div>
                <div className="crm-form-row" style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Company</label>
                    <input className="input-dark" type="text" value={contactCompany} onChange={e => setContactCompany(e.target.value)} placeholder="Company name" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Role</label>
                    <div style={{ position: 'relative' }}>
                      <select className="input-dark" value={contactRole} onChange={e => setContactRole(e.target.value as Contact['role'])} style={{ appearance: 'none', paddingRight: 32, cursor: 'pointer' }}>
                        {Object.entries(ROLE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                      </select>
                      <ChevronDown size={14} color="#6b6560" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Address</label>
                  <input className="input-dark" type="text" value={contactAddress} onChange={e => setContactAddress(e.target.value)} placeholder="Address" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Source</label>
                  <input className="input-dark" type="text" value={contactSource} onChange={e => setContactSource(e.target.value)} placeholder="e.g. Mailer, Cold Call, Referral, REIA" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tags</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                    {contactTags.map(tag => (
                      <span key={tag} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 6, background: 'rgba(255,126,95,0.1)', color: '#ff7e5f', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {tag} <button type="button" onClick={() => setContactTags(prev => prev.filter(t => t !== tag))} style={{ background: 'none', border: 'none', color: '#ff7e5f', cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1 }}>&times;</button>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="input-dark" type="text" value={contactTagInput} onChange={e => setContactTagInput(e.target.value)} placeholder="Add tag..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (contactTagInput.trim() && !contactTags.includes(contactTagInput.trim())) { setContactTags(prev => [...prev, contactTagInput.trim()]); setContactTagInput('') } } }} />
                    <button type="button" onClick={() => { if (contactTagInput.trim() && !contactTags.includes(contactTagInput.trim())) { setContactTags(prev => [...prev, contactTagInput.trim()]); setContactTagInput('') } }} style={{ padding: '0 14px', borderRadius: 8, border: '1px solid #3d4e65', background: 'transparent', color: '#6b6560', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 12 }}>Add</button>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notes</label>
                  <textarea className="input-dark" value={contactNotes} onChange={e => setContactNotes(e.target.value)} placeholder="Contact notes..." rows={3} style={{ resize: 'vertical' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                {editingContact && (
                  <button type="button" onClick={() => { handleContactDelete(editingContact.id); setShowContactForm(false); resetContactForm() }} style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', cursor: 'pointer', color: '#ef4444', fontFamily: "'DM Sans', sans-serif", fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Trash2 size={14} /></button>
                )}
                <button type="button" className="btn-ghost" onClick={() => { setShowContactForm(false); resetContactForm() }} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-orange" style={{ flex: 1, justifyContent: 'center' }}><Save size={16} /> {editingContact ? 'Update' : 'Save Contact'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .crm-list-row:hover { background: rgba(255,255,255,0.02); }
        .crm-stats-grid { grid-template-columns: repeat(4, 1fr); }
        .crm-secondary-stats { grid-template-columns: repeat(4, 1fr); }
        .crm-dashboard-cols { grid-template-columns: 1.5fr 1fr; }
        .crm-detail-grid { grid-template-columns: 1fr 1fr; }
        .crm-form-row { grid-template-columns: 1fr 1fr; }
        .crm-table-header { display: none; }
        .crm-filter-bar { flex-wrap: nowrap; }

        /* Sidebar navigation */
        .crm-sidebar { scrollbar-width: thin; scrollbar-color: #3d4e65 transparent; }
        .crm-sidebar::-webkit-scrollbar { width: 4px; }
        .crm-sidebar::-webkit-scrollbar-track { background: transparent; }
        .crm-sidebar::-webkit-scrollbar-thumb { background: #3d4e65; border-radius: 2px; }
        .crm-sidebar-item:hover { background: rgba(255,255,255,0.03) !important; color: #b0aaa5 !important; }
        .crm-sidebar-item-active:hover { background: rgba(255,126,95,0.12) !important; color: #ff7e5f !important; }
        .crm-sidebar-toggle:hover { background: rgba(255,255,255,0.05) !important; color: #9a918a !important; }
        .crm-sidebar-overlay { display: none; }
        .crm-mobile-menu-btn { display: none !important; }

        /* Dashboard stat card hover */
        .crm-dashboard-stat { transition: transform 0.2s, box-shadow 0.2s !important; }
        .crm-dashboard-stat:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }

        /* Quick action button hover */
        .crm-quick-action:hover { background: rgba(255,255,255,0.04) !important; border-color: rgba(255,126,95,0.3) !important; }

        /* Pipeline board */
        .pipeline-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.3); border-color: rgba(255,126,95,0.3) !important; }
        .pipeline-card:active { cursor: grabbing; }
        .pipeline-grip { opacity: 0.3; }
        .pipeline-card:hover .pipeline-grip { opacity: 0.7; }

        /* Deal score layout */
        .deal-score-layout { grid-template-columns: 1fr 1fr; }

        /* Slide down animation */
        @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 200px; } }
        .animate-slide-down { animation: slideDown 0.2s ease-out; }

        /* Status chips scrollbar hide */
        .crm-status-chips { scrollbar-width: none; -ms-overflow-style: none; }
        .crm-status-chips::-webkit-scrollbar { display: none; }

        /* Mobile - phone */
        @media (max-width: 768px) {
          .crm-sidebar {
            position: fixed !important; top: 64px !important; left: 0 !important;
            width: 260px !important; height: calc(100dvh - 64px) !important;
            transform: translateX(-100%); z-index: 90 !important;
            transition: transform 0.3s cubic-bezier(0.4,0,0.2,1) !important;
            background: rgba(18,22,28,0.98) !important;
          }
          .crm-sidebar-mobile-open { transform: translateX(0) !important; }
          .crm-sidebar-overlay { display: block !important; }
          .crm-sidebar-collapsed { width: 260px !important; }
          .crm-sidebar-collapse-row { display: none !important; }
          .crm-mobile-menu-btn { display: flex !important; }
          .crm-main-area { width: 100% !important; }
          .crm-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .crm-secondary-stats { grid-template-columns: 1fr 1fr !important; }
          .crm-dashboard-cols { grid-template-columns: 1fr !important; }
          .crm-detail-grid { grid-template-columns: 1fr !important; }
          .crm-form-row { grid-template-columns: 1fr !important; }
          .crm-user-email { display: none !important; }
          .crm-filter-bar { flex-wrap: wrap !important; }
          .crm-filter-bar > div:first-child { flex: 1 0 100%; }
          .crm-filter-bar select { width: 100%; }
          .crm-form-modal { padding: 20px 16px !important; }
          .crm-logout-text { display: none; }
          .pipeline-board { scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
          .pipeline-column { min-width: 280px !important; max-width: 85vw !important; scroll-snap-align: start; }
          .pipeline-grip { display: none !important; }
          .pipeline-move-btns { display: flex !important; }
          .deal-score-layout { grid-template-columns: 1fr !important; }
          .crm-contacts-grid { grid-template-columns: 1fr !important; }
        }

        /* Small phones */
        @media (max-width: 380px) {
          .crm-stats-grid { grid-template-columns: 1fr !important; }
          .crm-secondary-stats { grid-template-columns: 1fr 1fr !important; }
          .pipeline-column { min-width: 260px !important; max-width: 90vw !important; }
          .deal-score-layout { grid-template-columns: 1fr !important; }
          .crm-contacts-grid { grid-template-columns: 1fr !important; }
        }

        /* Tablet / iPad */
        @media (min-width: 769px) and (max-width: 1024px) {
          .crm-sidebar { width: 68px !important; }
          .crm-sidebar-collapsed { width: 68px !important; }
          .crm-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .crm-secondary-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .crm-dashboard-cols { grid-template-columns: 1fr !important; }
          .pipeline-column { min-width: 220px !important; max-width: 240px !important; }
          .pipeline-move-btns { display: flex !important; }
          .deal-score-layout { grid-template-columns: 1fr !important; }
          .crm-contacts-grid { grid-template-columns: 1fr 1fr !important; }
        }

        /* Desktop */
        @media (min-width: 1025px) {
          .crm-table-header { display: flex !important; }
          .pipeline-column { min-width: 200px !important; flex: 1 1 0 !important; max-width: none !important; }
          .pipeline-board { overflow-x: visible !important; }
          .pipeline-move-btns { display: none !important; }
        }
      `}</style>
    </div>
  )
}

/* ---- Helper ---- */

function CrmEmailForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    try {
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 48px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(92,184,133,0.08), rgba(34,120,72,0.06))',
          border: '1px solid rgba(92,184,133,0.25)',
          borderRadius: 16,
          padding: '40px 32px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(92,184,133,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 28,
          }}>
            ✓
          </div>
          <h3 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 28, color: '#5cb885',
            letterSpacing: '0.04em', marginBottom: 8,
          }}>
            You're on the list!
          </h3>
          <p style={{ color: '#9a918a', fontSize: 14, lineHeight: 1.6, maxWidth: 400, margin: '0 auto' }}>
            We'll keep you updated with CRM tips, new features, and wholesale resources.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 48px' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(244,126,95,0.06), rgba(232,179,71,0.04))',
        border: '1px solid rgba(244,126,95,0.2)',
        borderRadius: 16,
        padding: '36px 32px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span className="badge badge-orange" style={{ marginBottom: 12, display: 'inline-block' }}>
            <Mail size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Stay Connected
          </span>
          <h3 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(24px, 4vw, 36px)',
            color: '#f5f0eb',
            letterSpacing: '0.04em',
            marginBottom: 8,
          }}>
            Get CRM Updates & Wholesale Tips
          </h3>
          <p style={{ color: '#9a918a', fontSize: 14, lineHeight: 1.6, maxWidth: 500, margin: '0 auto' }}>
            Sign up to receive CRM feature updates, deal-closing strategies, and exclusive wholesale resources straight to your inbox.
          </p>
        </div>

        <form
          name="crm-email-collection"
          method="POST"
          onSubmit={handleSubmit}
          style={{ maxWidth: 480, margin: '0 auto' }}
        >
          <input type="hidden" name="form-name" value="crm-email-collection" />
          <p style={{ display: 'none' }}>
            <label>Don't fill this out: <input name="bot-field" /></label>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              className="input-dark"
              type="text"
              name="name"
              placeholder="Your name (optional)"
              autoComplete="name"
              style={{ background: 'rgba(34,42,53,0.8)' }}
            />
            <input
              className="input-dark"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              style={{ background: 'rgba(34,42,53,0.8)' }}
            />
            {error && (
              <p style={{ color: '#ef4444', fontSize: 13, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={14} /> {error}
              </p>
            )}
            <button
              type="submit"
              className="btn-orange"
              disabled={submitting}
              style={{
                width: '100%', justifyContent: 'center',
                padding: '14px 24px', fontSize: 16,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? (
                <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Subscribing...</>
              ) : (
                <><Mail size={16} /> Get CRM Updates</>
              )}
            </button>
          </div>
          <p style={{ color: '#6b6560', fontSize: 11, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
            No spam, ever. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </section>
  )
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}
