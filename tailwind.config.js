module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
            },
            colors: {
                // Primary Brand Colors (matching your logo)
                primary: {
                    50: '#e6f3ff',
                    100: '#b3d9ff',
                    200: '#80bfff',
                    300: '#4da6ff',
                    400: '#1a8cff',
                    500: '#4A90E2', // Main blue from logo
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                secondary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#4CAF50', // Main green from logo
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },

                // Medical/Healthcare themed colors
                medical: {
                    blue: '#4A90E2',
                    green: '#4CAF50',
                    mint: '#10B981',
                    teal: '#14B8A6',
                    lightBlue: '#67C3F3',
                    darkBlue: '#1E40AF',
                },

                // Neutral colors for UI
                neutral: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },

                // Status colors
                success: {
                    light: '#D1FAE5',
                    default: '#10B981',
                    dark: '#047857',
                },
                warning: {
                    light: '#FEF3C7',
                    default: '#F59E0B',
                    dark: '#D97706',
                },
                error: {
                    light: '#FEE2E2',
                    default: '#EF4444',
                    dark: '#DC2626',
                },
                info: {
                    light: '#DBEAFE',
                    default: '#3B82F6',
                    dark: '#1D4ED8',
                },

                // Background variations
                background: {
                    primary: '#FFFFFF',
                    secondary: '#F8FAFC',
                    tertiary: '#F1F5F9',
                    accent: '#E6F3FF',
                },

                // Text variations
                text: {
                    primary: '#1E293B',
                    secondary: '#475569',
                    tertiary: '#64748B',
                    accent: '#4A90E2',
                    success: '#059669',
                    warning: '#D97706',
                    error: '#DC2626',
                },
            },

            // Custom spacing for healthcare UI
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },

            // Custom border radius
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },

            // Custom box shadows for cards/components
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'medical': '0 4px 20px -2px rgba(74, 144, 226, 0.1)',
                'success': '0 4px 20px -2px rgba(16, 185, 129, 0.1)',
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            },
        },
    },
    plugins: [],
};