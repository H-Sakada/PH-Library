# Peng Hong Academic Digital Library (Locked-PDF Reader & ABA PayWay)

A secure digital publishing and reading platform tailored for academic institutions (e.g. Royal University of Law and Economics - RULE) and professional book publishers.

Students can browse the catalog and read free sample chapters, while full access requires online payment via **ABA PayWay (Bakong KHQR)**.

---

## 🚀 Key Features

1. **Anti-Piracy "Locked-PDF" Reader (`/books/[id]/read`)**:
   - **Canvas-based rendering**: Disables browser right-click, direct downloads, and inspect shortcuts (`Cmd+S`, `Ctrl+S`, `Cmd+P`, `Ctrl+P`).
   - **Dynamic Student Watermark**: Injects a faint, non-removable diagonal watermark across every page with the authenticated student's name, email, student ID, and timestamp.
   - **Free Sample Preview**: Readers can read the first 2–3 chapters for free. Reaching chapter 4 automatically triggers a paywall overlay with instant ABA PayWay unlock.
   - **Reading Comfort**: Light, Warm Sepia, and Night Dark Mode themes with zoom and fullscreen controls.

2. **ABA PayWay & KHQR Integration (`AbaPaywayModal.tsx`)**:
   - Built to mirror the official ABA Bank PayWay KHQR modal.
   - Generates unique transaction IDs, prices in both USD ($) and KHR (៛), and supports instant checkout via ABA Mobile or any Bakong-interoperable banking app.
   - Includes an instant payment simulator so your client can test the complete unlock workflow today before live merchant API keys are connected.

3. **Student Bookshelf (`/my-library`)**:
   - Displays all textbooks the student has purchased with digital receipts and instant resume-reading actions.

4. **Publisher Admin Dashboard (`/admin`)**:
   - Manage published textbooks, monitor revenue (USD / KHR), and upload new books with custom sample preview page limits.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, TypeScript)
- **Styling**: Tailwind CSS v4 & Lucide React
- **Payments**: ABA PayWay & Bakong KHQR (Sandbox/Production ready)
- **State & Persistence**: LocalStorage client layer (ready for Supabase PostgreSQL & Auth)

---

## 🏃 Running the Application

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to test the app.

---

## 📋 How to Test the Locked Reader Workflow

1. Open [http://localhost:3000](http://localhost:3000) and pick any textbook (e.g., **"Commercial Law & Corporate Governance in Cambodia"**).
2. Click **Preview** to open the reader.
3. Read pages 1 to 3 freely.
4. Click **Next** to navigate to page 4.
5. Notice the blurred paywall: **"Restricted Academic Content"**.
6. Click **Pay with ABA PayWay (KHQR)**.
7. Click **Simulate Payment & Unlock Now** in the modal.
8. The paywall will immediately clear, allowing full access to all chapters with the student's dynamic watermark.
9. Click **Reset Demo** in the top navbar at any time to re-lock the books for another demonstration.
