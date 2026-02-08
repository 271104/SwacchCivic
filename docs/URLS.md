# 🔗 Complete URL Reference

All URLs for the SMC Citizen Complaint Portal - Frontend and Backend endpoints.

---

## 🌐 Frontend URLs

### Base URL
```
http://localhost:5173
```

---

## 👥 Citizen Portal URLs

### Public Pages
| URL | Page | Description |
|-----|------|-------------|
| `/` | Home | Landing page (redirects to login) |
| `/login` | Login | Citizen login page |
| `/register` | Register | Citizen registration page |

### Protected Pages (Requires Citizen Login)
| URL | Page | Description |
|-----|------|-------------|
| `/dashboard` | Dashboard | Citizen dashboard with overview |
| `/register-complaint` | Register Complaint | Submit new complaint |
| `/my-complaints` | My Complaints | View all submitted complaints |

---

## 👮 Officer Portal URLs

### Public Pages
| URL | Page | Description |
|-----|------|-------------|
| `/officer/login` | Officer Login | Officer login page (email-based) |
| `/officer/register` | Officer Register | Officer registration page |

### Protected Pages (Requires Officer Login + Approval)
| URL | Page | Description |
|-----|------|-------------|
| `/officer/dashboard` | Officer Dashboard | Officer dashboard with assigned complaints |
| `/officer/pending` | Pending Complaints | View pending complaints |
| `/officer/resolved` | Resolved Complaints | View resolved complaints |

---

## 🔐 Admin Portal URLs

### Public Pages
| URL | Page | Description |
|-----|------|-------------|
| `/admin/login` | Admin Login | Admin login page |

### Protected Pages (Requires Admin Login)
| URL | Page | Description |
|-----|------|-------------|
| `/admin/dashboard` | Admin Dashboard | Admin dashboard with overview |
| `/admin/pending-approvals` | Pending Approvals | Approve/reject officer registrations |
| `/admin/officers` | Officers | Manage all officers |
| `/admin/departments` | Departments | Manage departments |
| `/admin/statistics` | Statistics | View system statistics |

---

## 🔌 Backend API URLs

### Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication APIs

### Citizen Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new citizen | No |
| POST | `/auth/login` | Citizen login | No |

**Register Request:**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "password": "password123"
}
```

**Login Request:**
```json
{
  "phone": "9876543210",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Logged in successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "phone": "9876543210",
    "role": "citizen"
  },
  "token": "eyJhbGc..."
}
```

---

### Officer Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/officer/register` | Register new officer | No |
| POST | `/auth/officer/login` | Officer login | No |

**Register Request:**
```json
{
  "name": "Officer Name",
  "email": "officer@example.com",
  "phone": "9876543210",
  "password": "password123",
  "department": "department_id"
}
```

**Login Request:**
```json
{
  "email": "officer@example.com",
  "password": "password123"
}
```

---

### Admin Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/admin/login` | Admin login | No |
| GET | `/admin/profile` | Get admin profile | Yes (Admin) |

**Login Request:**
```json
{
  "email": "admin@solapurcorporation.gov.in",
  "password": "admin123"
}
```

---

## 📝 Complaints APIs

### Citizen Complaints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/complaints` | Create new complaint | Yes (Citizen) |
| GET | `/complaints/mine` | Get my complaints | Yes (Citizen) |

**Create Complaint Request (multipart/form-data):**
```
title: "Broken Street Light"
description: "Street light not working since 3 days"
location: "MG Road, Near City Mall"
type: "Street Lighting"
image: [file]
```

**Response:**
```json
{
  "message": "Complaint registered successfully",
  "complaint": {
    "id": "...",
    "title": "Broken Street Light",
    "status": "pending",
    "priority": 3,
    "assignedDepartment": {...}
  }
}
```

---

### Officer Complaints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/complaints` | Get all complaints | Yes (Officer) |
| PUT | `/complaints/:id/status` | Update complaint status | Yes (Officer) |

**Update Status Request:**
```json
{
  "status": "in_progress"
}
```

Status values: `pending`, `in_progress`, `resolved`

---

## 👥 Admin - Officer Management APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/officers/pending` | Get pending officer approvals | Yes (Admin) |
| GET | `/admin/officers` | Get all officers | Yes (Admin) |
| GET | `/admin/officers/:id` | Get officer details | Yes (Admin) |
| PUT | `/admin/officers/:id/approve` | Approve officer | Yes (Admin) |
| PUT | `/admin/officers/:id/reject` | Reject officer | Yes (Admin) |
| PUT | `/admin/officers/:id/revoke` | Revoke officer access | Yes (Admin) |
| PUT | `/admin/officers/:id/activate` | Reactivate officer | Yes (Admin) |
| PUT | `/admin/officers/:id/department` | Change officer department | Yes (Admin) |
| DELETE | `/admin/officers/:id` | Delete officer | Yes (Admin) |

**Query Parameters for GET /admin/officers:**
```
?status=active          # Filter by status
?department=dept_id     # Filter by department
?search=name            # Search by name/email/phone
```

**Approve Officer Response:**
```json
{
  "message": "Officer approved successfully",
  "officer": {
    "id": "...",
    "name": "Officer Name",
    "status": "active",
    "approvedBy": {...}
  }
}
```

---

## 🏢 Admin - Department Management APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/departments` | Get all departments | Yes (Admin) |
| GET | `/admin/departments/:id` | Get department details | Yes (Admin) |
| POST | `/admin/departments` | Create new department | Yes (Admin) |
| PUT | `/admin/departments/:id` | Update department | Yes (Admin) |
| DELETE | `/admin/departments/:id` | Delete department | Yes (Admin) |

**Create Department Request:**
```json
{
  "name": "Roads and Infrastructure",
  "description": "Handles road repairs and infrastructure",
  "complaintTypes": [
    "Pothole",
    "Road Damage",
    "Bridge Repair"
  ],
  "contactEmail": "roads@solapurcorporation.gov.in",
  "contactPhone": "0217-2735293"
}
```

---

## 📊 Admin - Statistics APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/stats/overview` | Get system overview stats | Yes (Admin) |
| GET | `/admin/stats/departments` | Get department statistics | Yes (Admin) |
| GET | `/admin/stats/departments/:id` | Get specific department stats | Yes (Admin) |
| GET | `/admin/stats/officers` | Get officer statistics | Yes (Admin) |
| GET | `/admin/stats/officers/:id` | Get specific officer stats | Yes (Admin) |

**Overview Stats Response:**
```json
{
  "totalComplaints": 150,
  "pendingComplaints": 45,
  "inProgressComplaints": 30,
  "resolvedComplaints": 75,
  "totalCitizens": 500,
  "totalOfficers": 25,
  "activeDepartments": 5,
  "pendingOfficers": 3
}
```

**Query Parameters for Stats:**
```
?startDate=2024-01-01   # Filter by date range
?endDate=2024-12-31
?department=dept_id     # Filter by department
```

---

## 🌐 Public APIs (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/departments` | Get all active departments (for officer registration) |
| GET | `/` | API health check |

**Public Departments Response:**
```json
{
  "departments": [
    {
      "id": "...",
      "name": "Roads and Infrastructure",
      "description": "...",
      "complaintTypes": [...]
    }
  ]
}
```

---

## 🔒 Authentication Headers

All protected endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

**Example:**
```javascript
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'Content-Type': 'application/json'
}
```

---

## 📁 File Upload

### Complaint Image Upload
- **Endpoint:** POST `/complaints`
- **Content-Type:** `multipart/form-data`
- **Field Name:** `image`
- **Allowed Types:** JPG, JPEG, PNG
- **Max Size:** 5MB
- **Storage:** `Citizen-backend/uploads/complaints/`

**Access Uploaded Files:**
```
http://localhost:5000/uploads/complaints/complaint-1234567890.jpg
```

---

## 🎯 Quick Reference

### Default Credentials

**Admin:**
```
URL: http://localhost:5173/admin/login
Email: admin@solapurcorporation.gov.in
Password: admin123
```

**Test Citizen (if created):**
```
URL: http://localhost:5173/login
Phone: 8888888888
Password: test123
```

---

## 🔄 Common Workflows

### Citizen Workflow
1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Submit Complaint: `POST /api/complaints`
4. View Complaints: `GET /api/complaints/mine`

### Officer Workflow
1. Register: `POST /api/auth/officer/register`
2. Wait for admin approval
3. Login: `POST /api/auth/officer/login`
4. View Complaints: `GET /api/complaints`
5. Update Status: `PUT /api/complaints/:id/status`

### Admin Workflow
1. Login: `POST /api/admin/login`
2. View Pending Officers: `GET /api/admin/officers/pending`
3. Approve Officer: `PUT /api/admin/officers/:id/approve`
4. View Statistics: `GET /api/admin/stats/overview`

---

## 🌐 Environment-Specific URLs

### Development
```
Frontend: http://localhost:5173
Backend: http://localhost:5000
```

### Production (Update these when deploying)
```
Frontend: https://your-domain.com
Backend: https://api.your-domain.com
```

**Note:** Update API_URL in `citizen-frontend-react/src/services/api.js` for production.

---

## 📊 Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Invalid or missing token |
| 403 | Forbidden | Access denied (wrong role or inactive account) |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## 🔍 Testing URLs

### Test Backend Health
```bash
curl http://localhost:5000
# Should return: "SMC API running"
```

### Test Frontend
```bash
# Open in browser
http://localhost:5173
```

### Test API Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"8888888888","password":"test123"}'
```

---

## 📝 Notes

1. **All API endpoints** are prefixed with `/api`
2. **Protected routes** require valid JWT token
3. **Role-based access:** Endpoints check user role
4. **File uploads** use multipart/form-data
5. **Dates** are in ISO 8601 format
6. **IDs** are MongoDB ObjectIds

---

**For detailed API documentation, see [Admin Portal Backend Complete](ADMIN_PORTAL_BACKEND_COMPLETE.md)**
