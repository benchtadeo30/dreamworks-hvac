import { sql } from 'drizzle-orm';
import { tinyint } from 'drizzle-orm/mysql-core';
import { date } from 'drizzle-orm/mysql-core';
import { datetime } from 'drizzle-orm/mysql-core';
import { mysqlEnum } from 'drizzle-orm/mysql-core';
import { int, mysqlTable, serial, varchar, bigint } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users', {
  user_id: serial().primaryKey(),
  first_name: varchar({ length: 80 }).notNull(),
  last_name: varchar({ length: 80 }).notNull(),
  email: varchar({ length: 150 }).notNull().unique(),
  phone: varchar({ length: 20 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  role: mysqlEnum(['customer','admin']).notNull(),
  created_at: datetime().notNull().default(sql`current_timestamp()`),
  terms_accepted: tinyint().notNull()
});

export const employeesTable = mysqlTable('employees', {
  employee_id: serial().primaryKey(),
  user_id: bigint("user_id", {mode: 'number', unsigned: true}).references(() => usersTable.user_id, { onDelete: 'cascade' }),
  full_name: varchar({ length: 160 }).notNull(),
  role: mysqlEnum(['technician','admin','super_admin']).notNull(),
  specialization: varchar({ length: 150 }),
  contact_phone: varchar({ length: 20 }),
  status: mysqlEnum(['active', 'inactive']).notNull().default('active'),
  date_hired: date()
});

export const customersTable = mysqlTable('clients', {
  client_id: serial().primaryKey(),
  user_id: bigint("user_id", {mode: 'number', unsigned: true}).references(() => usersTable.user_id, { onDelete: 'cascade' }),
  email: varchar({ length: 150 }).notNull(),
  phone: varchar({ length: 20 }).notNull(),
  address: varchar({length: 255}),
  city_area: varchar({length: 100}),
  property_type: mysqlEnum(['Residential','Commercial','Industrial']).notNull(),
  client_status: mysqlEnum(['New Client','Active','Completed']).notNull(),
  member_since: date()
});