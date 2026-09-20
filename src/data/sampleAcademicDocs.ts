import { DocumentCategory } from '../types';

export interface SampleDoc {
  id: string;
  name: string;
  category: DocumentCategory;
  pageCount: number;
  content: string;
}

export const SAMPLE_ACADEMIC_DOCS: SampleDoc[] = [
  {
    id: 'sample-academic-regs',
    name: 'Academic_Regulations_2025-26.pdf',
    category: 'Academic Regulations',
    pageCount: 14,
    content: `[Page 1]
ACADEMIC REGULATIONS AND CREDIT STRUCTURE (AY 2025-26)
SECTION 1: DEGREE REQUIREMENTS & CREDIT LOAD
1.1 Minimum Duration: The B.Tech undergraduate degree program shall be of 4 academic years (8 semesters).
1.2 Total Credit Requirement: A student must successfully complete a minimum of 160 credits to be eligible for the award of B.Tech degree.
1.3 Normal Course Load: The standard course load per semester is between 20 and 24 credits. No student shall be permitted to register for more than 28 credits in a single semester without prior approval from the Academic Dean.

[Page 2]
SECTION 2: GRADING SYSTEM & PASSING MARKS
2.1 Grading Scale: The institute follows a 10-point Cumulative Performance Index (CPI) grading scale ranging from 10 (S grade - Outstanding) to 4 (D grade - Pass).
2.2 Passing Criteria: To pass a subject, a student must secure at least 40% marks in the End-Semester Examination and a aggregate of 40% total marks in the course evaluation (Continuous Evaluation + End-Sem).
2.3 Probation & Promotion: A student securing a CPI of less than 5.0 at the end of the academic year will be placed on Academic Probation for the subsequent semester.

[Page 3]
SECTION 3: DEGREE CLASSIFICATION
3.1 First Class with Distinction: Awarded to students securing a final CPI of 8.50 or above with no backlog history during the program.
3.2 First Class: Awarded to students securing a final CPI between 6.50 and 8.49.
3.3 Second Class: Awarded to students securing a final CPI between 5.00 and 6.49.`
  },
  {
    id: 'sample-exam-attn',
    name: 'Examination_&_Attendance_Policy.pdf',
    category: 'Examination Rules',
    pageCount: 10,
    content: `[Page 1]
EXAMINATION AND ATTENDANCE MANDATE
SECTION 1: MANDATORY ATTENDANCE CRITERIA
1.1 General Rule: Students must maintain a minimum mandatory attendance of 75% in every registered course (theory and practical separately) to be eligible to appear in the End-Semester Examinations.
1.2 Medical / Condonation Exemption: Attendance up to 10% (i.e. between 65% and 74.9%) may be condoned by the Director on medical grounds or official institute deputation, provided valid documentary evidence is submitted within 3 working days of absence.
1.3 Strict Penalty for Shortage: Students having attendance below 65% shall NOT be allowed to appear for the examination under any circumstances and will be awarded 'F-N' (Failed due to short attendance) grade.
1.4 Note on Fines: The institute DOES NOT permit any monetary fine or fee payment in lieu of attendance shortage. Attendance cannot be purchased or relaxed by paying fees or fines.

[Page 2]
SECTION 2: RE-EVALUATION & GRACE MARKS
2.1 Answer Script Inspection: Students may request answer script re-evaluation or inspection within 7 days of result declaration by paying a re-evaluation fee of Rs. 500 per paper.
2.2 Supplementary Exams: Supplementary examinations will be conducted within 30 days after the end-semester results declaration for students failing up to 2 subjects.`
  },
  {
    id: 'sample-placement-internship',
    name: 'Placement_&_Internship_Guidelines.pdf',
    category: 'Placement & Internship',
    pageCount: 8,
    content: `[Page 1]
CAMPUS PLACEMENT AND INTERNSHIP POLICY
SECTION 1: ELIGIBILITY & REGISTRATION
1.1 Academic Cutoff: Students must have a minimum aggregate CPI of 6.50 at the end of the 6th semester with NO active backlogs to participate in campus placement drives.
1.2 Training Requirement: Attendance of 80% in Soft Skills and Placement Training Workshops conducted by the Career Development Cell (CDC) is compulsory.

[Page 2]
SECTION 2: ONE STUDENT ONE JOB RULE
2.1 Dream Offer Exemption: Once a student receives a placement offer, they are deemed placed and debarred from subsequent campus drives, EXCEPT for companies designated as 'Dream Offers' (Package >= 15 LPA) or 'Super Dream Offers' (Package >= 25 LPA).
2.2 Summer Internships: 8-week summer internship at the end of 6th semester carries 4 academic credits.`
  },
  {
    id: 'sample-hostel-scholarship',
    name: 'Hostel_&_Scholarship_Regulations.pdf',
    category: 'Hostel & Scholarship',
    pageCount: 6,
    content: `[Page 1]
SCHOLARSHIP AND HOSTEL TIMINGS POLICY
SECTION 1: MERIT SCHOLARSHIPS
1.1 Merit-Cum-Means Scholarship: Available to students with annual family income below Rs. 6 Lakhs and minimum CPI of 7.50. Covers 50% tuition fee waiver.
1.2 Renewal: Scholarship renewal requires maintaining a CPI >= 7.50 without any backlog in any semester.

[Page 2]
SECTION 2: HOSTEL CURFEW & CODE OF CONDUCT
2.1 In-Time Rule: All hostellers must return to their respective hostel premises before 10:00 PM on weekdays and 10:30 PM on weekends/holidays.
2.2 Late Entry Penalty: Late entry without prior permission from Warden incurs a fine of Rs. 200 for 1st offense and Rs. 500 for subsequent offenses.`
  }
];
