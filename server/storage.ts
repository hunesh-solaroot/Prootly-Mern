import { type User, type InsertUser, type Employee, type InsertEmployee, type Client, type InsertClient, type Project, type InsertProject, type Comment, type InsertComment, type Planset, type InsertPlanset, type Attendance, type InsertAttendance, type LeaveRequest, type InsertLeaveRequest, type Department, type InsertDepartment, type Payroll, type InsertPayroll } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Employee methods
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;
  searchEmployees(query: string): Promise<Employee[]>;

  // Client methods
  getClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;
  searchClients(query: string): Promise<Client[]>;

  // Project methods
  getProjects(): Promise<Project[]>;
  getProjectsByStatus(status: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;

  // Comment methods
  getComments(): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  // Planset methods
  getPlansets(): Promise<Planset[]>;
  getPlansetsByProjectId(projectId: string): Promise<Planset[]>;
  createPlanset(planset: InsertPlanset): Promise<Planset>;
  updatePlanset(id: string, planset: Partial<InsertPlanset>): Promise<Planset | undefined>;
  deletePlanset(id: string): Promise<boolean>;

  // Attendance methods
  getAttendance(): Promise<Attendance[]>;
  getAttendanceByEmployee(employeeId: string): Promise<Attendance[]>;
  getAttendanceByDate(date: string): Promise<Attendance[]>;
  getTodayAttendance(employeeId: string): Promise<Attendance | undefined>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: string, attendance: Partial<InsertAttendance>): Promise<Attendance | undefined>;
  punchIn(employeeId: string): Promise<Attendance>;
  punchOut(employeeId: string): Promise<Attendance | undefined>;

  // Leave Request methods
  getLeaveRequests(): Promise<LeaveRequest[]>;
  getLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]>;
  createLeaveRequest(request: InsertLeaveRequest): Promise<LeaveRequest>;
  updateLeaveRequest(id: string, request: Partial<InsertLeaveRequest>): Promise<LeaveRequest | undefined>;
  approveLeaveRequest(id: string, approvedBy: string): Promise<LeaveRequest | undefined>;
  rejectLeaveRequest(id: string, approvedBy: string, comments?: string): Promise<LeaveRequest | undefined>;

  // Department methods
  getDepartments(): Promise<Department[]>;
  getDepartment(id: string): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: string, department: Partial<InsertDepartment>): Promise<Department | undefined>;
  deleteDepartment(id: string): Promise<boolean>;

  // Payroll methods
  getPayroll(): Promise<Payroll[]>;
  getPayrollByEmployee(employeeId: string): Promise<Payroll[]>;
  createPayroll(payroll: InsertPayroll): Promise<Payroll>;
  updatePayroll(id: string, payroll: Partial<InsertPayroll>): Promise<Payroll | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private employees: Map<string, Employee>;
  private clients: Map<string, Client>;
  private projects: Map<string, Project>;
  private comments: Map<string, Comment>;
  private plansets: Map<string, Planset>;
  private attendance: Map<string, Attendance>;
  private leaveRequests: Map<string, LeaveRequest>;
  private departments: Map<string, Department>;
  private payroll: Map<string, Payroll>;

  constructor() {
    this.users = new Map();
    this.employees = new Map();
    this.clients = new Map();
    this.projects = new Map();
    this.comments = new Map();
    this.plansets = new Map();
    this.attendance = new Map();
    this.leaveRequests = new Map();
    this.departments = new Map();
    this.payroll = new Map();

    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample employees
    const sampleEmployees: Employee[] = [
      {
        id: randomUUID(),
        name: "John Smith",
        email: "john.smith@prootly.com",
        role: "Project Manager",
        status: "active",
        profileImage: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Sarah Johnson",
        email: "sarah.johnson@prootly.com",
        role: "Solar Engineer",
        status: "active",
        profileImage: null,
        createdAt: new Date(),
      },
    ];

    // Sample clients
    const sampleClients: Client[] = [
      {
        id: randomUUID(),
        companyName: "Green Energy Solutions",
        contactPerson: "Michael Brown",
        email: "michael@greenenergy.com",
        phone: "+1-555-0123",
        status: "active",
        notes: "Leading renewable energy company",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        companyName: "Solar Dynamics",
        contactPerson: "Lisa Davis",
        email: "lisa@solardynamics.com",
        phone: "+1-555-0456",
        status: "active",
        notes: "Residential solar installations",
        createdAt: new Date(),
      },
    ];

    // Sample projects
    const sampleProjects: Project[] = [
      {
        id: randomUUID(),
        name: "Residential Solar Installation",
        status: "completed",
        clientId: sampleClients[0].id,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Commercial Solar Array",
        status: "new",
        clientId: sampleClients[1].id,
        createdAt: new Date(),
      },
    ];

    // Sample comments
    const sampleComments: Comment[] = [
      {
        id: randomUUID(),
        author: "SON LIGHT CONSTRUCTION",
        company: "Mercedes Melendez",
        text: "Hello. Any update on these revisions? It's been a few...",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        author: "JOHNSUN ENERGY",
        company: "Project Manager",
        text: "Project timeline updated. Ready for next phase review.",
        createdAt: new Date(),
      },
    ];

    // Store samples
    sampleEmployees.forEach(emp => this.employees.set(emp.id, emp));
    sampleClients.forEach(client => this.clients.set(client.id, client));
    sampleProjects.forEach(project => this.projects.set(project.id, project));
    sampleComments.forEach(comment => this.comments.set(comment.id, comment));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Employee methods
  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = randomUUID();
    const employee: Employee = { 
      ...insertEmployee, 
      id, 
      createdAt: new Date(),
      status: insertEmployee.status || "active",
      profileImage: insertEmployee.profileImage || null
    };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: string, updates: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    if (!employee) return undefined;
    
    const updatedEmployee = { ...employee, ...updates };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    return this.employees.delete(id);
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.employees.values()).filter(
      employee => 
        employee.name.toLowerCase().includes(lowerQuery) ||
        employee.email.toLowerCase().includes(lowerQuery)
    );
  }

  // Client methods
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = { 
      ...insertClient, 
      id, 
      createdAt: new Date(),
      status: insertClient.status || "active",
      phone: insertClient.phone || null,
      notes: insertClient.notes || null
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: string, updates: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient = { ...client, ...updates };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: string): Promise<boolean> {
    return this.clients.delete(id);
  }

  async searchClients(query: string): Promise<Client[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.clients.values()).filter(
      client => 
        client.companyName.toLowerCase().includes(lowerQuery) ||
        client.contactPerson.toLowerCase().includes(lowerQuery) ||
        client.email.toLowerCase().includes(lowerQuery)
    );
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByStatus(status: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      project => project.status === status
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date(),
      clientId: insertProject.clientId || null
    };
    this.projects.set(id, project);
    return project;
  }

  // Comment methods
  async getComments(): Promise<Comment[]> {
    return Array.from(this.comments.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = { 
      ...insertComment, 
      id, 
      createdAt: new Date(),
      company: insertComment.company || null
    };
    this.comments.set(id, comment);
    return comment;
  }

  // Planset methods
  async getPlansets(): Promise<Planset[]> {
    return Array.from(this.plansets.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getPlansetsByProjectId(projectId: string): Promise<Planset[]> {
    return Array.from(this.plansets.values())
      .filter(planset => planset.projectId === projectId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createPlanset(insertPlanset: InsertPlanset): Promise<Planset> {
    const id = randomUUID();
    const now = new Date();
    const planset: Planset = {
      ...insertPlanset,
      id,
      createdAt: now,
      updatedAt: now,
      timezone: insertPlanset.timezone || null,
      receivedTime: insertPlanset.receivedTime || null,
      portalName: insertPlanset.portalName || null,
      customerPhone: insertPlanset.customerPhone || null,
      coordinates: insertPlanset.coordinates || null,
      apnNumber: insertPlanset.apnNumber || null,
      authorityHavingJurisdiction: insertPlanset.authorityHavingJurisdiction || null,
      utilityName: insertPlanset.utilityName || null,
      addOnEquipments: insertPlanset.addOnEquipments || null,
      governingCodes: insertPlanset.governingCodes || null,
      moduleManufacturer: insertPlanset.moduleManufacturer || null,
      moduleModelNo: insertPlanset.moduleModelNo || null,
      moduleQuantity: insertPlanset.moduleQuantity || null,
      inverterManufacturer: insertPlanset.inverterManufacturer || null,
      inverterModelNo: insertPlanset.inverterModelNo || null,
      inverterQuantity: insertPlanset.inverterQuantity || null,
      newConstruction: insertPlanset.newConstruction ?? false,
      existingSolarSystem: insertPlanset.existingSolarSystem ?? false,
      proposalDesignFiles: insertPlanset.proposalDesignFiles || [],
      sitesurveyAttachments: insertPlanset.sitesurveyAttachments || [],
      additionalComments: insertPlanset.additionalComments || null,
    };
    this.plansets.set(id, planset);
    return planset;
  }

  async updatePlanset(id: string, updateData: Partial<InsertPlanset>): Promise<Planset | undefined> {
    const existing = this.plansets.get(id);
    if (!existing) return undefined;

    const updated: Planset = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.plansets.set(id, updated);
    return updated;
  }

  async deletePlanset(id: string): Promise<boolean> {
    return this.plansets.delete(id);
  }

  // Attendance methods
  async getAttendance(): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getAttendanceByEmployee(employeeId: string): Promise<Attendance[]> {
    return Array.from(this.attendance.values())
      .filter(att => att.employeeId === employeeId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getAttendanceByDate(date: string): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(att => att.date === date);
  }

  async getTodayAttendance(employeeId: string): Promise<Attendance | undefined> {
    const today = new Date().toISOString().split('T')[0];
    return Array.from(this.attendance.values()).find(
      att => att.employeeId === employeeId && att.date === today
    );
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const id = randomUUID();
    const now = new Date();
    const attendance: Attendance = {
      ...insertAttendance,
      id,
      createdAt: now,
      updatedAt: now,
      workingHours: insertAttendance.workingHours || 0,
      notes: insertAttendance.notes || null,
      punchIn: insertAttendance.punchIn || null,
      punchOut: insertAttendance.punchOut || null,
    };
    this.attendance.set(id, attendance);
    return attendance;
  }

  async updateAttendance(id: string, updates: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const attendance = this.attendance.get(id);
    if (!attendance) return undefined;
    
    const updatedAttendance = { 
      ...attendance, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.attendance.set(id, updatedAttendance);
    return updatedAttendance;
  }

  async punchIn(employeeId: string): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const punchInTime = now.toTimeString().substring(0, 5); // HH:MM format
    
    // Check if already punched in today
    const existingAttendance = await this.getTodayAttendance(employeeId);
    if (existingAttendance) {
      throw new Error("Already punched in today");
    }

    const attendance: InsertAttendance = {
      employeeId,
      date: today,
      punchIn: punchInTime,
      status: "present",
    };

    return this.createAttendance(attendance);
  }

  async punchOut(employeeId: string): Promise<Attendance | undefined> {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const punchOutTime = now.toTimeString().substring(0, 5); // HH:MM format
    
    const todayAttendance = await this.getTodayAttendance(employeeId);
    if (!todayAttendance || !todayAttendance.punchIn) {
      throw new Error("No punch-in record found for today");
    }

    // Calculate working hours
    const punchInParts = todayAttendance.punchIn.split(':');
    const punchInMinutes = parseInt(punchInParts[0]) * 60 + parseInt(punchInParts[1]);
    const punchOutParts = punchOutTime.split(':');
    const punchOutMinutes = parseInt(punchOutParts[0]) * 60 + parseInt(punchOutParts[1]);
    const workingMinutes = punchOutMinutes - punchInMinutes;

    return this.updateAttendance(todayAttendance.id, {
      punchOut: punchOutTime,
      workingHours: workingMinutes,
    });
  }

  // Leave Request methods
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return Array.from(this.leaveRequests.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]> {
    return Array.from(this.leaveRequests.values())
      .filter(req => req.employeeId === employeeId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createLeaveRequest(insertRequest: InsertLeaveRequest): Promise<LeaveRequest> {
    const id = randomUUID();
    const request: LeaveRequest = {
      ...insertRequest,
      id,
      status: insertRequest.status || "pending",
      approvedBy: insertRequest.approvedBy || null,
      approvedAt: insertRequest.approvedAt || null,
      comments: insertRequest.comments || null,
      createdAt: new Date(),
    };
    this.leaveRequests.set(id, request);
    return request;
  }

  async updateLeaveRequest(id: string, updates: Partial<InsertLeaveRequest>): Promise<LeaveRequest | undefined> {
    const request = this.leaveRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updates };
    this.leaveRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async approveLeaveRequest(id: string, approvedBy: string): Promise<LeaveRequest | undefined> {
    return this.updateLeaveRequest(id, {
      status: "approved",
      approvedBy,
      approvedAt: new Date(),
    });
  }

  async rejectLeaveRequest(id: string, approvedBy: string, comments?: string): Promise<LeaveRequest | undefined> {
    return this.updateLeaveRequest(id, {
      status: "rejected",
      approvedBy,
      approvedAt: new Date(),
      comments,
    });
  }

  // Department methods
  async getDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }

  async getDepartment(id: string): Promise<Department | undefined> {
    return this.departments.get(id);
  }

  async createDepartment(insertDepartment: InsertDepartment): Promise<Department> {
    const id = randomUUID();
    const department: Department = {
      ...insertDepartment,
      id,
      description: insertDepartment.description || null,
      managerId: insertDepartment.managerId || null,
      budget: insertDepartment.budget || 0,
      status: insertDepartment.status || "active",
      createdAt: new Date(),
    };
    this.departments.set(id, department);
    return department;
  }

  async updateDepartment(id: string, updates: Partial<InsertDepartment>): Promise<Department | undefined> {
    const department = this.departments.get(id);
    if (!department) return undefined;
    
    const updatedDepartment = { ...department, ...updates };
    this.departments.set(id, updatedDepartment);
    return updatedDepartment;
  }

  async deleteDepartment(id: string): Promise<boolean> {
    return this.departments.delete(id);
  }

  // Payroll methods
  async getPayroll(): Promise<Payroll[]> {
    return Array.from(this.payroll.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getPayrollByEmployee(employeeId: string): Promise<Payroll[]> {
    return Array.from(this.payroll.values())
      .filter(pay => pay.employeeId === employeeId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createPayroll(insertPayroll: InsertPayroll): Promise<Payroll> {
    const id = randomUUID();
    const payroll: Payroll = {
      ...insertPayroll,
      id,
      allowances: insertPayroll.allowances || 0,
      deductions: insertPayroll.deductions || 0,
      bonus: insertPayroll.bonus || 0,
      overtime: insertPayroll.overtime || 0,
      status: insertPayroll.status || "pending",
      processedAt: insertPayroll.processedAt || null,
      createdAt: new Date(),
    };
    this.payroll.set(id, payroll);
    return payroll;
  }

  async updatePayroll(id: string, updates: Partial<InsertPayroll>): Promise<Payroll | undefined> {
    const payroll = this.payroll.get(id);
    if (!payroll) return undefined;
    
    const updatedPayroll = { ...payroll, ...updates };
    this.payroll.set(id, updatedPayroll);
    return updatedPayroll;
  }
}

export const storage = new MemStorage();
