import { query } from "../config/database.js";

export interface Employee {
  id: number;
  name: string;
  email: string;
  employee_id: string;
  salary: number;
  account_number: string;
  bank_code: string;
  bank_name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  employee_id?: string;
  salary: number;
  account_number: string;
  bank_code: string;
  bank_name: string;
}

export class EmployeeModel {
  // Class methods will go here
  private static async generateEmployeeId(): Promise<string> {
    // Get the highest existing employee_id number that matches EMP### pattern
    const result = await query(
      `SELECT employee_id FROM employees
       WHERE employee_id LIKE 'EMP%'
       AND LENGTH(employee_id) >= 4
       AND SUBSTRING(employee_id FROM 4) ~ '^[0-9]+$'
       ORDER BY CAST(SUBSTRING(employee_id FROM 4) AS INTEGER) DESC
       LIMIT 1`,
    );

    if (result.rows.length === 0) {
      return "EMP001";
    }

    const lastId = result.rows[0].employee_id;
    const numberPart = lastId.substring(3);
    const lastNumber = parseInt(numberPart, 10);

    if (isNaN(lastNumber)) {
      return "EMP001";
    }

    const nextNumber = lastNumber + 1;
    // Format as EMP001, EMP002, etc. (3 digits minimum)
    return `EMP${nextNumber.toString().padStart(3, "0")}`;
  }
}
