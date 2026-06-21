// Mock data for NPRMS system
export type Role = 'administrator' | 'officer' | 'records';

export interface User {
  user_id: string;
  badge_number: string;
  full_name: string;
  email: string;
  role: Role;
  phone: string;
  status: 'Active' | 'Inactive';
  last_login: string;
}

export type CaseStatus = 'Registered' | 'Assigned' | 'Under Investigation' | 'Resolved' | 'Closed' | 'Archived' | 'Reopened';
export type CaseCategory = 'Theft' | 'Assault' | 'Fraud' | 'Armed Robbery' | 'Missing Person' | 'Homicide' | 'Cybercrime';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type SuspectStatus = 'At Large' | 'In Custody' | 'Cleared';

export interface Case {
  case_id: string;
  case_number: string;
  title: string;
  description: string;
  category: CaseCategory;
  priority: Priority;
  status: CaseStatus;
  date_reported: string;
  location: string;
  complainant_name: string;
  complainant_contact: string;
  complainant_address: string;
  registered_by: User;
  assigned_officer?: User | null;
  assigned_by?: User | null;
  resolution_summary?: string | null;
  created_at: string;
  updated_at: string;
  archived_at?: string | null;
}

export interface InvestigationUpdate {
  update_id: string;
  case_id: string;
  officer_name: string;
  update_type: 'Note' | 'Progress Update' | 'Status Change';
  content: string;
  created_at: string;
}

export interface Evidence {
  evidence_id: string;
  case_id: string;
  uploaded_by: string;
  file_name: string;
  file_type: 'Image' | 'Video' | 'Document' | 'Audio';
  description: string;
  custody_notes: string;
  uploaded_at: string;
}

export interface Suspect {
  suspect_id: string;
  case_id: string;
  full_name: string;
  alias?: string | null;
  age: number;
  gender: string;
  address: string;
  identifying_marks: string;
  status: SuspectStatus;
}

export interface Witness {
  witness_id: string;
  case_id: string;
  full_name: string;
  contact: string;
  statement: string;
  relationship_to_case: string;
}

export interface ActivityLog {
  log_id: string;
  user_name: string;
  action_type: string;
  description: string;
  case_number?: string | null;
  timestamp: string;
}

export interface Notification {
  notification_id: string;
  message: string;
  type: 'Case Assigned' | 'Status Update' | 'Evidence Added' | 'System';
  related_case_number?: string | null;
  is_read: boolean;
  created_at: string;
}

// Mock Users
const adminUser: User = {
  user_id: 'u1',
  badge_number: 'NPF-2201',
  full_name: 'Adekunle Okonkwo',
  email: 'adekunle.okonkwo@nprms.ng',
  role: 'administrator',
  phone: '+234-801-234-5678',
  status: 'Active',
  last_login: '2026-06-20T09:30:00Z',
};

const officerUser: User = {
  user_id: 'u2',
  badge_number: 'NPF-2291',
  full_name: 'Ibrahim Musa',
  email: 'ibrahim.musa@nprms.ng',
  role: 'officer',
  phone: '+234-802-234-5679',
  status: 'Active',
  last_login: '2026-06-20T08:15:00Z',
};

const recordsUser: User = {
  user_id: 'u3',
  badge_number: 'NPF-3101',
  full_name: 'Folake Adeyemi',
  email: 'folake.adeyemi@nprms.ng',
  role: 'records',
  phone: '+234-803-234-5680',
  status: 'Active',
  last_login: '2026-06-20T07:45:00Z',
};

export const mockUsers: User[] = [
  adminUser,
  officerUser,
  recordsUser,
  {
    user_id: 'u4',
    badge_number: 'NPF-2304',
    full_name: 'Chinedu Eze',
    email: 'chinedu.eze@nprms.ng',
    role: 'officer',
    phone: '+234-804-234-5681',
    status: 'Active',
    last_login: '2026-06-19T14:22:00Z',
  },
  {
    user_id: 'u5',
    badge_number: 'NPF-2115',
    full_name: 'Adaeze Okafor',
    email: 'adaeze.okafor@nprms.ng',
    role: 'officer',
    phone: '+234-805-234-5682',
    status: 'Active',
    last_login: '2026-06-20T06:30:00Z',
  },
  {
    user_id: 'u6',
    badge_number: 'NPF-3205',
    full_name: 'Zainab Hassan',
    email: 'zainab.hassan@nprms.ng',
    role: 'records',
    phone: '+234-806-234-5683',
    status: 'Active',
    last_login: '2026-06-18T16:45:00Z',
  },
  {
    user_id: 'u7',
    badge_number: 'NPF-2408',
    full_name: 'Chioma Nwosu',
    email: 'chioma.nwosu@nprms.ng',
    role: 'officer',
    phone: '+234-807-234-5684',
    status: 'Active',
    last_login: '2026-06-20T10:00:00Z',
  },
  {
    user_id: 'u8',
    badge_number: 'NPF-3301',
    full_name: 'Amara Okoro',
    email: 'amara.okoro@nprms.ng',
    role: 'records',
    phone: '+234-808-234-5685',
    status: 'Inactive',
    last_login: '2026-05-15T11:20:00Z',
  },
];

// Mock Cases
export const mockCases: Case[] = [
  {
    case_id: 'c1',
    case_number: 'NPRMS-2026-0001',
    title: 'Armed Robbery at GTBank Lekki',
    description: 'Multiple suspects entered the bank and stole approximately ₦15 million in cash. Happened around 2:30 PM.',
    category: 'Armed Robbery',
    priority: 'Critical',
    status: 'Under Investigation',
    date_reported: '2026-06-18',
    location: 'GTBank Lekki, Lagos',
    complainant_name: 'Mr. Okafor Akinlade',
    complainant_contact: '+234-901-123-4567',
    complainant_address: '45 Admiralty Way, Lekki, Lagos',
    registered_by: recordsUser,
    assigned_officer: officerUser,
    assigned_by: adminUser,
    created_at: '2026-06-18T14:30:00Z',
    updated_at: '2026-06-20T09:15:00Z',
  },
  {
    case_id: 'c2',
    case_number: 'NPRMS-2026-0002',
    title: 'Missing Person - Abuja',
    description: 'A 17-year-old female has been reported missing since June 16. Last seen in Wuse II area.',
    category: 'Missing Person',
    priority: 'Critical',
    status: 'Under Investigation',
    date_reported: '2026-06-16',
    location: 'Wuse II, Abuja',
    complainant_name: 'Mrs. Ngozi Okeke',
    complainant_contact: '+234-902-234-5678',
    complainant_address: 'Plot 15 Crescent Road, Wuse II, Abuja',
    registered_by: recordsUser,
    assigned_officer: mockUsers[3],
    assigned_by: adminUser,
    created_at: '2026-06-16T10:45:00Z',
    updated_at: '2026-06-20T08:00:00Z',
  },
  {
    case_id: 'c3',
    case_number: 'NPRMS-2026-0003',
    title: 'Assault at Surulere Market',
    description: 'Victim was attacked with cutlass resulting in serious injuries. Incident occurred at about 6:00 PM.',
    category: 'Assault',
    priority: 'High',
    status: 'Registered',
    date_reported: '2026-06-19',
    location: 'Surulere Market, Lagos',
    complainant_name: 'Ayo Taiwo',
    complainant_contact: '+234-903-234-5679',
    complainant_address: '12 Adekunle Street, Surulere, Lagos',
    registered_by: recordsUser,
    assigned_officer: null,
    created_at: '2026-06-19T18:30:00Z',
    updated_at: '2026-06-19T18:30:00Z',
  },
  {
    case_id: 'c4',
    case_number: 'NPRMS-2026-0004',
    title: 'Cybercrime - Business Email Compromise',
    description: 'Company director received fraudulent emails requesting wire transfer of company funds. Attackers posed as CEO.',
    category: 'Cybercrime',
    priority: 'High',
    status: 'Assigned',
    date_reported: '2026-06-17',
    location: 'Victoria Island, Lagos',
    complainant_name: 'Chief Emeka Obi',
    complainant_contact: '+234-904-234-5680',
    complainant_address: 'Suite 500, Central Bank Building, VI, Lagos',
    registered_by: recordsUser,
    assigned_officer: mockUsers[4],
    assigned_by: adminUser,
    created_at: '2026-06-17T11:00:00Z',
    updated_at: '2026-06-20T07:30:00Z',
  },
  {
    case_id: 'c5',
    case_number: 'NPRMS-2026-0005',
    title: 'Theft of Generator Set',
    description: 'Generator set stolen from construction site. Value estimated at ₦800,000.',
    category: 'Theft',
    priority: 'Medium',
    status: 'Resolved',
    date_reported: '2026-06-10',
    location: 'Ikoyi, Lagos',
    complainant_name: 'Mr. Lanre Bello',
    complainant_contact: '+234-905-234-5681',
    complainant_address: 'Plot 89, Banana Island, Ikoyi, Lagos',
    registered_by: recordsUser,
    assigned_officer: officerUser,
    assigned_by: adminUser,
    resolution_summary: 'Suspect apprehended after 5 days of investigation. Items recovered and returned to complainant.',
    created_at: '2026-06-10T09:00:00Z',
    updated_at: '2026-06-15T16:45:00Z',
  },
  {
    case_id: 'c6',
    case_number: 'NPRMS-2026-0006',
    title: 'Homicide - Port Harcourt',
    description: 'Body discovered in residential area with multiple stab wounds. Investigation ongoing.',
    category: 'Homicide',
    priority: 'Critical',
    status: 'Under Investigation',
    date_reported: '2026-06-14',
    location: 'Diobu, Port Harcourt',
    complainant_name: 'Mrs. Ada Obi',
    complainant_contact: '+234-906-234-5682',
    complainant_address: '23 Azikiwe Road, Diobu, Port Harcourt',
    registered_by: recordsUser,
    assigned_officer: mockUsers[6],
    assigned_by: adminUser,
    created_at: '2026-06-14T06:15:00Z',
    updated_at: '2026-06-20T05:00:00Z',
  },
  {
    case_id: 'c7',
    case_number: 'NPRMS-2026-0007',
    title: 'Fraud - Real Estate Scam',
    description: 'Victim paid for property that does not belong to the seller. Approximately ₦5 million involved.',
    category: 'Fraud',
    priority: 'High',
    status: 'Closed',
    date_reported: '2026-05-20',
    location: 'Lekki, Lagos',
    complainant_name: 'Engineer Tunde Adebayo',
    complainant_contact: '+234-907-234-5683',
    complainant_address: '88 Orchid Road, Lekki, Lagos',
    registered_by: recordsUser,
    assigned_officer: officerUser,
    assigned_by: adminUser,
    resolution_summary: 'Case resolved through court proceedings. Suspect sentenced.',
    created_at: '2026-05-20T13:20:00Z',
    updated_at: '2026-06-01T10:30:00Z',
  },
  {
    case_id: 'c8',
    case_number: 'NPRMS-2026-0008',
    title: 'Theft from Shop - Ibadan',
    description: 'Electronics shop robbed. Items worth ₦3.2 million stolen including phones and laptops.',
    category: 'Theft',
    priority: 'Medium',
    status: 'Archived',
    date_reported: '2026-03-15',
    location: 'Dugbe Market, Ibadan',
    complainant_name: 'Mr. Bayo Oyelade',
    complainant_contact: '+234-908-234-5684',
    complainant_address: 'Shop 24, Dugbe Market, Ibadan',
    registered_by: recordsUser,
    assigned_officer: mockUsers[4],
    assigned_by: adminUser,
    resolution_summary: 'Case archived after 3 months with no leads.',
    created_at: '2026-03-15T16:00:00Z',
    updated_at: '2026-06-15T12:00:00Z',
    archived_at: '2026-06-15T12:00:00Z',
  },
  {
    case_id: 'c9',
    case_number: 'NPRMS-2026-0009',
    title: 'Assault Incident at Hotel',
    description: 'Guest allegedly assaulted hotel staff during argument. Minor injuries reported.',
    category: 'Assault',
    priority: 'Low',
    status: 'Registered',
    date_reported: '2026-06-19',
    location: 'Radisson Blu, Ikeja, Lagos',
    complainant_name: 'Ms. Chioma Udeh',
    complainant_contact: '+234-909-234-5685',
    complainant_address: '40 Ahmed Onibudo Street, Ikeja, Lagos',
    registered_by: recordsUser,
    assigned_officer: null,
    created_at: '2026-06-19T22:15:00Z',
    updated_at: '2026-06-19T22:15:00Z',
  },
  {
    case_id: 'c10',
    case_number: 'NPRMS-2026-0010',
    title: 'Armed Robbery - Filling Station',
    description: 'Gunmen robbed fuel station attendants of cash and valuables.',
    category: 'Armed Robbery',
    priority: 'High',
    status: 'Assigned',
    date_reported: '2026-06-18',
    location: 'Chevron Drive, Lekki, Lagos',
    complainant_name: 'Mr. Samuel Okonkwo',
    complainant_contact: '+234-910-234-5686',
    complainant_address: 'Chevron Drive, Lekki, Lagos',
    registered_by: recordsUser,
    assigned_officer: mockUsers[3],
    assigned_by: adminUser,
    created_at: '2026-06-18T20:30:00Z',
    updated_at: '2026-06-20T06:00:00Z',
  },
  {
    case_id: 'c11',
    case_number: 'NPRMS-2026-0011',
    title: 'Missing Person - Kano',
    description: '12-year-old child missing since June 17. Last seen at school gate.',
    category: 'Missing Person',
    priority: 'Critical',
    status: 'Assigned',
    date_reported: '2026-06-17',
    location: 'Kano',
    complainant_name: 'Mrs. Zainab Ibrahim',
    complainant_contact: '+234-911-234-5687',
    complainant_address: 'No. 7 Uthman Danfodio Road, Kano',
    registered_by: recordsUser,
    assigned_officer: mockUsers[4],
    assigned_by: adminUser,
    created_at: '2026-06-17T16:45:00Z',
    updated_at: '2026-06-20T04:30:00Z',
  },
  {
    case_id: 'c12',
    case_number: 'NPRMS-2026-0012',
    title: 'Cybercrime - Banking Fraud',
    description: 'Victim account compromised. Unauthorized withdrawals of ₦2.5 million made.',
    category: 'Cybercrime',
    priority: 'High',
    status: 'Under Investigation',
    date_reported: '2026-06-13',
    location: 'Ikoyi, Lagos',
    complainant_name: 'Dr. Ngozi Ejiofor',
    complainant_contact: '+234-912-234-5688',
    complainant_address: '15 Bourdillon Road, Ikoyi, Lagos',
    registered_by: recordsUser,
    assigned_officer: mockUsers[6],
    assigned_by: adminUser,
    created_at: '2026-06-13T10:20:00Z',
    updated_at: '2026-06-20T08:30:00Z',
  },
  {
    case_id: 'c13',
    case_number: 'NPRMS-2026-0013',
    title: 'Theft of Vehicle',
    description: 'Car stolen from parking lot at shopping mall. Make: Toyota Corolla, 2022 model.',
    category: 'Theft',
    priority: 'Medium',
    status: 'Registered',
    date_reported: '2026-06-20',
    location: 'Lekki Phase 1, Lagos',
    complainant_name: 'Mr. Peter Adeleke',
    complainant_contact: '+234-913-234-5689',
    complainant_address: '32 Fola Osibo Street, Lekki Phase 1, Lagos',
    registered_by: recordsUser,
    assigned_officer: null,
    created_at: '2026-06-20T08:00:00Z',
    updated_at: '2026-06-20T08:00:00Z',
  },
  {
    case_id: 'c14',
    case_number: 'NPRMS-2026-0014',
    title: 'Fraud - Advance Fee Scam',
    description: 'Victim deceived into sending money for supposed business investment.',
    category: 'Fraud',
    priority: 'Medium',
    status: 'Assigned',
    date_reported: '2026-06-15',
    location: 'Enugu',
    complainant_name: 'Mrs. Patricia Eze',
    complainant_contact: '+234-914-234-5690',
    complainant_address: '18 Coal Camp Road, Enugu',
    registered_by: recordsUser,
    assigned_officer: officerUser,
    assigned_by: adminUser,
    created_at: '2026-06-15T14:15:00Z',
    updated_at: '2026-06-20T09:45:00Z',
  },
  {
    case_id: 'c15',
    case_number: 'NPRMS-2026-0015',
    title: 'Assault - Neighborhood Dispute',
    description: 'Neighbors engaged in physical altercation over property boundary.',
    category: 'Assault',
    priority: 'Low',
    status: 'Closed',
    date_reported: '2026-06-12',
    location: 'Gbagada, Lagos',
    complainant_name: 'Mr. Seun Adeyinka',
    complainant_contact: '+234-915-234-5691',
    complainant_address: '24 Olufemi Street, Gbagada, Lagos',
    registered_by: recordsUser,
    assigned_officer: officerUser,
    assigned_by: adminUser,
    resolution_summary: 'Both parties reconciled through mediation. Case settled.',
    created_at: '2026-06-12T11:30:00Z',
    updated_at: '2026-06-18T15:00:00Z',
  },
  {
    case_id: 'c16',
    case_number: 'NPRMS-2026-0016',
    title: 'Homicide Investigation - Enugu',
    description: 'Body found in abandoned warehouse. Cause of death under investigation.',
    category: 'Homicide',
    priority: 'Critical',
    status: 'Under Investigation',
    date_reported: '2026-06-19',
    location: 'Emene, Enugu',
    complainant_name: 'Mr. Ifeanyi Okafor',
    complainant_contact: '+234-916-234-5692',
    complainant_address: 'Emene, Enugu',
    registered_by: recordsUser,
    assigned_officer: mockUsers[4],
    assigned_by: adminUser,
    created_at: '2026-06-19T08:00:00Z',
    updated_at: '2026-06-20T10:15:00Z',
  },
  {
    case_id: 'c17',
    case_number: 'NPRMS-2026-0017',
    title: 'Theft - Phone Shop Robbery',
    description: 'Mobile phone shop robbed of inventory worth approximately ₦4 million.',
    category: 'Theft',
    priority: 'High',
    status: 'Under Investigation',
    date_reported: '2026-06-16',
    location: 'Yaba, Lagos',
    complainant_name: 'Mr. Toyin Oyeyemi',
    complainant_contact: '+234-917-234-5693',
    complainant_address: 'Shop 12, Computer Village, Yaba, Lagos',
    registered_by: recordsUser,
    assigned_officer: mockUsers[6],
    assigned_by: adminUser,
    created_at: '2026-06-16T15:45:00Z',
    updated_at: '2026-06-20T07:15:00Z',
  },
  {
    case_id: 'c18',
    case_number: 'NPRMS-2026-0018',
    title: 'Cybercrime - SIM Card Swap Attack',
    description: 'Victim had SIM card replaced fraudulently. Bank accounts accessed and funds stolen.',
    category: 'Cybercrime',
    priority: 'High',
    status: 'Assigned',
    date_reported: '2026-06-14',
    location: 'Lagos Island, Lagos',
    complainant_name: 'Ms. Nneka Okereke',
    complainant_contact: '+234-918-234-5694',
    complainant_address: '56 Awolowo Road, Ikoyi, Lagos',
    registered_by: recordsUser,
    assigned_officer: mockUsers[3],
    assigned_by: adminUser,
    created_at: '2026-06-14T12:00:00Z',
    updated_at: '2026-06-20T06:45:00Z',
  },
  {
    case_id: 'c19',
    case_number: 'NPRMS-2026-0019',
    title: 'Armed Robbery - Jewelry Store',
    description: 'Armed robbers stole jewelry and cash from shop. Estimated loss ₦8 million.',
    category: 'Armed Robbery',
    priority: 'Critical',
    status: 'Closed',
    date_reported: '2026-06-01',
    location: 'Lekki Shopping Centre, Lagos',
    complainant_name: 'Mr. Ade Ibikunle',
    complainant_contact: '+234-919-234-5695',
    complainant_address: 'Shop 45, Lekki Shopping Centre, Lagos',
    registered_by: recordsUser,
    assigned_officer: officerUser,
    assigned_by: adminUser,
    resolution_summary: 'Three suspects arrested. Items partially recovered. Case concluded.',
    created_at: '2026-06-01T14:30:00Z',
    updated_at: '2026-06-10T11:20:00Z',
  },
  {
    case_id: 'c20',
    case_number: 'NPRMS-2026-0020',
    title: 'Missing Person - Abuja (Reopened)',
    description: 'Missing person case from 2025 reopened due to new leads.',
    category: 'Missing Person',
    priority: 'High',
    status: 'Reopened',
    date_reported: '2025-12-10',
    location: 'Garki, Abuja',
    complainant_name: 'Mr. Segun Adebayo',
    complainant_contact: '+234-920-234-5696',
    complainant_address: 'Garki II, Abuja',
    registered_by: recordsUser,
    assigned_officer: mockUsers[3],
    assigned_by: adminUser,
    created_at: '2025-12-10T09:00:00Z',
    updated_at: '2026-06-20T05:30:00Z',
  },
];

// Mock Investigation Updates
export const mockInvestigationUpdates: InvestigationUpdate[] = [
  {
    update_id: 'u1',
    case_id: 'c1',
    officer_name: 'Ibrahim Musa',
    update_type: 'Progress Update',
    content: 'Reviewed CCTV footage. Three suspects identified. Circulation bulletin issued.',
    created_at: '2026-06-20T09:00:00Z',
  },
  {
    update_id: 'u2',
    case_id: 'c1',
    officer_name: 'Ibrahim Musa',
    update_type: 'Note',
    content: 'Waiting for forensic analysis of recovered items from suspect vehicle.',
    created_at: '2026-06-19T16:30:00Z',
  },
  {
    update_id: 'u3',
    case_id: 'c2',
    officer_name: 'Chinedu Eze',
    update_type: 'Status Change',
    content: 'Changed status to Under Investigation. Interviews with last known associates underway.',
    created_at: '2026-06-20T08:00:00Z',
  },
  {
    update_id: 'u4',
    case_id: 'c2',
    officer_name: 'Chinedu Eze',
    update_type: 'Note',
    content: 'Located witness at school who saw person matching description near location.',
    created_at: '2026-06-18T14:15:00Z',
  },
];

// Mock Activity Log
export const mockActivityLog: ActivityLog[] = [
  {
    log_id: 'a1',
    user_name: 'Ibrahim Musa',
    action_type: 'Investigation Update Added',
    description: 'Added progress update',
    case_number: 'NPRMS-2026-0001',
    timestamp: '2026-06-20T09:00:00Z',
  },
  {
    log_id: 'a2',
    user_name: 'Adekunle Okonkwo',
    action_type: 'Case Assigned',
    description: 'Assigned case to Ibrahim Musa',
    case_number: 'NPRMS-2026-0002',
    timestamp: '2026-06-20T08:45:00Z',
  },
  {
    log_id: 'a3',
    user_name: 'Folake Adeyemi',
    action_type: 'Case Registered',
    description: 'New case registered',
    case_number: 'NPRMS-2026-0013',
    timestamp: '2026-06-20T08:00:00Z',
  },
  {
    log_id: 'a4',
    user_name: 'Chinedu Eze',
    action_type: 'Investigation Update Added',
    description: 'Added progress update',
    case_number: 'NPRMS-2026-0002',
    timestamp: '2026-06-20T07:45:00Z',
  },
  {
    log_id: 'a5',
    user_name: 'Adaeze Okafor',
    action_type: 'Evidence Uploaded',
    description: 'Uploaded 3 evidence items',
    case_number: 'NPRMS-2026-0004',
    timestamp: '2026-06-20T07:30:00Z',
  },
  {
    log_id: 'a6',
    user_name: 'Adekunle Okonkwo',
    action_type: 'Case Status Changed',
    description: 'Marked case as Closed',
    case_number: 'NPRMS-2026-0015',
    timestamp: '2026-06-18T15:00:00Z',
  },
  {
    log_id: 'a7',
    user_name: 'Ibrahim Musa',
    action_type: 'Investigation Update Added',
    description: 'Added suspect information',
    case_number: 'NPRMS-2026-0001',
    timestamp: '2026-06-19T16:30:00Z',
  },
  {
    log_id: 'a8',
    user_name: 'Folake Adeyemi',
    action_type: 'Case Archived',
    description: 'Archived inactive case',
    case_number: 'NPRMS-2026-0008',
    timestamp: '2026-06-15T12:00:00Z',
  },
  {
    log_id: 'a9',
    user_name: 'Chioma Nwosu',
    action_type: 'Investigation Update Added',
    description: 'Added witness statement',
    case_number: 'NPRMS-2026-0006',
    timestamp: '2026-06-20T05:00:00Z',
  },
  {
    log_id: 'a10',
    user_name: 'Adekunle Okonkwo',
    action_type: 'User Created',
    description: 'Created new user account',
    timestamp: '2026-06-19T10:30:00Z',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    notification_id: 'n1',
    message: 'Case NPRMS-2026-0001 has been assigned to you',
    type: 'Case Assigned',
    related_case_number: 'NPRMS-2026-0001',
    is_read: false,
    created_at: '2026-06-20T09:30:00Z',
  },
  {
    notification_id: 'n2',
    message: 'New investigation update on case NPRMS-2026-0005',
    type: 'Status Update',
    related_case_number: 'NPRMS-2026-0005',
    is_read: true,
    created_at: '2026-06-20T08:15:00Z',
  },
  {
    notification_id: 'n3',
    message: 'Evidence added to case NPRMS-2026-0004',
    type: 'Evidence Added',
    related_case_number: 'NPRMS-2026-0004',
    is_read: false,
    created_at: '2026-06-20T07:00:00Z',
  },
];

// Helper functions
//
// NOTE: every helper below accepts the data it operates on as an optional
// parameter, defaulting to the static mock arrays. CaseProvider/UserProvider
// hold their own live React state (seeded from these same arrays), so any
// component reading from context should pass `cases`/`users` from
// useCases()/useUsers() explicitly rather than relying on the default —
// otherwise these will silently ignore cases/users added or changed during
// the session.
export function getUserById(userId: string, users: User[] = mockUsers): User | undefined {
  return users.find(u => u.user_id === userId);
}

export function getCaseById(caseId: string, cases: Case[] = mockCases): Case | undefined {
  return cases.find(c => c.case_id === caseId);
}

export function getCasesByOfficer(officerId: string, cases: Case[] = mockCases): Case[] {
  return cases.filter(c => c.assigned_officer?.user_id === officerId);
}

export function getOfficerCaseCount(officerId: string, cases: Case[] = mockCases): number {
  return getCasesByOfficer(officerId, cases).length;
}

export function getOfficerResolvedCaseCount(officerId: string, cases: Case[] = mockCases): number {
  return getCasesByOfficer(officerId, cases).filter(c => c.status === 'Resolved').length;
}

export function getTotalCases(cases: Case[] = mockCases): number {
  return cases.length;
}

export function getActiveCases(cases: Case[] = mockCases): number {
  return cases.filter(c =>
    c.status !== 'Closed' && c.status !== 'Archived'
  ).length;
}

export function getClosedCases(cases: Case[] = mockCases): number {
  return cases.filter(c => c.status === 'Closed').length;
}

export function getTotalOfficers(users: User[] = mockUsers): number {
  return users.filter(u => u.role === 'officer').length;
}

export function getUnassignedCases(cases: Case[] = mockCases): Case[] {
  return cases.filter(c => !c.assigned_officer);
}

export function getCasesByStatus(status: CaseStatus, cases: Case[] = mockCases): Case[] {
  return cases.filter(c => c.status === status);
}

export function getOverdueCases(cases: Case[] = mockCases): Case[] {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return cases.filter(c => {
    if (c.status !== 'Under Investigation') return false;
    const lastUpdate = new Date(c.updated_at);
    return lastUpdate < sevenDaysAgo;
  });
}
