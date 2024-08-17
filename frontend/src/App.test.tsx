// App.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders header text', () => {
  render(<App />);
  const headerElement = screen.getByText(/Welcome to React/i);
  expect(headerElement).toBeInTheDocument();
});

test('handles button click', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', { name: /Click me/i });
  fireEvent.click(buttonElement);
  const resultElement = screen.getByText(/Button clicked/i);
  expect(resultElement).toBeInTheDocument();
});
