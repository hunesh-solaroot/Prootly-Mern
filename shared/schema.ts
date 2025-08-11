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
  receivedTime: timestamp("received_time"),
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
