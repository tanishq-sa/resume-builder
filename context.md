# Context for Frontend Internship Assignment

## Project Overview
The task is to build a **Next.js + TypeScript app** that collects user details, generates a PDF, previews it, and allows downloading. The app consists of **two screens**:

---

## Screen 1: Form
### Fields
- **Name** (required)
- **Email** (required, must be valid format)
- **Phone Number** (required, at least 10 digits)
- **Position**
- **Description** (multiline)

### Buttons
- **View PDF** → Navigates to PDF preview page
- **Download PDF** → Directly downloads the generated PDF

### Validation Rules
- Name, Email, Phone are mandatory
- Email must follow proper format
- Phone must have ≥ 10 digits

---

## Screen 2: PDF Preview
### Features
- Shows the PDF layout with the entered details

### Buttons
- **Back** → Returns to form with data intact
- **Download PDF** → Downloads the generated PDF

---

## Objective
- Implement a **PDF Generator App** using **Next.js + TypeScript**
- Ensure smooth navigation between **form entry** and **PDF preview**
- Maintain validation and proper download functionality