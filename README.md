# Dental Clinic Admin Panel API Documentation

## Base URL

```http
http://localhost:5000/api

## Live Url

https://pearlines-frontend-1.onrender.com/
```

---

# User APIs

## Create User

```http
POST /users
```

### Request Body

```json
{
  "email": "aditya@gmail.com",
  "mobileNo": "9876543210",
  "dob": "2000-01-01",
  "address": "Bhopal, Madhya Pradesh",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {}
}
```

---

## Get All Users

```http
GET /users
```

### Response

```json
{
  "success": true,
  "count": 5,
  "data": []
}
```

---

## Get User By ID

```http
GET /users/:id
```

### Example

```http
GET /users/6851abc123
```

---

## Delete User

```http
DELETE /users/:id
```

### Example

```http
DELETE /users/6851abc123
```

---

# Appointment APIs

## Create Appointment

```http
POST /appointments
```

### Request Body

```json
{
  "patientId": "6851abc123",
  "patientName": "Aditya Kewat",
  "email": "aditya@gmail.com",
  "mobileNo": "9876543210",
  "appointmentDate": "2026-06-17",
  "appointmentTime": "10:00 AM - 10:30 AM",
  "problem": "Tooth Pain"
}
```

### Default Status

```text
Pending
```

---

## Get All Appointments

```http
GET /appointments
```

### Response

```json
{
  "success": true,
  "count": 10,
  "data": []
}
```

---

## Get Appointment By ID

```http
GET /appointments/:id
```

### Example

```http
GET /appointments/6852abc123
```

---

## Update Appointment

```http
PUT /appointments/:id
```

### Request Body

```json
{
  "appointmentDate": "2026-06-20",
  "appointmentTime": "11:00 AM - 11:30 AM",
  "problem": "Root Canal",
  "status": "Accepted",
  "notes": "Patient advised for X-Ray"
}
```

### Status Values

```text
Pending
Accepted
Rescheduled
```

---

## Delete Appointment

```http
DELETE /appointments/:id
```

### Example

```http
DELETE /appointments/6852abc123
```

---

# Dashboard APIs

## Dashboard Statistics

```http
GET /dashboard/stats
```

### Response

```json
{
  "success": true,
  "data": {
    "totalUsers": 25,
    "totalAppointments": 12,
    "todayAppointments": 4,
    "totalDoctors": 0
  }
}
```

Revisit Appointment APIs
Create Revisit Appointment
POST /appointments/revisit
Request Body
{
"patientId": "685123abc",
"patientName": "Aditya Kewat",
"email": "aditya@gmail.com",
"mobileNo": "9876543210",
"appointmentDate": "2026-06-25",
"appointmentTime": "11:00 AM - 11:30 AM",
"problem": "Follow Up Visit",
"status": "Pending",
"parentAppointmentId": "685999xyz",
"nextVisit": "2026-07-10"
}
Response
{
"success": true,
"message": "Revisit appointment created successfully",
"data": {}
}
Get All Revisit Appointments
GET /appointments/revisit
Response
{
"success": true,
"count": 5,
"data": []
}
Get Revisit Appointment Detail

Uses existing Appointment API:

GET /appointments/:id
Example
GET /appointments/685123abc
Update Revisit Appointment

Uses existing Appointment API:

PUT /appointments/:id
Request Body
{
"appointmentDate": "2026-06-30",
"appointmentTime": "11:00 AM - 11:30 AM",
"problem": "Follow Up Visit",
"status": "Visited",
"nextVisit": "2026-07-20"
}
Status Values
Pending
Accepted
Visited
Appointment Collection Fields

Current Appointment Model

{
patientId,
patientName,
email,
mobileNo,

appointmentDate,
appointmentTime,

problem,

status,

notes,

isRevisit,

parentAppointmentId,

nextVisit,

createdAt,
updatedAt
}

# Today Appointment APIs

## Get Today's Appointments

GET /appointments/today

Response

{
"success": true,
"count": 2,
"data": []
}

1. Create Doctor
   Endpoint
   POST /api/doctors
   Request Body
   {
   "name": "Dr Amit Sharma",
   "mobileNo": "9876543210",
   "email": "amit@gmail.com",
   "mpin": "1234"
   }
   Success Response
   {
   "success": true,
   "message": "Doctor created successfully",
   "data": {
   "\_id": "685123abc",
   "name": "Dr Amit Sharma",
   "mobileNo": "9876543210",
   "email": "amit@gmail.com",
   "mpin": "1234"
   }
   }
2. Get All Doctors
   Endpoint
   GET /api/doctors
   Success Response
   {
   "success": true,
   "count": 2,
   "data": []
   }
3. Get Doctor By Id
   Endpoint
   GET /api/doctors/:id
   Example
   GET /api/doctors/685123abc
   Success Response
   {
   "success": true,
   "data": {
   "\_id": "685123abc",
   "name": "Dr Amit Sharma",
   "mobileNo": "9876543210",
   "email": "amit@gmail.com",
   "mpin": "1234"
   }
   }
4. Update Doctor
   Endpoint
   PUT /api/doctors/:id
   Example
   PUT /api/doctors/685123abc
   Request Body
   {
   "name": "Dr Amit Kumar",
   "mobileNo": "9876543210",
   "email": "amit@gmail.com",
   "mpin": "5678"
   }
   Success Response
   {
   "success": true,
   "message": "Doctor updated successfully",
   "data": {}
   }
5. Delete Doctor
   Endpoint
   DELETE /api/doctors/:id
   Example
   DELETE /api/doctors/685123abc
   Success Response
   {
   "success": true,
   "message": "Doctor deleted successfully"
   }

Doctor Schedule APIs

Base URL

/api/doctor-schedules
Create Doctor Schedule
Endpoint
POST /api/doctor-schedules
Request Body
{
"doctorId": "685123abc",
"date": "2026-06-20",
"time": "10:00 AM - 02:00 PM",
"status": "Available"
}
Success Response
{
"success": true,
"message": "Doctor schedule created successfully",
"data": {}
}
Get All Doctor Schedules
Endpoint
GET /api/doctor-schedules
Success Response
{
"success": true,
"count": 5,
"data": []
}
Get Doctor Schedule By Id
Endpoint
GET /api/doctor-schedules/:id
Example
GET /api/doctor-schedules/685123abc
Update Doctor Schedule
Endpoint
PUT /api/doctor-schedules/:id
Request Body
{
"doctorId": "685123abc",
"date": "2026-06-25",
"time": "11:00 AM - 03:00 PM",
"status": "Leave"
}
Delete Doctor Schedule
Endpoint
DELETE /api/doctor-schedules/:id
Doctor Schedule Schema
{
doctorId,
date,
time,
status
}
