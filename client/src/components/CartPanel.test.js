import { render, screen, fireEvent } from '@testing-library/react';
import CartPanel from './CartPanel';

const emptyForm = {
  customerName: '',
  phone: '',
  email: '',
  pickupTime: '',
  specialInstructions: '',
};

describe('CartPanel', () => {
  it('shows empty cart message', () => {
    render(
      <CartPanel
        cart={[]}
        subtotal={0}
        tax={0}
        total={0}
        form={emptyForm}
        onFormChange={jest.fn()}
        onSubmit={jest.fn()}
        isSubmitting={false}
        error=""
      />
    );

    expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
  });

  it('renders cart lines and totals', () => {
    render(
      <CartPanel
        cart={[
          { id: 'pho-tai', name: 'Phở Tái', price: 14.95, quantity: 2 },
        ]}
        subtotal={29.9}
        tax={1.5}
        total={31.4}
        form={emptyForm}
        onFormChange={jest.fn()}
        onSubmit={jest.fn()}
        isSubmitting={false}
        error=""
      />
    );

    expect(screen.getByText('Phở Tái')).toBeInTheDocument();
    expect(screen.getByText('Qty: 2')).toBeInTheDocument();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getAllByText('$29.90').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('$31.40')).toBeInTheDocument();
  });

  it('submits the checkout form', () => {
    const onSubmit = jest.fn((e) => e.preventDefault());

    render(
      <CartPanel
        cart={[
          { id: 'pho-tai', name: 'Phở Tái', price: 14.95, quantity: 1 },
        ]}
        subtotal={14.95}
        tax={0.75}
        total={15.7}
        form={{ ...emptyForm, customerName: 'Jane', phone: '(907) 222-1234', pickupTime: '6:00 PM' }}
        onFormChange={jest.fn()}
        onSubmit={onSubmit}
        isSubmitting={false}
        error=""
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /place pickup order/i }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
