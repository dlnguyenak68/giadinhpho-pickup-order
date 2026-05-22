import { render, screen, fireEvent } from '@testing-library/react';
import MenuSection from './MenuSection';

const categories = [
  { id: 'pho', label: 'Phở' },
  { id: 'drinks', label: 'Drinks' },
];

const items = [
  {
    id: 'pho-tai',
    category: 'pho',
    name: 'Phở Tái',
    description: 'Beef pho',
    price: 14.95,
    popular: true,
  },
  {
    id: 'iced-coffee',
    category: 'drinks',
    name: 'Vietnamese Iced Coffee',
    description: 'Coffee with milk',
    price: 4.95,
    popular: false,
  },
];

const defaultProps = {
  categories,
  items,
  isLoading: false,
  error: '',
  cart: [],
  onAddItem: jest.fn(),
  onUpdateQuantity: jest.fn(),
};

describe('MenuSection', () => {
  it('shows loading state', () => {
    render(<MenuSection {...defaultProps} isLoading />);
    expect(screen.getByText(/loading menu/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(
      <MenuSection {...defaultProps} error="Could not load menu." />
    );
    expect(screen.getByText('Could not load menu.')).toBeInTheDocument();
  });

  it('renders menu items for the first category', () => {
    render(<MenuSection {...defaultProps} />);
    expect(screen.getByText('Phở Tái')).toBeInTheDocument();
    expect(screen.getByText('Popular')).toBeInTheDocument();
    expect(screen.queryByText('Vietnamese Iced Coffee')).not.toBeInTheDocument();
  });

  it('calls onAddItem when Add is clicked', () => {
    const onAddItem = jest.fn();
    render(<MenuSection {...defaultProps} onAddItem={onAddItem} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(onAddItem).toHaveBeenCalledWith(items[0]);
  });

  it('switches category when tab is clicked', () => {
    render(<MenuSection {...defaultProps} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Drinks' }));
    expect(screen.getByText('Vietnamese Iced Coffee')).toBeInTheDocument();
    expect(screen.queryByText('Phở Tái')).not.toBeInTheDocument();
  });
});
