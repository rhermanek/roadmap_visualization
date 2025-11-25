# Roadmap Visualizer

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)

**Roadmap Visualizer** is a modern, interactive web application that transforms standard Excel roadmap files into beautiful, yearly timeline visualizations. Designed for product managers and teams who want to instantly visualize their project plans without complex configuration.

![Demo Screenshot](https://via.placeholder.com/1200x600?text=Roadmap+Visualizer+Demo)

## ✨ Features

- **Instant Visualization:** Drag and drop your Excel file to generate a timeline instantly.
- **Yearly & Quarterly Views:** Automatically organizes items by months and quarters.
- **Goal Grouping:** Visualizes items grouped by strategic goals with distinct color coding.
- **Interactive Details:** Click on any timeline bar to view full item details (Description, Acceptance Criteria, Cost, PD).
- **Smart Parsing:** Auto-detects date ranges and handles various Excel formats.
- **Excel Export:** Export the visualized roadmap back to Excel with a dedicated visualization sheet.
- **Modern UI:** Built with a dark-themed, glassmorphism-inspired design using Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/roadmap-visualizer.git
    cd roadmap-visualizer
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 📖 Usage

1.  Open the application in your browser.
2.  Click "Upload Roadmap" or drag and drop your Excel file (`.xlsx`).
3.  The application expects an Excel file with the following columns (headers are auto-detected):
    - `ID`
    - `Name` / `Item`
    - `Goal` (Optional, for grouping)
    - `Start Date`
    - `End Date`
    - `Description` (Optional)
    - `Acceptance Criteria` (Optional)
    - `Cost` (Optional)
    - `PD` (Person Days, Optional)

**Sample files** can be found in the `examples/` directory.

## 🛠️ Tech Stack

- **Frontend Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Excel Processing:** [ExcelJS](https://github.com/exceljs/exceljs)

## 🤝 Contributing

Contributions are welcome! We love seeing the community help improve this project.

1.  **Fork** the repository.
2.  Create a new **Branch** for your feature or bug fix (`git checkout -b feature/amazing-feature`).
3.  **Commit** your changes (`git commit -m 'Add some amazing feature'`).
4.  **Push** to the branch (`git push origin feature/amazing-feature`).
5.  Open a **Pull Request**.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
