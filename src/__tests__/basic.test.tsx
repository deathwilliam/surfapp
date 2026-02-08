import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Simple component test
describe('Basic Tests', () => {
    it('should pass a simple assertion', () => {
        expect(true).toBe(true);
    });

    it('should handle array operations', () => {
        const locations = ['El Tunco', 'El Zonte', 'Punta Roca'];
        expect(locations).toHaveLength(3);
        expect(locations).toContain('El Tunco');
    });
});

// Utility function tests
describe('Utility Functions', () => {
    it('should format currency correctly', () => {
        const formatPrice = (price: number) => `$${price.toFixed(2)}`;
        expect(formatPrice(25)).toBe('$25.00');
        expect(formatPrice(19.99)).toBe('$19.99');
    });

    it('should calculate average rating', () => {
        const calculateAverage = (ratings: number[]) =>
            ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

        expect(calculateAverage([5, 4, 5, 4, 5])).toBe(4.6);
        expect(calculateAverage([])).toBe(0);
    });
});

// Mock component test
describe('Component Rendering', () => {
    it('should render a simple div', () => {
        const TestComponent = () => <div data-testid="test">Hello Surf</div>;
        render(<TestComponent />);
        expect(screen.getByTestId('test').textContent).toBe('Hello Surf');
    });

    it('should render with props', () => {
        interface InstructorCardProps {
            name: string;
            rating: number;
        }

        const InstructorCard = ({ name, rating }: InstructorCardProps) => (
            <div data-testid="instructor">
                <span data-testid="name">{name}</span>
                <span data-testid="rating">{rating}</span>
            </div>
        );

        render(<InstructorCard name="Carlos" rating={4.8} />);
        expect(screen.getByTestId('name').textContent).toBe('Carlos');
        expect(screen.getByTestId('rating').textContent).toBe('4.8');
    });
});
