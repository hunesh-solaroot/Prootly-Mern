import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(),
  status: text("status").notNull().default("active"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const employeeProfiles = pgTable("employee_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: text("employee_id").notNull(),
  fullName: text("full_name").notNull(),
  department: text("department").notNull(),
  designation: text("designation").notNull(),
  email: text("email").notNull(),
  contactNumber: text("contact_number").notNull(),
  joiningDate: timestamp("joining_date").notNull(),
  profilePicture: text("profile_picture"),
  performanceScore: integer("performance_score").notNull().default(75),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status").notNull().default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  status: text("status").notNull(), // completed, hold, new, revision
  clientId: varchar("client_id").references(() => clients.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const plansets = pgTable("plansets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  
  // Timezone and Time Info
  timezone: text("timezone"),
  receivedTime: text("received_time"), // Changed to text to accept string input
  portalName: text("portal_name"),
  companyName: text("company_name").notNull(),
  
  // Homeowner Information
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  siteAddress: text("site_address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  
  // Map Coordinates
  coordinates: text("coordinates"),
  
  // APN and Project Info
  apnNumber: text("apn_number"),
  authorityHavingJurisdiction: text("authority_having_jurisdiction"),
  utilityName: text("utility_name"),
  mountType: text("mount_type").notNull(),
  addOnEquipments: text("add_on_equipments"),
  governingCodes: text("governing_codes"),
  
  // Property and Job Types
  propertyType: text("property_type").notNull(), // residential, commercial
  jobType: text("job_type").notNull(), // pv, pv+battery, battery
  newConstruction: boolean("new_construction").notNull().default(false),
  
  // Module Information
  moduleManufacturer: text("module_manufacturer"),
  moduleModelNo: text("module_model_no"),
  moduleQuantity: integer("module_quantity"),
  
  // Inverter Information
  inverterManufacturer: text("inverter_manufacturer"),
  inverterModelNo: text("inverter_model_no"),
  inverterQuantity: integer("inverter_quantity"),
  
  // Solar System
  existingSolarSystem: boolean("existing_solar_system").notNull().default(false),
  
  // File Attachments (stored as JSON array of file paths)
  proposalDesignFiles: text("proposal_design_files").array(),
  sitesurveyAttachments: text("sitesurvey_attachments").array(),
  additionalComments: text("additional_comments"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  author: text("author").notNull(),
  company: text("company"),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Attendance tracking table
export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull().references(() => employees.id),
  date: text("date").notNull(), // YYYY-MM-DD format
  punchIn: text("punch_in"), // HH:MM format
  punchOut: text("punch_out"), // HH:MM format
  status: text("status").notNull(), // present, absent, late, half-day
  workingHours: integer("working_hours").default(0), // in minutes
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Leave management table
export const leaveRequests = pgTable("leave_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull().references(() => employees.id),
  leaveType: text("leave_type").notNull(), // vacation, sick, personal, emergency
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  days: integer("days").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  approvedBy: varchar("approved_by"),
  approvedAt: timestamp("approved_at"),
  comments: text("comments"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Department management table
export const departments = pgTable("departments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  managerId: varchar("manager_id"),
  budget: integer("budget").default(0),
  status: text("status").notNull().default("active"), // active, inactive
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Payroll management table
export const payroll = pgTable("payroll", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull().references(() => employees.id),
  month: text("month").notNull(), // YYYY-MM format
  basicSalary: integer("basic_salary").notNull(),
  allowances: integer("allowances").default(0),
  deductions: integer("deductions").default(0),
  bonus: integer("bonus").default(0),
  overtime: integer("overtime").default(0),
  grossSalary: integer("gross_salary").notNull(),
  netSalary: integer("net_salary").notNull(),
  status: text("status").notNull().default("pending"), // pending, processed, paid
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertEmployeeProfileSchema = createInsertSchema(employeeProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlansetSchema = createInsertSchema(plansets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  receivedTime: z.string().optional(),
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({
  id: true,
  createdAt: true,
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
  createdAt: true,
});

export const insertPayrollSchema = createInsertSchema(payroll).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertEmployeeProfile = z.infer<typeof insertEmployeeProfileSchema>;
export type EmployeeProfile = typeof employeeProfiles.$inferSelect;

export type InsertPlanset = z.infer<typeof insertPlansetSchema>;
export type Planset = typeof plansets.$inferSelect;

export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendance.$inferSelect;

export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type LeaveRequest = typeof leaveRequests.$inferSelect;

export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Department = typeof departments.$inferSelect;

export type InsertPayroll = z.infer<typeof insertPayrollSchema>;
export type Payroll = typeof payroll.$inferSelect;
