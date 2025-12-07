# Template README for BINF 503 Project

## Open on GitHub: [template\_\_README.md](https://github.com/nourgaser-giu/giu-bi-ebd-w2025/blob/main/template__milestone0_README.md)

## Download (ctrl+s to save): [template\_\_README.md](https://raw.githubusercontent.com/nourgaser-giu/giu-bi-ebd-w2025/main/template__milestone0_README.md)

<!-- Delete all of the above for your submission -->

   Tamwilna 
**Course:** Electronic Business Development (BINF 503)  
**Semester:** Winter 2025  
**Instructor:** Dr. Nourhan Hamdi  
**Teaching Assistants:** Mr. Nour Gaser, Mr. Omar Alaa

---

## 1. Team Members

_List all team members (5-6 students) below._

| Name             | Student ID | Tutorial Group | GitHub Username |
| :--------------- | :--------- | :-------------| :-------------- |
| [Abdullah Atef]  |      [13005088] | [T3]     | [abdallaatef2323] |
| [Fares Mohamed Fares] | [13006971] | [T3]     | [faresmohamedfares2005] |
| [Hamza mohamed goukh] | [13007396] | [T1]     | [abouelgoukh]  |
| [Mostafa Hossam]      | [13004637] | [T5]     | [mostafahossam205]  |
| [Ahmed walid elbanan] | [13001202] | [T5]     | [ahmedelbanann]     |
| [mohamed tamer ]      | [13007740] | [T4]     | [mohamedtamer296]   |

---

## 2. Project Description

- Concept : Tamwilna is a BNPL (Buy Now, Pay Later) restocking platform designed to support Egyptian kiosk owners who suffer from limited access to credit and cash-flow shortages. The project provides kiosks with the ability to reorder stock digitally and pay later, while suppliers receive instant guaranteed payments. The platform includes digital onboarding, field assessment, and a credit-scoring model that works even for undocumented merchants. Targeting over 3 million micro-retailers, Tamwilna aims to increase financial inclusion, strengthen supplier-merchant relationships, and stimulate small business growth.

- 
- **Link to Fin-Tech Course Document : ( https://www.canva.com/design/DAG5uCEf4VQ/Ek7C5kWJH4MddxZsfyOL2A/edit?utm_content=DAG5uCEf4VQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton )
---

## 3.Feature Breakdown

### 3.1 Full Scope

_List ALL potential features/user stories envisioned for the complete product (beyond just this course)._

1. User Authentication
2. User Roles & Profiles
3. Kiosk Onboarding & KYC
4. Kiosk Dashboard
5. Product Catalog & Search
6. Cart & BNPL Order Placement
7. Order Tracking
8. Credit Limit & BNPL Contract Management
9. Payments & Repayments
10. Notifications & Reminders
11. Supplier Module
12. Field Agent Module
13. Credit Scoring & Risk Engine
14. Collections & Overdue Management
15. Admin & Operations Dashboard
16. Reporting & Analytics
17. System & Security Features
18. Help & Support
- ...

### 3.2 Selected MVP Use Cases (Course Scope)

_From the list above, identify the **5 or 6 specific use cases** you will implement for this course. Note: User Authentication is mandatory._

1.  **User Authentication** (Registration/Login)
2.  Kiosk Onboarding & Profile
3. Product Catalog & Search
4. Cart & BNPL Order Placement
5. Credit Limit & BNPL Management
6. Orders List & Status Tracking 

---

## 4. Feature Assignments (Accountability)

_Assign one distinct use case from Section 3.2 to each team member. This member is responsible for the full-stack implementation of this feature._

| Team Member | Assigned Use Case       | Brief Description of Responsibility              |
| :---------- | :---------------------- | :----------------------------------------------- |
| [Ahmed Walid] | **User Authentication** | Register, Login, JWT handling, Password Hashing. |
| [Hamza abou el goukh ] | [Kiosk Onboarding & Profile]| [Collects and stores the kiosk’s business details such as owner information, location, and identification ]|
| [Mostafa Hossam] | [Product Catalog & Search]  | [Displays the available products and allows kiosks to browse or search for items to restock]                     |
| [Abdullah Atef] | [Cart & BNPL Order Placement]            | [Enables kiosks to add items to a cart and submit orders on a Buy-Now-Pay-Later basis.]              |
| [Fares Mohamed] | [Credit Limit & BNPL Management]            | [ Automatically checks whether the kiosk has enough available credit before approving an order]   |
| [Mohamed Tamer] | [Orders List & Status Tracking ]            | [Shows kiosks a history of their placed orders along with their current status and due dates]     |

---

## 5. Data Model (Initial Schemas)

_Define the initial Mongoose Schemas for your application’s main data models (User, Transaction, Account, etc.). You may use code blocks or pseudo-code._

### User Schema


const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['kiosk', 'admin'], default: 'kiosk' },
});


### [kiosk] Schema



  const KioskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  kioskName: { type: String, required: true },
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  creditLimit: { type: Number, default: 0 },
  outstandingBalance: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
});

### [Product] Schema

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  imageUrl: { type: String }
});
