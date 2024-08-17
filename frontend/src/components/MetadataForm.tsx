import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Metadata } from '../interfaces/Metadata';
import FetchdataService from '../services/fetchData.service';

const MetadataForm: React.FC = () => {
	const [urls, setUrls] = useState<string[]>(['', '', '']);
	const [metadata, setMetadata] = useState<Metadata[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	// Update URL state
	const handleChange = (index: number, value: string) => {
		const newUrls = [...urls];
		newUrls[index] = value;
		setUrls(newUrls);
	};

	// Basic URL validation
	const isValidUrl = (url: string) => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	// Handle form submission
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		setError(null);

		// Validate URLs
		if (urls.some(url => !isValidUrl(url))) {
			setError('One or more URLs are invalid. Please check and try again.');
			setLoading(false);
			return;
		}

		try {
			const response = await FetchdataService.fetchData(urls);
			setMetadata(response);
		} catch (err) {
			setError('Failed to fetch metadata. Please check your URLs and try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container>
			<h1 className="my-4">URL Metadata Fetcher</h1>
			<Form onSubmit={handleSubmit} style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
				{urls.map((url, index) => (
					<Form.Group controlId={`url${index}`} key={index}>
						<Form.Label>URL {index + 1}</Form.Label>
						<Form.Control
							type="text"
							value={url}
							onChange={(e) => handleChange(index, e.target.value)}
							placeholder="Enter URL"
							required
						/>
					</Form.Group>
				))}
				<Button variant="primary" type="submit" disabled={loading}>
					{loading ? <Spinner animation="border" size="sm" /> : 'Fetch Data'}
				</Button>
			</Form>
			{error && <Alert variant="danger" className="mt-3">{error}</Alert>}
			<div className="mt-4">
				{metadata.length > 0 && (
					metadata.map((data, index) => (
						<div key={index} className="mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
							<Container>
								<h3 style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{`Metadata ${index + 1}`}</h3>
								<h5>{data.title}</h5>
								<p>{data.description}</p>
								{data.image && <img src={data.image} alt={data.title} style={{ maxWidth: '100%' }} />}
							</Container>
						</div>
					))
				)}
			</div>
		</Container>
	);
};

export default MetadataForm;
