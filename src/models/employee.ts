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

  /**
   * Create Employee
   */
  static async create(data: CreateEmployeeInput): Promise<Employee> {
    let employeeId = data.employee_id;

    // Auto-generate if not provided
    if (!employeeId) {
      employeeId = await this.generateEmployeeId();
    }

    // Check uniqueness if manually provided
    if (data.employee_id) {
      const existing = await this.findByEmployeeId(data.employee_id);
      if (existing) {
        throw new Error("Employee ID already exists");
      }
    }

    const result = await query(
      `INSERT INTO employees 
      (name, email, employee_id, salary, account_number, bank_code, bank_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        data.name,
        data.email,
        employeeId,
        data.salary,
        data.account_number,
        data.bank_code,
        data.bank_name,
      ],
    );

    return result.rows[0];
  }

  /**
   * Get all active employees
   */
  static async findAll(): Promise<Employee[]> {
    const result = await query(
      `SELECT * FROM employees 
       WHERE is_active = true 
       ORDER BY created_at DESC`,
    );
    return result.rows;
  }

  /**
   * Get employee by DB ID
   */
  static async findById(id: number): Promise<Employee | null> {
    const result = await query("SELECT * FROM employees WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  /**
   * Get employee by Employee ID
   */
  static async findByEmployeeId(employeeId: string): Promise<Employee | null> {
    const result = await query(
      `SELECT * FROM employees 
       WHERE employee_id = $1 AND is_active = true`,
      [employeeId],
    );

    return result.rows[0] || null;
  }

  /**
   * Update employee (partial update)
   */
  static async update(
    id: number,
    data: Partial<CreateEmployeeInput>,
  ): Promise<Employee> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    // Add updated_at
    fields.push(`updated_at = $${paramCount}`);
    values.push(new Date());

    // Add id for WHERE clause
    values.push(id);

    const result = await query(
      `UPDATE employees 
       SET ${fields.join(", ")} 
       WHERE id = $${paramCount + 1}
       RETURNING *`,
      values,
    );

    return result.rows[0];
  }

  /**
   * Soft delete employee
   */
  static async delete(id: number): Promise<void> {
    await query(
      `UPDATE employees 
       SET is_active = false, updated_at = NOW() 
       WHERE id = $1`,
      [id],
    );
  }
}
