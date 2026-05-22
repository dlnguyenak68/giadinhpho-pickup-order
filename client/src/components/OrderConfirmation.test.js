import { render, screen, fireEvent } from '@testing-library/react';
import OrderConfirmation from './OrderConfirmation';

const order = {
  id: 'ABC12345',
  customerName: 'Jane Doe',
  phone: '(907) 222-1234',
  email: 'jane@example.com',
  pickupTime: '6:00 PM',
  specialInstructions: 'Extra lime',
  total: 15.7,
};

describe('OrderConfirmation', () => {
  it('displays order details', () => {
    render(<OrderConfirmation order={order} onNewOrder={jest.fn()} />);

    expect(screen.getByText(/thank you/i)).toBeInTheDocument();
    expect(screen.getByText('Order #ABC12345')).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    expect(screen.getByText(/6:00 PM/)).toBeInTheDocument();
    expect(screen.getByText('$15.70')).toBeInTheDocument();
    expect(screen.getByText(/Extra lime/)).toBeInTheDocument();
  });

  it('calls onNewOrder when button is clicked', () => {
    const onNewOrder = jest.fn();
    render(<OrderConfirmation order={order} onNewOrder={onNewOrder} />);

    fireEvent.click(screen.getByRole('button', { name: /place another order/i }));
    expect(onNewOrder).toHaveBeenCalled();
  });
});
