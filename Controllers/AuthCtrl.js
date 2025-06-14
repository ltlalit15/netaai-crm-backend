import Controllers from "../Models/Model.js";
import bcrypt from "bcrypt";

import { generateAccessToken } from "../Config/Jwt.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

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


    static async userRegister(req, res) {
        try {
            const {
                first_name,
                last_name,
                email,
                phone,
                password,
                department,
                access_type,
                role,
                direct_manager,
                enable_approval_authority,
                cell_phone,
                employee_id,

                // Permissions
                manage_vendor_bills,
                invoice_clients,
                track_time,
                manage_client_agreements,
                schedule_resources,
                view_financials,
                foreman_or_approve_timecards,
                access_quickbooks,
                manage_or_estimate_jobs,
                is_admin
            } = req.body;

            // Validation
            if (!first_name || !last_name || !email || !phone || !password || !role || !access_type) {
                return errorResponse(res, 400, "All required fields must be filled.");
            }

            const existingUser = await UserTable.findEmail(email);
            if (existingUser) {
                return errorResponse(res, 400, "Email already exists.");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const data = {
                first_name,
                last_name,
                email,
                phone,
                password: hashedPassword,
                department,
                access_type,
                role,
                direct_manager,
                enable_approval_authority: enable_approval_authority || 'No',
                cell_phone,
                employee_id,
                manage_vendor_bills: manage_vendor_bills || 'No',
                invoice_clients: invoice_clients || 'No',
                track_time: track_time || 'No',
                manage_client_agreements: manage_client_agreements || 'No',
                schedule_resources: schedule_resources || 'No',
                view_financials: view_financials || 'No',
                foreman_or_approve_timecards: foreman_or_approve_timecards || 'No',
                access_quickbooks: access_quickbooks || 'No',
                manage_or_estimate_jobs: manage_or_estimate_jobs || 'No',
                is_admin: is_admin || 'No'
            };

            const result = await UserTable.create(data);
            const user_data = await UserTable.getById(result?.insertId);

            return successResponse(res, 201, "User created successfully", user_data);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

}

export default AuthController;
