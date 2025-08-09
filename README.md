# Testify-AI: Your AI-Powered Test Case Generator

![GitHub stars](https://img.shields.io/github/stars/manish-modanwal/Testify-AI?style=social) ![GitHub forks](https://img.shields.io/github/forks/manish-modanwal/Testify-AI?style=social) ![GitHub last commit](https://img.shields.io/github/last-commit/manish-modanwal/Testify-AI)

Testify-AI is a powerful, AI-driven tool designed to streamline your development workflow by generating high-quality test cases for a wide range of programming languages and frameworks. Log in with your GitHub account, select your repository, and let AI do the hard work of writing comprehensive tests for you.

---

### **Table of Contents**

- [Key Features](#key-features)
- [Supported Languages & Frameworks](#supported-languages--frameworks)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
- [Deployment](#deployment)
- [Usage](#usage)
- [Live Demo](#live-demo)
- [License](#license)

---

### **Key Features**

- **Seamless GitHub Integration:** Connect directly to your GitHub account to browse and select repositories, files, and branches.
- **AI-Powered Test Generation:** Leveraging Google's advanced Gemini AI model, Testify-AI analyzes your code's logic and generates intelligent test cases.
- **Comprehensive Test Summaries:** Get a clear, structured summary for each file before generating the full test code, allowing you to review and select what you need.
- **Automated Pull Requests:** The tool can automatically create a new branch, add the generated test files, and open a Pull Request in your repository.
- **Clean and Intuitive UI:** A modern, responsive user interface built with React and Tailwind CSS for an exceptional user experience.

### **Supported Languages & Frameworks**

Testify-AI is built to be versatile, supporting a wide array of popular languages and testing frameworks.

- **JavaScript/TypeScript:**
  - Jest
  - Mocha
  - Cypress
- **Python:**
  - PyTest
  - Selenium
- **Java:**
  - JUnit
- **C/C++:**
  - GoogleTest
- **C#:**
  - NUnit
  - xUnit.net
- **PHP:**
  - PHPUnit
- **Ruby:**
  - RSpec
- **Go:**
  - Go's built-in `testing` package
- **Rust:**
  - Cargo test

---

### **Technologies Used**

- **Frontend:**
  - **React:** A JavaScript library for building user interfaces.
  - **Vite:** A fast build tool.
  - **Tailwind CSS:** A utility-first CSS framework.
  - **Axios:** A promise-based HTTP client.
  - **Vercel:** Used for frontend deployment.

- **Backend:**
  - **Node.js & Express:** The server-side environment and framework.
  - **TypeScript:** The primary language for the backend logic.
  - **Google Gemini API:** The core AI engine.
  - **@octokit/rest:** For seamless GitHub API interactions.
  - **Chalk:** A library for adding color to console output.
  - **dotenv:** To manage environment variables.
  - **cookie-parser:** To parse and manage cookies.
  - **Render:** Used for backend deployment.

---

### **Getting Started**

Follow these steps to get a copy of the project running locally.

#### **Prerequisites**

You will need the following installed:
- Node.js (v18 or higher)
- npm or yarn
- A GitHub account with a registered OAuth App
- A Google Gemini API Key

#### **Local Setup**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/manish-modanwal/Testify-AI.git](https://github.com/manish-modanwal/Testify-AI.git)
    cd Testify-AI
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file with the following variables:
    ```
    GITHUB_CLIENT_ID=your_github_client_id
    GITHUB_CLIENT_SECRET=your_github_client_secret
    GEMINI_API_KEY=your_gemini_api_key
    CLIENT_URL=http://localhost:5173
    ```
    Start the backend:
    ```bash
    npm run dev
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```
    Create a `.env` file with the following variable:
    ```
    VITE_API_URL=http://localhost:3001
    ```
    Start the frontend:
    ```bash
    npm run dev
    ```

4.  Open your browser to `http://localhost:5173`.

---

### **Deployment**

- The **Frontend** is hosted on [Vercel](https://vercel.com).
- The **Backend** is hosted on [Render](https://render.com).

Make sure to set your `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `GEMINI_API_KEY` as environment variables on your Render dashboard and your `VITE_API_URL` on Vercel.

---

### **Usage**

1.  **Login:** Connect your GitHub account.
2.  **Select:** Choose a repository and the files for which you want to generate tests.
3.  **Generate:** Let the AI create detailed test summaries and code.
4.  **Create PR:** The tool will automatically create a Pull Request with the new tests.

---

### **Live Demo**

- **Live App:** [https://testify-ai-sage.vercel.app/]

---

### **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.
