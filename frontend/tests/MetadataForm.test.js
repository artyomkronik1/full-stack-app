// MetadataForm.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import MetadataForm from '../src/components/MetadataForm';
import '@testing-library/jest-dom';
import axios from 'axios';

test('renders MetadataForm with initial state', () => {
	render(<MetadataForm />);

	// Check if the form renders
	expect(screen.getByText('URL Metadata Fetcher')).toBeInTheDocument();

	// Check initial URL inputs
	expect(screen.getAllByPlaceholderText('Enter URL')).toHaveLength(3);

	// Check initial state of button
	expect(screen.getByText('Submit')).toBeInTheDocument();
	expect(screen.queryByRole('status')).toBeNull();

	// Check for absence of error and metadata
	expect(screen.queryByRole('alert')).toBeNull();
	expect(screen.queryByText('title')).toBeNull();
});



test('updates URL state on input change', () => {
	render(<MetadataForm />);

	// Simulate URL input changes
	fireEvent.change(screen.getAllByPlaceholderText('Enter URL')[0], { target: { value: 'http://example.com' } });
	fireEvent.change(screen.getAllByPlaceholderText('Enter URL')[1], { target: { value: 'http://example.org' } });

	// Check if input values are updated
	expect(screen.getAllByDisplayValue('http://example.com')).toHaveLength(1);
	expect(screen.getAllByDisplayValue('http://example.org')).toHaveLength(1);
});



jest.mock('axios');

test('handles form submission successfully', async () => {
	// Mock the axios.post call
	axios.post.mockResolvedValueOnce({
		data: [
			{ title: 'Sample Title', description: 'Sample Description', image: 'http://example.com/image.jpg' }
		]
	});

	render(<MetadataForm />);

	// Simulate form submission
	fireEvent.submit(screen.getByRole('form'));

	// Check if spinner is displayed
	expect(screen.getByRole('status')).toBeInTheDocument();

	// Wait for metadata to be displayed
	await waitFor(() => expect(screen.getByText('Sample Title')).toBeInTheDocument());
	expect(screen.getByText('Sample Description')).toBeInTheDocument();
	expect(screen.getByAltText('Sample Title')).toBeInTheDocument();
});

test('handles form submission error', async () => {
	// Mock the axios.post call to reject
	axios.post.mockRejectedValueOnce(new Error('Failed to fetch metadata'));

	render(<MetadataForm />);

	// Simulate form submission
	fireEvent.submit(screen.getByRole('form'));

	// Check if spinner is displayed
	expect(screen.getByRole('status')).toBeInTheDocument();

	// Wait for error message to be displayed
	await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Failed to fetch metadata. Please check your URLs.'));
});


test('displays metadata correctly', () => {
	const metadata = [
		{ title: 'Metadata Title', description: 'Metadata Description', image: 'http://example.com/metadata.jpg' }
	];

	render(<MetadataForm />);

	// Simulate setting metadata directly (you might want to adjust the code if using actual component state)
	// For testing, consider adjusting component to accept props or use a mock state
	// This could be done by refactoring component to accept initial metadata or state

	// Test metadata rendering
	expect(screen.getByText('Metadata Title')).toBeInTheDocument();
	expect(screen.getByText('Metadata Description')).toBeInTheDocument();
	expect(screen.getByAltText('Metadata Title')).toHaveAttribute('src', 'http://example.com/metadata.jpg');
});