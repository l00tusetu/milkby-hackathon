import React from 'react';

interface CategoryIconProps {
    categoryId: string;
    className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
    categoryId,
    className = 'w-9 h-9',
}) => {
    switch (categoryId) {
        case 'all':
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
                <rect x="8" y="8" width="13.5" height="13.5" rx="4" fill="currentColor" />
                <rect
                x="26.5"
                y="8"
                width="13.5"
                height="13.5"
                rx="4"
                fill="currentColor"
                fillOpacity="0.4"
                />
                <rect x="8" y="26.5" width="13.5" height="13.5" rx="4" fill="currentColor" />
                <rect x="26.5" y="26.5" width="13.5" height="13.5" rx="4" fill="currentColor" />
                </svg>
            );

        case 'milk':
            // Bottle silhouette with curved milk wave (inspired by milk.by)
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
                <rect x="19" y="6" width="10" height="3.5" rx="1.75" fill="currentColor" />
                <path
                d="M20 9.5H28V13.2C28 15.6 33 17.6 33 22.8V24.6C29.5 22.8 26.8 22.8 24 24.6C21.2 26.4 18.5 26.4 15 24.6V22.8C15 17.6 20 15.6 20 13.2V9.5Z"
                fill="currentColor"
                fillOpacity="0.28"
                />
                <path
                d="M15 24.6C18.5 26.4 21.2 26.4 24 24.6C26.8 22.8 29.5 22.8 33 24.6V37.5C33 39.985 30.985 42 28.5 42H19.5C17.015 42 15 39.985 15 37.5V24.6Z"
                fill="currentColor"
                />
                </svg>
            );

        case 'cheese':
            // 3D Cheese wheel with separated wedge slice (inspired by milk.by)
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
                <path
                d="M22 21L36.2 20.5C35.7 15.6 29.6 12 22 12C13.7 12 7 15.8 7 20.5C7 24.7 12.4 28.2 19.6 28.8L22 21Z"
                fill="currentColor"
                fillOpacity="0.45"
                />
                <path
                d="M7 20.5C7 24.7 12.4 28.2 19.6 28.8V37.2C12.4 36.6 7 33.1 7 28.9V20.5Z"
                fill="currentColor"
                />
                <path
                d="M19.6 28.8L22 21V29.4L19.6 37.2V28.8Z"
                fill="currentColor"
                fillOpacity="0.72"
                />
                <path
                d="M22 21L36.2 20.5V28.6L22 29.4V21Z"
                fill="currentColor"
                fillOpacity="0.25"
                />
                {/* Separated front wedge */}
                <path
                d="M26.5 24.2L41 23.6C40.4 26.9 36.3 29.7 31 30.9L26.5 24.2Z"
                fill="currentColor"
                fillOpacity="0.58"
                />
                <path
                d="M31 30.9C36.3 29.7 40.4 26.9 41 23.6V31.8C40.4 35.1 36.3 37.9 31 39.1V30.9Z"
                fill="currentColor"
                />
                <path
                d="M26.5 24.2L31 30.9V39.1L26.5 32.4V24.2Z"
                fill="currentColor"
                fillOpacity="0.8"
                />
                </svg>
            );

        case 'butter':
            // Isometric 3D butter brick on base plate (inspired by milk.by)
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
                <path
                d="M7 26.8L22 35.2L41 24.8V28.5L22 39L7 30.5V26.8Z"
                fill="currentColor"
                fillOpacity="0.35"
                />
                <path
                d="M11 21.5L24.2 14L37.4 21.5L24.2 29L11 21.5Z"
                fill="currentColor"
                fillOpacity="0.55"
                />
                <path d="M11 21.5L24.2 29V34.8L11 27.3V21.5Z" fill="currentColor" />
                <path
                d="M24.2 29L37.4 21.5V27.3L24.2 34.8V29Z"
                fill="currentColor"
                fillOpacity="0.78"
                />
                </svg>
            );

        case 'desserts':
            // Dessert cup with diagonal spoon (inspired by milk.by)
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
                <path
                d="M29.4 17.5L34.5 9.4C35.1 8.4 36.4 8.1 37.3 8.7C38.2 9.3 38.5 10.6 37.9 11.5L34 17.8L29.4 17.5Z"
                fill="currentColor"
                />
                <rect x="12.5" y="17" width="23" height="4" rx="2" fill="currentColor" fillOpacity="0.45" />
                <path
                d="M14.5 21H33.5L31.2 37.6C30.9 39.6 29.2 41 27.2 41H20.8C18.8 41 17.1 39.6 16.8 37.6L14.5 21Z"
                fill="currentColor"
                />
                </svg>
            );

        case 'yogurt':
            // Greek yogurt cup with creamy dome swirl & spoon
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
                <path
                d="M29 15.5L33.8 8.8C34.4 7.9 35.6 7.7 36.5 8.3C37.4 8.9 37.6 10.1 37 11L33 16.5L29 15.5Z"
                fill="currentColor"
                fillOpacity="0.65"
                />
                <path
                d="M15.5 18.5C15.5 13.8 19.3 10.5 24 10.5C28.7 10.5 32.5 13.8 32.5 18.5H15.5Z"
                fill="currentColor"
                fillOpacity="0.4"
                />
                <rect x="12" y="18" width="24" height="3.5" rx="1.75" fill="currentColor" fillOpacity="0.6" />
                <path
                d="M14 21.5H34L31.7 37.6C31.4 39.6 29.7 41 27.7 41H20.3C18.3 41 16.6 39.6 16.3 37.6L14 21.5Z"
                fill="currentColor"
                />
                </svg>
            );

        case 'fermented':
            // Kefir bottle with probiotic bubbles
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
                <rect x="18.5" y="6" width="11" height="3.5" rx="1.75" fill="currentColor" />
                <path
                d="M19.5 9.5H28.5V13.5C28.5 15.8 33.5 17.8 33.5 23V37.5C33.5 39.985 31.485 42 29 42H19C16.515 42 14.5 39.985 14.5 37.5V23C14.5 17.8 19.5 15.8 19.5 13.5V9.5Z"
                fill="currentColor"
                fillOpacity="0.28"
                />
                <path
                d="M14.5 22C14.5 18.8 17.5 17 19.5 15.5H28.5C30.5 17 33.5 18.8 33.5 22V37.5C33.5 39.985 31.485 42 29 42H19C16.515 42 14.5 39.985 14.5 37.5V22Z"
                fill="currentColor"
                />
                <circle cx="21" cy="27" r="2.2" fill="white" fillOpacity="0.45" />
                <circle cx="27" cy="33" r="1.7" fill="white" fillOpacity="0.45" />
                <circle cx="26.5" cy="24" r="1.2" fill="white" fillOpacity="0.45" />
                </svg>
            );

        case 'sour-cream':
            // Wide sour cream pot with lid & spoon
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
                <path
                d="M28 16L33.5 9.5C34.2 8.7 35.4 8.6 36.2 9.3C37 10 37.1 11.2 36.4 12L32.5 16.5L28 16Z"
                fill="currentColor"
                fillOpacity="0.65"
                />
                <rect x="9.5" y="16" width="29" height="4" rx="2" fill="currentColor" fillOpacity="0.45" />
                <path
                d="M12 20H36L33.6 37.6C33.3 39.6 31.6 41 29.6 41H18.4C16.4 41 14.7 39.6 14.4 37.6L12 20Z"
                fill="currentColor"
                />
                </svg>
            );

        case 'tvorog':
            // Bowl with crumbly cottage cheese / tvorog curds
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
                <circle cx="17.5" cy="20" r="4" fill="currentColor" fillOpacity="0.48" />
                <circle cx="24" cy="17.5" r="4.5" fill="currentColor" fillOpacity="0.65" />
                <circle cx="30.5" cy="20" r="4" fill="currentColor" fillOpacity="0.48" />
                <path
                d="M9 23.5H39C39 32.889 32.284 40.5 24 40.5C15.716 40.5 9 32.889 9 23.5Z"
                fill="currentColor"
                />
                </svg>
            );

        case 'ice-cream':
            // Classic rounded popsicle on stick (inspired by milk.by)
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
                <rect x="15.5" y="7" width="17" height="25" rx="8.5" fill="currentColor" />
                <path
                d="M15.5 23.5C18.5 25.2 21 25.2 24 23.5C27 21.8 29.5 21.8 32.5 23.5C32.5 28.2 28.7 32 24 32C19.3 32 15.5 28.2 15.5 23.5Z"
                fill="currentColor"
                fillOpacity="0.65"
                />
                <rect
                x="21.5"
                y="32"
                width="5"
                height="10"
                rx="2.5"
                fill="currentColor"
                fillOpacity="0.52"
                />
                </svg>
            );

        case 'cream':
            // Aseptic Tetra Pak / Gable carton with droplet
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
                <path d="M15 16.5L24 9L33 16.5H15Z" fill="currentColor" fillOpacity="0.45" />
                <rect x="19" y="6.5" width="10" height="2.8" rx="1.4" fill="currentColor" />
                <path
                d="M15 16.5H33V38.5C33 39.881 31.881 41 30.5 41H17.5C16.119 41 15 39.881 15 38.5V16.5Z"
                fill="currentColor"
                />
                <path
                d="M24 22.5C24 22.5 28 27.3 28 30.1C28 32.3 26.2 34.1 24 34.1C21.8 34.1 20 32.3 20 30.1C20 27.3 24 22.5 24 22.5Z"
                fill="white"
                fillOpacity="0.4"
                />
                </svg>
            );

        case 'dry-dairy':
            // Gusseted kraft bag with folded seal (inspired by milk.by)
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
                <rect x="14.5" y="7.5" width="19" height="4.5" rx="1.5" fill="currentColor" />
                <path
                d="M15 13.5H33L36.5 39.5C36.6 40.3 36 41 35.2 41H12.8C12 41 11.4 40.3 11.5 39.5L15 13.5Z"
                fill="currentColor"
                fillOpacity="0.88"
                />
                <path d="M16 41L19.5 32.5L23 41H16Z" fill="currentColor" fillOpacity="0.45" />
                <path d="M25 41L28.5 32.5L32 41H25Z" fill="currentColor" fillOpacity="0.45" />
                </svg>
            );

        case 'other':
            // Drinking glass with water/whey droplet inside (inspired by milk.by)
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
                <path
                d="M12.5 10.5H35.5L32.1 38.4C31.9 40.2 30.4 41.5 28.6 41.5H19.4C17.6 41.5 16.1 40.2 15.9 38.4L12.5 10.5Z"
                fill="currentColor"
                fillOpacity="0.22"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinejoin="round"
                />
                <path
                d="M24 18.5C24 18.5 29.2 24.7 29.2 28.4C29.2 31.3 26.9 33.6 24 33.6C21.1 33.6 18.8 31.3 18.8 28.4C18.8 24.7 24 18.5 24 18.5Z"
                fill="currentColor"
                />
                </svg>
            );

        default:
            return (
                <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
                <path
                d="M24 9C24 9 35 21.8 35 29.5C35 35.8 30.1 40.5 24 40.5C17.9 40.5 13 35.8 13 29.5C13 21.8 24 9 24 9Z"
                fill="currentColor"
                fillOpacity="0.88"
                />
                </svg>
            );
    }
};
