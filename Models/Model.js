import db from "../Config/Connection.js"

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async getAll() {
    const [rows] = await db.query(`SELECT * FROM ${this.tableName}`);
    return rows;
  }

  async getAllByRole(role) {
    const [rows] = await db.query(`SELECT * FROM ${this.tableName} WHERE role = ?`, [role]);
    return rows;
  }

  async getById(id) {
    const [rows] = await db.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async getByInstructorId(id) {
    const [rows] = await db.query(`SELECT * FROM ${this.tableName} WHERE instructor_id = ?`, [id]);
    return rows.length > 0 ? rows[0] : null;
  }
  async getByCourseId(id) {
    const [rows] = await db.query(`SELECT * FROM ${this.tableName} WHERE course_id = ?`, [id]);
    return rows.length > 0 ? rows : null;
  }

  async deleteByCourseId(id) {
    const [result] = await db.query(`DELETE FROM ${this.tableName} WHERE course_id = ?`, [id]);
    return result;
  }

  async findEmail(email) {
    const [rows] = await db.query(`SELECT * FROM ${this.tableName} WHERE email = ?`, [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  async create(data) {
    const [result] = await db.query(`INSERT INTO ${this.tableName} SET ?`, [data]);
    return result;
  }

  async update(id, data) {
    const [result] = await db.query(`UPDATE ${this.tableName} SET ? WHERE id = ?`, [data, id]);
    return result;
  }

  async updateStatus(id, status) {
    const [result] = await db.query(`UPDATE ${this.tableName} SET is_active = ? WHERE id = ?`, [status, id]);
    return result;
  }

  async updateByEmail(email, data) {
    const [result] = await db.query(`UPDATE ${this.tableName} SET ? WHERE email = ?`, [data, email]);
    return result;
  }

  async delete(id) {
    const [result] = await db.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    return result;
  }

  async runCustomQuery(query, params = []) {
    const [rows] = await db.query(query, params);
    return rows;
  }

  async updateStage(id, data) {
    // ✅ Defensive check for empty update object
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      throw new Error('Update data must be a non-empty object');
    }

    // ✅ Dynamically build SET part
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);

    const query = `UPDATE ${this.tableName} SET ${fields} WHERE id = ?`;

    // ✅ Execute with values
    const [result] = await db.query(query, [...values, id]);
    return result;
  }



  async getAllStudentsWithCourses() {
    const [result] = await db.query(`
      SELECT 
        s.id AS student_id,
        s.name AS student_name,
        s.is_active,
        s.email,
        s.mobile,
        c.id AS course_id,
        c.course_title,
        c.course_description,
        c.course_image,
        c.course_type,
        c.course_price,
        c.course_content_video_link,
        c.test_video,
        c.faqs,
        c.status,
        c.category_id,
        c.instructor_id
      FROM 
        student s
      JOIN 
        courses c 
      ON 
        FIND_IN_SET(c.id, REPLACE(REPLACE(REPLACE(s.course_id, '[', ''), ']', ''), ' ', ''))
      `,
    );
    return result;
  }

  async getStudentWithCourseById(id) {
    const [result] = await db.query(
      `
      SELECT 
        s.id AS student_id,
        s.name AS student_name,
        s.is_active,
        s.email,
        s.mobile,
        c.id AS course_id,
        c.course_title,
        c.course_description,
        c.course_image,
        c.course_type,
        c.course_price,
        c.course_content_video_link,
        c.test_video,
        c.faqs,
        c.status,
        c.category_id,
        c.instructor_id
      FROM 
        student s
      JOIN 
        courses c 
      ON 
        FIND_IN_SET(c.id, REPLACE(REPLACE(REPLACE(s.course_id, '[', ''), ']', ''), ' ', ''))
      WHERE 
        s.id = ?
      `,
      [id]
    );
    return result;
  }


  // Join proposals with users
  async getAllWithUsers() {
    const query = `
    SELECT 
      proposals.*, 
      s.id AS sales_id, 
      s.first_name AS sales_first_name,
      s.last_name AS sales_last_name,
      m.id AS manager_id,
      m.first_name AS manager_first_name,
      m.last_name AS manager_last_name 
    FROM proposals
    LEFT JOIN users s ON proposals.sales_id = s.id
    LEFT JOIN users m ON proposals.manager_id = m.id
    WHERE proposals.sales_id IS NOT NULL
  `;
    const [rows] = await db.execute(query);
    return rows;
  }


  async getAllSubTasksWithAssigneeDetails() {
    if (this.tableName !== 'sub_tasks') {
      throw new Error('This method is only available for sub_tasks table');
    }

    const [subTasks] = await db.query(`SELECT * FROM sub_tasks`);

    const uniqueUserIds = new Set();

    subTasks.forEach(task => {
      try {
        const ids = JSON.parse(task.assigneeId || '[]');
        ids.forEach(id => uniqueUserIds.add(id));
      } catch (err) {
        // Fallback if parsing fails
      }
    });

    const userIdList = Array.from(uniqueUserIds);

    let userMap = {};
    if (userIdList.length > 0) {
      const [users] = await db.query(
        `SELECT id, first_name, last_name FROM users WHERE id IN (?)`,
        [userIdList]
      );
      userMap = Object.fromEntries(users.map(u => [u.id, u]));
    }

    const result = subTasks.map(task => {
      const assigneeIds = JSON.parse(task.assigneeId || '[]');
      const assignees = assigneeIds.map(id => userMap[id]).filter(Boolean);
      return {
        ...task,
        assigneeId: assigneeIds,
        assignees
      };
    });

    return result;
  }



  async getByDailyLogId(dailylog_id) {
    // Ensure this method only runs if the table is 'comments'
    if (this.tableName !== 'comments') {
      throw new Error('getByDailyLogId is only supported for comments table');
    }

    const query = `
    SELECT 
      dl.id AS dailylog_id,
      dl.title AS dailylog_title,
      dl.notes AS dailylog_description,
      dl.created_at AS log_created_at,
      c.id AS comment_id,
      c.user_id,
      c.comment,
      c.created_at AS comment_created_at
    FROM daily_logs dl
    LEFT JOIN comments c ON dl.id = c.dailylog_id
    WHERE dl.id = ?
    ORDER BY c.created_at ASC;
  `;
    const [rows] = await db.execute(query, [dailylog_id]);
    return rows;
  }





  async getSubcriptionByAdminId(admin_id) {
    const [[sub]] = await db.query(
      `SELECT s.*, p.name AS plan_name, p.features FROM subscriptions s
     JOIN plans p ON p.id = s.plan_id
     WHERE s.admin_id = ? AND s.status = 'active' AND s.end_date > NOW()`,
      [admin_id]
    );
    return sub;
  }
  async findCategoryById(id) {
    const [rows] = await db.query(
      'SELECT category_name FROM category WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0]?.category_name || null;
  }

  async findCategory(ategory_name) {
    const [rows] = await db.query(
      'SELECT category_name FROM category WHERE category_name = ? LIMIT 1',
      [ategory_name]
    );
    return rows[0]?.category_name || null;
  }

  async findInstructorById(id) {
    const [rows] = await db.query(
      'SELECT * FROM instructor WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }

  async findProduct(product_title) {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE product_title = ?',
      [product_title]
    );
    console.log(rows);
    return rows[0];
  }

  async findCertificate(template_name) {
    const [rows] = await db.query(
      'SELECT * FROM certificate_template WHERE template_name = ?',
      [template_name]
    );
    console.log(rows);
    return rows[0];
  }

  async findarticle(title) {
    const [rows] = await db.query(
      'SELECT * FROM article  WHERE title  = ?',
      [title]
    );
    console.log(rows);
    return rows[0];
  }

  async count() {
    const [rows] = await db.query(`SELECT COUNT(*) AS total FROM ${this.tableName}`);
    return rows[0].total;
  }

  async activeInstructor() {
    const [rows] = await db.query(`SELECT COUNT(*) AS total FROM instructor WHERE is_active = 1`);
    return rows[0].total;
  }

  async isVerifiedInstructorCount(verified) {
    const [rows] = await db.query(`SELECT COUNT(*) AS total FROM instructor WHERE is_verified = ?`, [verified]);
    return rows[0].total;
  }

  async inactiveInstructor() {
    const [rows] = await db.query(`SELECT COUNT(*) AS total FROM instructor WHERE is_active = 0`);
    return rows[0].total;
  }

  async last3Student() {
    const [rows] = await db.query(`SELECT id, name, course_id FROM student ORDER BY created_at DESC LIMIT 3`);
    return rows;
  }

  async getStudentCourses(courseIds) {
    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return [];
    }

    const [rows] = await db.query(
      `SELECT course_title FROM courses WHERE id IN (${courseIds.map(() => '?').join(',')})`,
      courseIds
    );
    return rows;
  }

  async findByEmail(email) {
    const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
    return rows[0];
  }



  // In your MessageTable class or wherever getMessagesBetweenUsers is defined
  async getMessagesBetweenUsers({ sender_id, receiver_id }) {
    const sql = `
    SELECT * FROM messages
    WHERE (sender_id = ? AND receiver_id = ?)
       OR (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
  `;

    // Pass parameters for both parts of the OR condition
    const [rows] = await db.query(sql, [sender_id, receiver_id, receiver_id, sender_id]);
    // Destructure the result to get only the rows (messages)
    return rows;
  }
  async getCart(userId) {
    const [items] = await db.query(
      `SELECT 
       ci.id AS cart_item_id,
       c.id AS course_id,
       u.id AS user_id,
       c.course_title,
       c.course_image,
       c.course_type,
       c.course_price
     FROM cart_items ci
     JOIN courses c ON ci.course_id = c.id
     JOIN student u ON ci.user_id = u.id
     WHERE ci.user_id = ?`,
      [userId]
    );

    const total = items.reduce((sum, item) => sum + parseFloat(item.course_price), 0);

    return { items, total };
  };


  async getEnrollByStudntiId(studentId) {
    const [rows] = await db.query(
      `SELECT c.* FROM courses c
     JOIN enrollments e ON e.course_id = c.id
     WHERE e.student_id = ?`,
      [studentId]
    );
    return rows.length > 0 ? rows : null;
  }
  async getByCourseSyllabusId(course_syllabus_id) {
    const [row] = await db.query(`SELECT * FROM ${this.tableName} WHERE course_syllabus_id = ?`, [course_syllabus_id]);
    return row.length > 0 ? row : null;
  }
  async getByIdWithFieldsName(data, field_name, course_syllabus_id) {
    const [row] = await db.query(`SELECT ${data} FROM ${this.tableName} WHERE ${field_name} = ?`, [course_syllabus_id]);
    return row.length > 0 ? row : null;
  }

  async getONLYId(fields_name, id) {
    const [row] = await db.query(`SELECT id FROM ${this.tableName} WHERE ${fields_name} = ?`, [id]);
    return row.length > 0 ? row : null;
  }


  async deleteByFields(table_field, id) {
    const [result] = await db.query(`DELETE FROM ${this.tableName} WHERE ${table_field} = ?`, [id]);
    return result;
  }

}

export default BaseModel
