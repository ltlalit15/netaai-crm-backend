import Controllers from "../Models/Model.js";
import bcrypt from "bcrypt";

import { generateAccessToken } from "../Config/Jwt.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";
import { sendEmail } from "../Utils/emailService.js";

const UserTable = new Controllers("users");

class AuthController {

  static async register(req, res) {
    try {
      const { first_name, email, password, phone, last_name } = req.body;

      if (!first_name || !email || !password || !last_name || !phone) {
        return errorResponse(res, 400, "All fields are required.");
      }

      const existingUser = await UserTable.findEmail(email);
      if (existingUser) {
        return errorResponse(res, 400, "Email already exists.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const data = {
        first_name,
        email,
        phone,
        last_name,
        password: hashedPassword,
      };

      const result = await UserTable.create(data);

      const Admin_data = await UserTable.getById(result?.insertId)
      return successResponse(res, 201, "Admin created successfully", Admin_data);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async logins(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return errorResponse(res, 400, "All fields are required.");
      }

      let existingUser = await UserTable.findEmail(email);

      if (!existingUser) {
        return errorResponse(res, 404, "Invalid email or password.");
      }

      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        return errorResponse(res, 404, "Invalid email or password");
      }

      // Generate access token
      const accessToken = generateAccessToken({
        id: existingUser.id,
        role: existingUser.role
      });

      // Exclude password from user data
      const { password: _, ...userData } = existingUser;

      // Send token with user details
      return successResponse(res, 200, "Login successful.", {
        accessToken,
        user: userData
      });

    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }


  static async createUser(req, res) {
    try {
      const {
        role_id,
        first_name,
        last_name,
        email,
        department_id,
        direct_manager,
        approval_authority,
        cell_phone,
        employee_id,
        status,
      } = req.body;

      // ✅ 1. Check if email already exists
      const existingUser = await UserTable.findByEmail(email);
      if (existingUser) {
        return errorResponse(res, 409, "Email already exists");
      }

      // 1. Generate random 8-character password
      const randomPassword = Math.random().toString(36).slice(-8);

      // 2. Hash password before storing
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const data = {
        role_id,
        first_name,
        last_name,
        email,
        department_id,
        direct_manager,
        approval_authority,
        cell_phone,
        employee_id,
        password: hashedPassword,
        status: status ?? 'active'
      };

      const result = await UserTable.create(data);
      const inserted = await UserTable.getById(result.insertId);


      // 4. Styled Email HTML
      const emailBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
        <h2 style="color: #2e8b57;">Hello ${first_name},</h2>

        <p><b>Your account has been created successfully Bon-Bon.</b></p>

        <table style="margin-top: 10px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><b>Email:</b></td>
            <td style="padding: 8px 0;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><b>Temporary Password:</b></td>
            <td style="padding: 8px 0;">${randomPassword}</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">
          <i style="color: #d35400;">This is a temporary password. Please update it at the time of login.</i>
        </p>

        <p style="margin-top: 30px;">
          Regards,<br/>
          <b>Kiaan Technology</b>
        </p>
      </div>
    `;

      // 5. Send styled email
      await sendEmail(email, "Your Temporary Account Password", emailBody);

      return successResponse(res, 201, "User created successfully", inserted);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }



  static async updatePassword(req, res) {
  try {
    const { user_id, old_password, new_password } = req.body;

    // 1. Validate input
    if (!user_id || !old_password || !new_password) {
      return errorResponse(res, 400, "User ID, old password, and new password are required");
    }

    // 2. Find user by ID
    const user = await UserTable.getById(user_id);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    // 3. Compare old password
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return errorResponse(res, 401, "Old password is incorrect");
    }

    // 4. Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // 5. Update password in DB
    await UserTable.update(user_id, { password: hashedPassword });

    return successResponse(res, 200, "Password updated successfully");
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong");
  }
}


  static async getAllUsers(req, res) {
    try {
      const users = await UserTable.runCustomQuery(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.cell_phone,
        u.direct_manager,
        u.approval_authority,
        u.status,
        r.role AS role,
        d.department_name AS department
      FROM users u
      LEFT JOIN role r ON u.role_id = r.id
      LEFT JOIN departments d ON u.department_id = d.id
     
    `);

      return successResponse(res, 200, "Users fetched successfully", users);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  // GET USER BY ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserTable.getById(id);
      if (!user) return errorResponse(res, 404, "User not found");
      return successResponse(res, 200, "User retrieved successfully", user);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const {
        role_id,
        first_name,
        last_name,
        email,
        department_id,
        direct_manager,
        approval_authority,
        cell_phone,
        employee_id,
        status,
      } = req.body;

      const data = {
        role_id,
        first_name,
        last_name,
        email,
        department_id,
        direct_manager,
        approval_authority,
        cell_phone,
        employee_id,
        status: status ?? 'active'
      };

      // Update in DB
      const result = await UserTable.update(id, data);

      if (result.affectedRows === 0) {
        return errorResponse(res, 404, "User not found");
      }

      // Fetch updated record
      const updatedUser = await UserTable.getById(id);

      return successResponse(res, 200, "User updated successfully", updatedUser);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await UserTable.delete(id);
      return successResponse(res, 200, "User deleted successfully");
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

}

export default AuthController;
